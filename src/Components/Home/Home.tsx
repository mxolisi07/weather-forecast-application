import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome, FaSave, FaLock, FaSun, FaMoon,
  FaCalendarDay, FaClock, FaTint, FaWind, FaEye, FaSearch, FaBars, FaTimes
} from "react-icons/fa";
import { useWeather } from "../WeatherContext/WeatherContext";

import "./Home.css";

const API_KEY = import.meta.env.VITE_API_KEY;

function WeatherLayout() {
  const { data, setData, unit, setUnit, theme, setTheme, savedLocations, setSavedLocations } = useWeather();
  
  const [, setView] = useState("daily");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchForecastByCity = useCallback(async (city: string) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
      );
      const json = await res.json();
      if (json.cod && json.cod !== "200") throw new Error(json.message || "API error");
      setData(json);
      if (json.city && json.city.coord) fetchAlerts(json.city.coord.lat, json.city.coord.lon);
    } catch (err) {
      console.error("Fetch by city failed:", err);
      alert("Could not load weather for that location.");
    }
  }, []);

  const fetchForecastByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const json = await res.json();
      if (json.cod && json.cod !== "200") throw new Error(json.message || "API error");
      setData(json);
      fetchAlerts(lat, lon);
    } catch (err) {
      console.error("Fetch by coords failed:", err);
    }
  }, []);

  const fetchAlerts = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}`
      );
      const json = await res.json();
      if (json.alerts && json.alerts.length > 0) {
        if ("Notification" in window && Notification.permission !== "granted") {
          await Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
          const alertItem = json.alerts[0];
          new Notification("Weather Alert: " + (alertItem.event || "Alert"), {
            body: alertItem.description ? alertItem.description.slice(0, 200) : "Check weather alerts.",
          });
        }
      }
    } catch (err) {
      console.debug("Alerts fetch failed (likely OneCall not available):", err);
    }
  }, []);

  useEffect(() => {
    let didCancel = false;
    async function detect() {
      if (!navigator.geolocation) {
        await fetchForecastByCity("Kimberley");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (didCancel) return;
          const { latitude, longitude } = pos.coords;
          await fetchForecastByCoords(latitude, longitude);
        },
        async () => {
          if (didCancel) return;
          await fetchForecastByCity("Kimberley");
        },
      );
    }
    detect();
    return () => { didCancel = true; };
  }, [fetchForecastByCity, fetchForecastByCoords]);

  // Persist saved locations
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedCities") || "[]");
    if (stored && stored.length && savedLocations.length === 0) {
      setSavedLocations(stored);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function convertTemp(kelvin : number) {
    if (unit === "C") return (kelvin - 273.15).toFixed(1);
    return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(1);
  }

  function handleSave() {
    if (!data || !data.city) return;
    const cityName = data.city.name;
    if (!savedLocations.includes(cityName)) {
      const updated = [...savedLocations, cityName];
      setSavedLocations(updated);
      localStorage.setItem("savedCities", JSON.stringify(updated));
    } else {
      alert(`${cityName} is already saved.`);
    }
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query) return;
    await fetchForecastByCity(query);
    setQuery("");
    navigate("/");
    setSidebarOpen(false);
  }

  

  // Close sidebar when route changes or on overlay click
  function closeSidebar() {
    setSidebarOpen(false);
  }

  if (!data || !data.list) {
    return (
      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen && window.innerWidth < 880}>
          <div className="sidebar-top">
            <h2 className="logo">WeatherApp</h2>
            <button className="close-sidebar" onClick={closeSidebar} aria-label="Close menu"><FaTimes /></button>
          </div>
          <nav>
            <Link to="/" onClick={closeSidebar}><FaHome /> Home</Link>
            <Link to="/saved" onClick={closeSidebar}><FaSave /> Saved</Link>
            <Link to="/privacy" onClick={closeSidebar}><FaLock /> Privacy</Link>
          </nav>
        </aside>

        {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}

        <div className="content">
          <header className="topbar">
            <div className="left-header">
              <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><FaBars /></button>
              <div className="nav-buttons">
                <button className="nav-btn" onClick={() => { setView("daily"); navigate("/daily"); }}> <FaCalendarDay /> Daily</button>
                <button className="nav-btn" onClick={() => { setView("hourly"); navigate("/hourly"); }}> <FaClock /> Hourly</button>
              </div>
            </div>

            <div className="right-header">
              <form onSubmit={handleSearch} className="search-bar">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city..." />
                <button type="submit"><FaSearch /></button>
              </form>
              <button className="icon-btn" onClick={() => setUnit(unit === "C" ? "F" : "C")}>{unit === "C" ? <FaSun /> : <FaMoon />} <span className="btn-label">°{unit}</span></button>
              <button className="icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <FaMoon /> : <FaSun />}</button>
              <button className="primary" onClick={handleSave}><FaSave /> Save</button>
            </div>
          </header>

          <main className="empty-state">
            <p>Loading weather data…</p>
          </main>
        </div>
      </div>
    );
  }

  const dailyMap: Record<string, any[]> = {};
  data.list.forEach((item: { dt: number }) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });
  const dailySummaries = Object.entries(dailyMap).slice(0, 7);

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen && window.innerWidth < 880}>
        <div className="sidebar-top">
          <h2 className="logo">WeatherApp</h2>
          <button className="close-sidebar" onClick={closeSidebar} aria-label="Close menu"><FaTimes /></button>
        </div>

        <nav>
          <Link to="/" onClick={closeSidebar}><FaHome /> Home</Link>
          <Link to="/saved" onClick={closeSidebar}><FaSave /> Saved</Link>
          <Link to="/privacy" onClick={closeSidebar}><FaLock /> Privacy</Link>
        </nav>

        
      </aside>

      {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}

      <div className="content">
        <header className="topbar">
          <div className="left-header">
            <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><FaBars /></button>
            <h1 className="location-title">{data.city.name}</h1>
            <div className="nav-buttons">
              <button className="nav-btn" onClick={() => navigate("/daily", { state: { forecast: data, unit } })}>
                <FaCalendarDay /> Daily
              </button>
              <button className="nav-btn" onClick={() => navigate("/hourly", { state: { forecast: data, unit } })}>
                <FaClock /> Hourly
              </button>
            </div>
          </div>

          <div className="right-header">
            <form onSubmit={handleSearch} className="search-bar">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city..." />
              <button type="submit"><FaSearch /></button>
            </form>

            <button className="icon-btn" onClick={() => setUnit(unit === "C" ? "F" : "C")}>
              {unit === "C" ? <FaSun /> : <FaMoon />} <span className="btn-label">°{unit}</span>
            </button>

            <button className="icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <FaMoon /> : <FaSun />} <span className="btn-label">{theme === "light" ? "Dark" : "Light"}</span>
            </button>

            <button className="primary" onClick={handleSave}><FaSave /> Save</button>
          </div>
        </header>

        <main className="grid-cards">
          <section className="card forecast-card" aria-label="5 day forecast">
            <h3>5‑Day Forecast</h3>
            <ul className="forecast-list">
              {dailySummaries.map(([, items], i) => {
                const temps = items.map(f => f.main.temp);
                const max = Math.max(...temps);
                const min = Math.min(...temps);
                const humidity = items[0].main.humidity;
                const icon = items[0].weather[0].icon;
                return (
                  <li key={i} className="forecast-item">
                    <div className="left">
                      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
                      <div className="day">{i === 0 ? "Today" : new Date(items[0].dt * 1000).toLocaleDateString()}</div>
                    </div>
                    <div className="center">
                      <div className="temps">{convertTemp(max)}° / {convertTemp(min)}°</div>
                      <div className="cond">{items[0].weather[0].main}</div>
                    </div>
                    <div className="right">
                      <div className="humidity"><FaTint /> {humidity}%</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card today-card" aria-label="today summary">
            <h3>Today</h3>
            <div className="today-main">
              <div className="temp-block">
                <img src={`https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`} alt="" />
                <div className="temp-large">{convertTemp(data.list[0].main.temp)}°{unit}</div>
                <div className="cond-large">{data.list[0].weather[0].description}</div>
              </div>

              <div className="stats">
                <div className="stat"><FaTint /> <span>Humidity</span><strong>{data.list[0].main.humidity}%</strong></div>
                <div className="stat"><FaWind /> <span>Wind</span><strong>{data.list[0].wind.speed} m/s</strong></div>
                <div className="stat"><FaEye /> <span>Visibility</span><strong>{(data.list[0].visibility/1000).toFixed(1)} km</strong></div>
                <div className="stat"><FaTint /> <span>Dew Point</span><strong>{convertTemp(data.list[0].main.temp_min)}°{unit}</strong></div>
              </div>
            </div>

            <div className="hourly-strip">
              {data.list.slice(0, 8).map((hour: { dt: number; weather: { icon: string }[]; main: { temp: number } }, i: number) => (
                <div key={i} className="hour">
                  <div className="hour-time">{new Date(hour.dt * 1000).getHours()}:00</div>
                  <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt="" />
                  <div className="hour-temp">{convertTemp(hour.main.temp)}°</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default WeatherLayout

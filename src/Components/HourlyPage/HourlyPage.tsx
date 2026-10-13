import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useWeather } from "../WeatherContext/WeatherContext";

export default function HourlyPage() {
  const { data, unit } = useWeather();
  if (!data) return <p>No forecast data available.</p>;

  function convertTemp(k : number) {
    return unit === "C"
      ? (k - 273.15).toFixed(1)
      : (((k - 273.15) * 9) / 5 + 32).toFixed(1);
  }

  return (
    <div className="page2">
      <Link to="/" className="back2"><FaArrowLeft /> Back</Link>
      <h2>Hourly Forecast</h2>
      <div className="grid-cards2">
        {data.list.slice(0, 24).map((hour: { dt: number; weather: { icon: string; description: string }[]; main: { temp: number } }, i: number) => (
          <section key={i} className="card hourly-card2">
            <h3>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
            <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="" />
            <div className="hour-temp2">{convertTemp(hour.main.temp)}°{unit}</div>
            <div className="hour-cond2">{hour.weather[0].description}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

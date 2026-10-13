import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { useWeather } from "../WeatherContext/WeatherContext";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function SavedLocationsPage() {
  const { savedLocations, setSavedLocations, setData } = useWeather();

  async function handleLoad(city : string) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
      );
      const json = await res.json();
      if (json.cod && json.cod !== "200") throw new Error(json.message || "API error");
      setData(json); // update forecast in WeatherLayout
      
    } catch (err) {
      console.error("Failed to load city:", err);
      alert("Could not load weather for " + city);
    }
  }

  function handleDelete(city : string) {
    const updated = savedLocations.filter(c => c !== city);
    setSavedLocations(updated);
    localStorage.setItem("savedCities", JSON.stringify(updated));
  }

  return (
    <div className="page2">
      <Link to="/" className="back2"><FaArrowLeft /> Back</Link>
      <h2>Saved Locations</h2>

      {savedLocations.length === 0 ? (
        <p>No saved locations yet.</p>
      ) : (
        <div className="grid-cards2">
          {savedLocations.map((city, i) => (
            <section key={i} className="card saved-card">
              <h3><FaMapMarkerAlt /> {city}</h3>
              <div className="saved-actions">
                <button className="primary" onClick={() => handleLoad(city)}>Load</button>
                <button className="trash" onClick={() => handleDelete(city)}><FaTrash /> Delete</button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

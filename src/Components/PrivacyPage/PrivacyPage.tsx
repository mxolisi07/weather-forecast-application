import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaDatabase, FaLock, FaUserShield } from "react-icons/fa";
import "./Privacy.css"
import { useWeather } from "../WeatherContext/WeatherContext";

export default function PrivacyPage() {

  const { setData, setSavedLocations, setUnit, setTheme } = useWeather();

  function handleDeleteData() {
    
    localStorage.removeItem("cachedWeather");
    localStorage.removeItem("savedCities");

    setData(null);
    setSavedLocations([]);
    setUnit("C");
    setTheme("light");

    alert("All cached weather data, saved cities, and preferences have been deleted.");
  }

  return (
    <div className="page3">
      <Link to="/" className="back2"><FaArrowLeft /> Back</Link>
      <h2><FaShieldAlt /> Privacy & Security</h2>

      <div className="grid-cards3">
        <section className="card-privacy-card2">
          <h3><FaUserShield /> Your Privacy Matters</h3>
          <p>We believe you should know exactly how your data is used. This page explains it in plain language.</p>
        </section>

        <section className="card-privacy-card2">
          <h3><FaDatabase /> Why We Collect It</h3>
          <p>Your location is used for one purpose: to show you the weather where you are. We never sell your data. We never share it with advertisers.</p>
        </section>

        <section className="card-privacy-card2">
          <h3><FaLock /> What We Collect</h3>
          <ul>
            <li>Your location (GPS coordinates) — only when you grant permission</li>
            <li>Your saved cities — stored on your device only</li>
            <li>Your preferences — theme, units (°C/°F)</li>
            <li>We do NOT collect: your name, email, contacts, browsing history</li>
          </ul>
        </section>

        <section className="card-privacy-card2">
          <h3><FaShieldAlt /> How We Store It</h3>
          <p>100% on your device (LocalStorage — like a notebook inside your phone). We do NOT upload your location to our servers.</p>
          
        </section>
        
      </div>
      <button className="danger-btn2" onClick={handleDeleteData}>Delete Data</button>
    </div>
    
  );
}

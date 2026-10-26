import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './Components/Home/Home'
import { WeatherProvider } from './Components/WeatherContext/WeatherContext';
import DailyPage from "./Components/DailyPage/DailyPage";
import HourlyPage from "./Components/HourlyPage/HourlyPage";
import SavedLocPage from "./Components/SavedLocations/SavedLocPage";
import PrivacyPage from "./Components/PrivacyPage/PrivacyPage";

function App() {
  return (
    <WeatherProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/hourly" element={<HourlyPage />} />
        <Route path="/saved" element={<SavedLocPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </Router>
    </WeatherProvider>
  );
}

export default App

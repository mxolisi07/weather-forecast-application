import React, { createContext, useState, useContext, useEffect } from "react";

type WeatherContextType = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  savedLocations: any[];
  setSavedLocations: React.Dispatch<React.SetStateAction<any[]>>;
  offline: boolean;
};

const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");
  const [savedLocations, setSavedLocations] = useState<any[]>(
    JSON.parse(localStorage.getItem("savedCities") || "[]")
  );
  const [offline, setOffline] = useState(!navigator.onLine);

  // Save forecast to localStorage whenever it updates
  useEffect(() => {
    if (data) {
      localStorage.setItem("cachedWeather", JSON.stringify({
        timestamp: Date.now(),
        forecast: data
      }));
    }
  }, [data]);

  // Listen for online/offline events
  useEffect(() => {
    function handleOnline() { setOffline(false); }
    function handleOffline() { setOffline(true); }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load cached forecast if offline
  useEffect(() => {
    if (offline) {
      const cached = JSON.parse(localStorage.getItem("cachedWeather") ?? "null");
      if (cached) {
        setData(cached.forecast);
      }
    }
  }, [offline]);

  return (
    <WeatherContext.Provider
      value={{
        data, setData,
        unit, setUnit,
        theme, setTheme,
        savedLocations, setSavedLocations,
        offline
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }

  return context;
}

import React, { createContext, useState, useContext } from "react";

type WeatherContextType = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  savedLocations: any[];
  setSavedLocations: React.Dispatch<React.SetStateAction<any[]>>;
};

const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");
  const [savedLocations, setSavedLocations] = useState<any[]>(
    JSON.parse(localStorage.getItem("savedCities") || "[]")
  );

  return (
    <WeatherContext.Provider
      value={{ data, setData, unit, setUnit, theme, setTheme, savedLocations, setSavedLocations }}
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

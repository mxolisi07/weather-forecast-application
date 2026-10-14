import {  Link } from "react-router-dom";
import { FaArrowLeft, FaTint } from "react-icons/fa";
import { useWeather } from "../WeatherContext/WeatherContext";

type ForecastItem = {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { icon: string; main: string }[];
};

export default function DailyPage() {
  const { data, unit } = useWeather();
  if (!data) return <p>No forecast data available.</p>;

  const dailyMap: Record<string, ForecastItem[]> = {};
  data.list.forEach((item: ForecastItem) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });

  function convertTemp(k: number) {
    return unit === "C"
      ? (k - 273.15).toFixed(1)
      : (((k - 273.15) * 9) / 5 + 32).toFixed(1);
  }

  return (
    <div className="page2">
      <Link to="/" className="back2"><FaArrowLeft /> Back</Link>
      <h2>Daily Forecast</h2>
      <div className="grid-cards2">
        {Object.entries(dailyMap).map(([date, items], i) => {
          const temps = items.map(f => f.main.temp);
          const max = Math.max(...temps);
          const min = Math.min(...temps);
          const humidity = items[0].main.humidity;
          const icon = items[0].weather[0].icon;
          return (
            <section key={i} className="card forecast-card2">
              <h3>{i === 0 ? "Today" : date}</h3>
              <div className="forecast-item2">
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
                <div className="temps2">{convertTemp(max)}° / {convertTemp(min)}°</div>
                <div className="cond2">{items[0].weather[0].main}</div>
                <div className="humidity2"><FaTint /> {humidity}%</div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=06d1253f3668475d80895121250705&q=${cityName}&aqi=yes`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getWeather(`${latitude},${longitude}`);
    });
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className={`weather-app ${darkMode ? "dark" : ""}`}>
      <nav className="navbar">
        <h1>🌤️ Sky Teller</h1>
        <div className="nav-controls">
          <button onClick={toggleDarkMode}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      <div className="weather-display">
        <input
          type="text"
          placeholder="Enter your location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => getWeather(city)}>Submit</button>

        {weather && (
          <div className="weather-info fade-in">
            <h2>{weather.location.name}</h2>
            <p>{weather.current.temp_c}°C</p>
            <p>{weather.current.condition.text}</p>
            <img src={weather.current.condition.icon} alt="icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

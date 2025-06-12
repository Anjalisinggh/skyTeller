import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [wellnessTip, setWellnessTip] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=06d1253f3668475d80895121250705&q=${cityName}&aqi=yes`
      );
      const data = response.data;
      setWeather(data);
      const tip = generateRuleBasedTip(data.current);
      setWellnessTip(tip);
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

  const generateRuleBasedTip = (weather) => {
    const { uv, air_quality, humidity, feelslike_c, condition } = weather;

    const weatherText = condition?.text?.toLowerCase() || "";

    if (weatherText.includes("rain"))
      return "🌧️ It's rainy – Try indoor yoga or meditation today.";
    if (uv > 7)
      return "☀️ High UV levels – Don’t forget your sunscreen!";
    if (air_quality?.pm2_5 > 50)
      return "🌫️ Air quality is low – Prefer indoor exercises.";
    if (humidity > 80)
      return "💧 Very humid – Stay hydrated and cool.";
    if (feelslike_c < 15)
      return "🧣 It’s cold – Bundle up and maybe enjoy a warm cup of tea.";

    return "🌤️ Lovely weather – Great day for a walk or outdoor stretch!";
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className={`weather-app ${darkMode ? "dark" : ""}`}>
      <nav className="navbar">
        <h1 className="navbar-title">Sky Teller</h1>
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

            <div className="wellness-card">
              <h3>🧘 Wellness Tip</h3>
              <p>{wellnessTip}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Made with 🤍 by Anjali</p>
      </footer>
    </div>
  );
};

export default App;

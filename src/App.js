import axios from "axios";
import { useState } from "react";
import "./App.css"; // <-- Import the CSS

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=06d1253f3668475d80895121250705&q=${city}&aqi=yes`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <div className="weather-app">
      <h1>Sky Teller</h1>
      <div className="weather-display">
        <input
          type="text"
          placeholder="Enter your location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Submit</button>

        {weather && (
          <div className="weather-info">
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

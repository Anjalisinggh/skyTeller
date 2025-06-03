import axios from "axios";
import { useState } from "react";

const App = () => {
  const [city, setCity] = useState("malad");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=06d1253f3668475d80895121250705&q=${city}&aqi=yes`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {weather && (
        <div>
          <h2>{weather.location.name}</h2>
          <p>{weather.current.temp_c}°C</p>
          <p>{weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="icon" />
        </div>
      )}
    </div>
  );
};

export default App;

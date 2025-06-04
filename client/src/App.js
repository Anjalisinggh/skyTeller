import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [wellnessTip, setWellnessTip] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const getWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=06d1253f3668475d80895121250705&q=${cityName}&aqi=yes`
      );
      const data = response.data;
      setWeather(data);
      generateAITip(data.current); // fetch AI-based tip after weather data is received
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
    const { uv, air_quality, humidity, feelslike_c } = weather;

    if (uv > 7) return "☀️ High UV levels – Don’t forget SPF!";
    if (air_quality?.pm2_5 > 50) return "🌫️ Low air quality – Try indoor stretches today.";
    if (humidity > 80) return "💧 Very humid – Stay hydrated and avoid intense workouts.";
    if (feelslike_c < 15) return "🧣 It's chilly – Keep warm and maybe enjoy a hot drink!";
    return "🌤️ Beautiful weather – A perfect day for a walk or some yoga!";
  };

  const generateAITip = async (weather) => {
    const prompt = `Give me a short wellness suggestion for someone experiencing ${weather.temp_c}°C, UV Index ${weather.uv}, and air quality PM2.5 ${weather.air_quality.pm2_5}. Keep it casual and friendly.`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await res.json();
      const gptTip = data.choices[0].message.content;
      setWellnessTip(gptTip);
    } catch (error) {
      console.warn("GPT failed, using rule-based tip.");
      setWellnessTip(generateRuleBasedTip(weather));
    }
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

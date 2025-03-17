import React, { useState, useEffect } from "react";
import "./App.css";

// Weather Service component
const WeatherService = ({ onWeatherData }) => {
  const API_KEY = "eb55320dc2bc69f4780d5acb18612ca2"; // Replace with your actual API key
  const CITY = "Toronto";
  const COUNTRY_CODE = "CA";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Weather data not available");
        }

        const data = await response.json();
        onWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        onWeatherData({ main: { temp: "N/A" } });
      }
    };

    fetchWeather();

    // Refresh weather data every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherInterval);
  }, [onWeatherData]);

  return null; // This is a service component, no UI needed
};

// Toronto DateTime component - Fixed version
const TorontoDateTime = () => {
  const [torontoTime, setTorontoTime] = useState("");

  useEffect(() => {
    const updateTorontoTime = () => {
      const now = new Date();

      // Format as Toronto time (Eastern Time)
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const partValues = {};

      // Extract all parts into an object for easy access
      parts.forEach((part) => {
        partValues[part.type] = part.value;
      });

      // Create formatted string YYYY-MM-DD HH:MM:SS
      const formattedDate = `${partValues.year}-${partValues.month}-${partValues.day} ${partValues.hour}:${partValues.minute}:${partValues.second}`;

      setTorontoTime(formattedDate);
    };

    // Initial update
    updateTorontoTime();

    // Update every second
    const interval = setInterval(updateTorontoTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="date-time">
      <h2>Current Toronto Date and Time:</h2>
      <p>{torontoTime}</p>
    </div>
  );
};

// Main App component
function App() {
  const [weatherData, setWeatherData] = useState(null);

  const handleWeatherData = (data) => {
    setWeatherData(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Toronto Date, Time and Weather</h1>

        {/* Toronto date and time component */}
        <TorontoDateTime />

        {/* Weather service (non-visual component) */}
        <WeatherService onWeatherData={handleWeatherData} />

        {/* Weather display */}
        <div className="weather">
          <h2>Current Toronto Temperature:</h2>
          {weatherData ? (
            <p>{weatherData.main.temp}°C</p>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

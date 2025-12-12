document.addEventListener("DOMContentLoaded", function () {
  let currentTemperatureUnit = 'fahrenheit'; // default unit

  function getWeatherCondition(weatherCode) {
    const conditions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    return conditions[weatherCode] || "Unknown";
  }

  function getBackgroundForWeather(code, isDay) {
    const thunderCodes = [95, 96, 99];
    const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];

    if (thunderCodes.includes(code)) {
      return './assets/thunder.png';
    }
    if (rainCodes.includes(code)) {
      return './assets/rain.jpg';
    }
    return isDay ? './assets/day.png' : './assets/night.png';
  }

  function getBodyBackgroundForDayNight(isDay) {
    return isDay ? './assets/daybg.png' : './assets/nightbg.png';
  }

  async function fetchWeatherData(latitude, longitude, temperatureUnit = 'fahrenheit') {
    try {
      if (!window.api || !window.api.fetchWeather) {
        console.error('window.api.fetchWeather is not available (preload not loaded).');
        return;
      }

      const data = await window.api.fetchWeather(latitude, longitude, temperatureUnit);
      console.log('API Response', data);

      const weather = data.current_weather;
      if (!weather) {
        console.error('No weather data returned.');
        alert('Failed to fetch weather data');
        return;
      }

      const currentTime = new Date(weather.time);
      const weatherCondition = getWeatherCondition(weather.weathercode);
      const isDay = weather.is_day === 1;

      const weatherData = {
        current: {
          time: currentTime,
          temperature2m: weather.temperature,
          isDay: isDay,
          weatherCondition: weatherCondition,
          weatherCode: weather.weathercode
        },
      };

      // Update the small condition text
      const conditionElement = document.getElementById('condition');
      if (conditionElement) {
        conditionElement.innerText = `It's ${weatherData.current.weatherCondition} outside!`;
      }

      // Update temperature (display only the numeric value)
      const tempElement = document.getElementById('temperature');
      if (tempElement) {
        const temp = Math.round(weatherData.current.temperature2m);
        tempElement.innerText = `${temp}`;
      }

      // Update inner container (day/night/rain/thunder)
      const innerContainer = document.querySelector('.inner-container');
      if (innerContainer) {
        const bg = getBackgroundForWeather(weatherData.current.weatherCode, weatherData.current.isDay);
        innerContainer.style.backgroundImage = `url("${bg}")`;
        innerContainer.style.backgroundSize = 'cover';
        innerContainer.style.backgroundPosition = 'center';
      }

      // Update body background ONLY for day/night
      const bodyBg = getBodyBackgroundForDayNight(weatherData.current.isDay);
      document.body.style.backgroundImage = `url("${bodyBg}")`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';

    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data');
    }
  }

  // Set up temperature unit buttons
  const celsiusBtn = document.querySelector('.celsius');
  const fahrenheitBtn = document.querySelector('.farenheit');

  if (celsiusBtn) {
    celsiusBtn.addEventListener('click', function() {
      currentTemperatureUnit = 'celsius';
      celsiusBtn.style.opacity = '1';
      if (fahrenheitBtn) fahrenheitBtn.style.opacity = '0.5';
      fetchWeatherData(12.9719, 77.5937, 'celsius');
    });
  }

  if (fahrenheitBtn) {
    fahrenheitBtn.addEventListener('click', function() {
      currentTemperatureUnit = 'fahrenheit';
      fahrenheitBtn.style.opacity = '1';
      if (celsiusBtn) celsiusBtn.style.opacity = '0.5';
      fetchWeatherData(12.9719, 77.5937, 'fahrenheit');
    });
  }

  // Initial fetch with Fahrenheit (default)
  if (fahrenheitBtn) fahrenheitBtn.style.opacity = '1';
  if (celsiusBtn) celsiusBtn.style.opacity = '0.5';
  fetchWeatherData(12.9719, 77.5937, 'fahrenheit');
});
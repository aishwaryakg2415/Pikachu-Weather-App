// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchWeather: async (latitude, longitude, temperatureUnit) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current_weather: true,
        temperature_unit: temperatureUnit,
      });
      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
});
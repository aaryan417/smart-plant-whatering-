// src/services/weatherAPI.js

export const DEFAULT_LOCATION = {
  name: 'Betul, Madhya Pradesh',
  lat: 21.91,
  lon: 77.90,
  isGps: false,
};

// Log the default location on module load
console.log('📌 [weatherAPI] DEFAULT_LOCATION set to:', DEFAULT_LOCATION.name, 
           `(${DEFAULT_LOCATION.lat}°N, ${DEFAULT_LOCATION.lon}°E)`);

/**
 * Reverse geocode latitude and longitude to a human-readable city/state name.
 * Uses free, keyless client-side reverse geocoding with graceful fallback.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>}
 */
export async function reverseGeocode(latitude, longitude) {
  // Primary attempt: BigDataCloud client reverse geocode API (free, fast, keyless)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const state = data.principalSubdivision;
      if (city && state && city !== state) {
        return `${city}, ${state}`;
      }
      if (city) {
        return city;
      }
      if (data.countryName) {
        return `${data.countryName}`;
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode failed, trying secondary fallback:', err);
  }

  // Secondary attempt: OpenStreetMap Nominatim reverse lookup
  try {
    const res2 = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    if (res2.ok) {
      const data2 = await res2.json();
      const addr = data2.address || {};
      const place = addr.city || addr.town || addr.village || addr.suburb || addr.county;
      const state = addr.state;
      if (place && state) return `${place}, ${state}`;
      if (place) return place;
    }
  } catch (err2) {
    console.warn('Nominatim reverse geocode failed:', err2);
  }

  // Final fallback to clean coordinates format
  return `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
}

/**
 * Maps WMO Weather Code to a translation key and Lucide icon identifier.
 * @param {number} code
 */
export function getWeatherMeta(code) {
  if (code === 0) {
    return { key: 'weather_clear', icon: 'Sun', color: 'text-amber-500' };
  }
  if (code === 1) {
    return { key: 'weather_mainly_clear', icon: 'Sun', color: 'text-amber-500' };
  }
  if (code === 2) {
    return { key: 'weather_partly_cloudy', icon: 'CloudSun', color: 'text-emerald-600' };
  }
  if (code === 3) {
    return { key: 'weather_overcast', icon: 'Cloud', color: 'text-slate-500' };
  }
  if (code === 45 || code === 48) {
    return { key: 'weather_fog', icon: 'CloudFog', color: 'text-slate-400' };
  }
  if (code >= 51 && code <= 57) {
    return { key: 'weather_drizzle', icon: 'CloudDrizzle', color: 'text-sky-500' };
  }
  if (code === 61 || code === 80) {
    return { key: 'weather_rain_light', icon: 'CloudRain', color: 'text-sky-500' };
  }
  if (code === 63 || code === 81) {
    return { key: 'weather_rain_mod', icon: 'CloudRain', color: 'text-blue-500' };
  }
  if (code === 65 || code === 82) {
    return { key: 'weather_rain_heavy', icon: 'CloudRain', color: 'text-blue-700' };
  }
  if (code >= 71 && code <= 77 || code === 85 || code === 86) {
    return { key: 'weather_snow', icon: 'Snowflake', color: 'text-sky-300' };
  }
  if (code >= 95 && code <= 99) {
    return { key: 'weather_thunderstorm', icon: 'CloudLightning', color: 'text-purple-600' };
  }
  return { key: 'weather_unknown', icon: 'CloudSun', color: 'text-emerald-600' };
}

/**
 * Fetch forecast from Open-Meteo.
 * @param {number} latitude
 * @param {number} longitude
 */
export async function fetchWeatherData(latitude = DEFAULT_LOCATION.lat, longitude = DEFAULT_LOCATION.lon) {
  console.log('🌐 [weatherAPI] Fetching weather from Open-Meteo API:', 
             `latitude=${latitude.toFixed(2)}, longitude=${longitude.toFixed(2)}`);
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=7`;

  console.log('📡 [weatherAPI] API URL:', url);
  const response = await fetch(url);
  if (!response.ok) {
    console.error('❌ [weatherAPI] Open-Meteo API error:', response.status, response.statusText);
    throw new Error(`Open-Meteo HTTP error: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ [weatherAPI] Weather data received successfully. Current temp:', 
             data.current?.temperature_2m, '°C');

  // Format current
  const current = {
    temperature: Math.round(data.current?.temperature_2m ?? 0),
    humidity: Math.round(data.current?.relative_humidity_2m ?? 0),
    weatherCode: data.current?.weather_code ?? 0,
    windSpeed: Math.round(data.current?.wind_speed_10m ?? 0),
    time: data.current?.time,
  };

  // Format daily list
  const dailyList = [];
  const daily = data.daily || {};
  const dates = daily.time || [];

  for (let i = 0; i < dates.length; i++) {
    dailyList.push({
      dateStr: dates[i],
      weatherCode: daily.weather_code ? daily.weather_code[i] : 0,
      tempMax: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[i] : 0),
      tempMin: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[i] : 0),
      rainProbMax: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0),
      rainSum: parseFloat((daily.precipitation_sum ? daily.precipitation_sum[i] : 0).toFixed(1)),
    });
  }

  console.log('📊 [weatherAPI] Processed', dailyList.length, 'days of forecast data');

  return {
    raw: data,
    current,
    dailyList,
    hourly: data.hourly,
    fetchedAt: new Date(),
  };
}

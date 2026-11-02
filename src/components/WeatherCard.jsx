// src/components/WeatherCard.jsx
import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle, 
  Snowflake, 
  Thermometer, 
  Droplets, 
  Wind, 
  RefreshCw, 
  MapPin, 
  Navigation, 
  AlertCircle,
  AlertTriangle,
  Compass,
  X
} from 'lucide-react';
import { getWeatherMeta } from '../services/weatherAPI';

function WeatherIcon({ name, className }) {
  switch (name) {
    case 'Sun': return <Sun className={className} />;
    case 'CloudSun': return <CloudSun className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'CloudLightning': return <CloudLightning className={className} />;
    case 'CloudFog': return <CloudFog className={className} />;
    case 'CloudDrizzle': return <CloudDrizzle className={className} />;
    case 'Snowflake': return <Snowflake className={className} />;
    default: return <CloudSun className={className} />;
  }
}

export default function WeatherCard({ 
  weather, 
  loading, 
  error, 
  onRefresh, 
  currentLocation,
  onDetectLocation,
  isDetectingLocation,
  locationError,
  onDismissLocationError,
  t, 
  lang 
}) {
  const current = weather?.current;
  const weatherMeta = current ? getWeatherMeta(current.weatherCode) : null;
  const conditionText = weatherMeta ? (t[weatherMeta.key] || t.weather_unknown) : '...';

  // Format time (keep standard time display)
  const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md">
      {/* Top Bar: Title & Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Title & Detected Location Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 flex-shrink-0 mt-0.5 sm:mt-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {t.currentWeatherTitle}
              </h2>
              {/* Location Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                currentLocation?.isGps 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentLocation?.isGps ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                {currentLocation?.isGps ? t.gpsDetectedBadge : t.defaultLocationBadge}
              </span>
            </div>
            
            {/* Detected location name */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="font-semibold text-slate-800">
                {currentLocation?.name || 'Bhopal, Madhya Pradesh'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({currentLocation?.lat?.toFixed(2)}°N, {currentLocation?.lon?.toFixed(2)}°E)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: GPS Detect & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Use My Current Location Button */}
          <button
            type="button"
            onClick={onDetectLocation}
            disabled={isDetectingLocation || loading}
            title={t.useCurrentLocation}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetectingLocation ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-200" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>
              {isDetectingLocation ? t.detectingLocation : t.useCurrentLocation}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            title={t.refreshWeather}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">
              {loading ? t.refreshing : t.refreshWeather}
            </span>
          </button>
        </div>
      </div>

      {/* Geolocation Error Alert (friendly notification) */}
      {locationError && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{locationError}</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                {t.geoGeneralError}
              </p>
            </div>
          </div>
          {onDismissLocationError && (
            <button
              type="button"
              onClick={onDismissLocationError}
              className="text-amber-700 hover:text-amber-900 p-1"
              title={t.dismissBtn}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Weather API Error Alert */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">{t.errorWeather}</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={onRefresh}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700"
            >
              {t.retryBtn}
            </button>
          </div>
        </div>
      )}

      {/* Main Weather Metrics Grid */}
      {current && !error && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Main Temperature & Condition Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 border border-emerald-100/80 flex items-center justify-between sm:col-span-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {t.condition}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                {current.temperature}°C
              </div>
              <div className="text-sm font-semibold text-emerald-900 mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                {conditionText}
              </div>
            </div>

            <div className="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-emerald-100/60">
              <WeatherIcon 
                name={weatherMeta?.icon || 'Sun'} 
                className={`w-12 h-12 ${weatherMeta?.color || 'text-amber-500'}`} 
              />
            </div>
          </div>

          {/* Humidity Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {t.humidity}
              </span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {current.humidity}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(current.humidity, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Wind Speed & Coordinates Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {t.windSpeed}
              </span>
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {current.windSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                <span>{t.lastUpdated}:</span>
                <span className="font-medium text-slate-700">{formatTime(weather.fetchedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !current && (
        <div className="mt-5 p-8 text-center text-slate-500 animate-pulse">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-sm font-medium">{t.loadingWeather}</p>
        </div>
      )}
    </div>
  );
}

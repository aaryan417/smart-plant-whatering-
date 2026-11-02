// src/components/Forecast.jsx
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
  Calendar, 
  CloudRainWind 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
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

export default function Forecast({ weather, t, lang }) {
  const dailyList = weather?.dailyList || [];

  // Helper to format day name
  const formatDayName = (dateStr, index) => {
    if (index === 0) return t.today;
    if (index === 1) return t.tomorrow;
    
    const d = new Date(dateStr);
    // Format in locale, keep short
    const dayName = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return `${dayName} ${dayNum}`;
  };

  // Prepare chart data
  const chartData = dailyList.map((item, idx) => ({
    name: formatDayName(item.dateStr, idx),
    rain: item.rainSum,
    prob: item.rainProbMax,
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {t.forecastTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.forecastSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 7 Daily Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {dailyList.map((day, idx) => {
          const meta = getWeatherMeta(day.weatherCode);
          const isToday = idx === 0;

          return (
            <div
              key={day.dateStr}
              className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all ${
                isToday 
                  ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300 shadow-xs' 
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {/* Day title */}
              <div className="text-xs font-bold text-slate-700">
                {formatDayName(day.dateStr, idx)}
              </div>

              {/* Weather icon */}
              <div className="my-2.5 p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                <WeatherIcon 
                  name={meta.icon} 
                  className={`w-6 h-6 ${meta.color}`} 
                />
              </div>

              {/* Temp Max / Min */}
              <div className="text-xs font-bold text-slate-800">
                <span>{day.tempMax}°</span>
                <span className="text-slate-400 font-normal ml-1">/ {day.tempMin}°</span>
              </div>

              {/* Rain Chance & Sum */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 w-full space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600">
                  <CloudRainWind className="w-3 h-3" />
                  <span>{day.rainProbMax}%</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {day.rainSum} mm
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rainfall Chart Section */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {t.rainfallChartTitle}
          </span>
          <span className="text-xs text-slate-500">
            {t.rainfallChartSubtitle}
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
                unit="mm"
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                        <p className="font-bold border-b border-slate-700 pb-1">{data.name}</p>
                        <p className="text-blue-300">
                          {t.expectedRain}: <span className="font-bold text-white">{data.rain} mm</span>
                        </p>
                        <p className="text-sky-300">
                          {t.rainChance}: <span className="font-bold text-white">{data.prob}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="rain" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.rain >= 5 ? '#2563eb' : entry.rain > 0 ? '#60a5fa' : '#cbd5e1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

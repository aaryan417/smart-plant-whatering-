// src/App.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Sprout, 
  Leaf, 
  LayoutDashboard, 
  CalendarDays,
  Languages
} from 'lucide-react';
import { translations } from './i18n/translations';
import { 
  fetchWeatherData, 
  reverseGeocode, 
  DEFAULT_LOCATION 
} from './services/weatherAPI';
import { extractUpcomingRainMetrics, calculateIrrigationRecommendation } from './utils/irrigationEngine';
import { calculateCropSchedule } from './data/cropAgronomy';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import SoilMoisture from './components/SoilMoisture';
import Recommendation from './components/Recommendation';
import CropScheduler from './components/CropScheduler';
import WaterCalculator from './components/WaterCalculator';
import FarmerChatbot from './components/FarmerChatbot';

export default function App() {
  // 1. Active Page State: ONLY TWO pages ('dashboard' | 'crop_scheduler')
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('smart_irrigation_page') || 'dashboard';
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('smart_irrigation_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Language state with LocalStorage persistence (default 'en')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('smart_irrigation_lang') || 'en';
  });

  const t = translations[lang] || translations.en;

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('smart_irrigation_lang', newLang);
  };

  // 3. Location state (Bhopal default fallback, or persisted coordinates from localStorage)
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_irrigation_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved location:', e);
    }
    return DEFAULT_LOCATION;
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // 4. Soil moisture slider state with LocalStorage persistence (default 45%)
  const [soilMoisture, setSoilMoisture] = useState(() => {
    const saved = localStorage.getItem('smart_irrigation_moisture');
    return saved !== null ? Number(saved) : 45;
  });

  const handleMoistureChange = (value) => {
    setSoilMoisture(value);
    localStorage.setItem('smart_irrigation_moisture', value);
  };

  // 5. Crop & Soil Configuration state with LocalStorage persistence
  const [selectedCropId, setSelectedCropId] = useState(() => {
    return localStorage.getItem('smart_irrigation_crop') || 'wheat';
  });

  const handleSelectCropId = (cropId) => {
    setSelectedCropId(cropId);
    localStorage.setItem('smart_irrigation_crop', cropId);
  };

  const [selectedSoilId, setSelectedSoilId] = useState(() => {
    return localStorage.getItem('smart_irrigation_soil') || 'black';
  });

  const handleSelectSoilId = (soilId) => {
    setSelectedSoilId(soilId);
    localStorage.setItem('smart_irrigation_soil', soilId);
  };

  const [sowingDate, setSowingDate] = useState(() => {
    return localStorage.getItem('smart_irrigation_sowing_date') || '';
  });

  const handleSelectSowingDate = (date) => {
    setSowingDate(date);
    localStorage.setItem('smart_irrigation_sowing_date', date);
  };

  const [irrigationMethodId, setIrrigationMethodId] = useState(() => {
    return localStorage.getItem('smart_irrigation_method') || 'flood';
  });

  const handleSelectIrrigationMethod = (methodId) => {
    setIrrigationMethodId(methodId);
    localStorage.setItem('smart_irrigation_method', methodId);
  };

  // 6. Field Area Calculator state with LocalStorage persistence
  const [fieldArea, setFieldArea] = useState(() => {
    const saved = localStorage.getItem('smart_irrigation_field_area');
    return saved !== null ? Number(saved) : 2.0;
  });

  const handleAreaChange = (val) => {
    setFieldArea(val);
    localStorage.setItem('smart_irrigation_field_area', val);
  };

  const [areaUnit, setAreaUnit] = useState(() => {
    return localStorage.getItem('smart_irrigation_area_unit') || 'acre';
  });

  const handleUnitChange = (unit) => {
    setAreaUnit(unit);
    localStorage.setItem('smart_irrigation_area_unit', unit);
  };

  // 7. Live weather state
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // Fetch live weather data from Open-Meteo for coordinates
  const loadWeather = useCallback(async (loc = currentLocation) => {
    try {
      setLoading(true);
      setWeatherError(null);
      const data = await fetchWeatherData(loc.lat, loc.lon);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load Open-Meteo weather:', err);
      setWeatherError(err.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    loadWeather(currentLocation);
  }, [currentLocation, loadWeather]);

  // GPS Location Detection Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t.geoUnsupported);
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const placeName = await reverseGeocode(latitude, longitude);

          const newLocation = {
            name: placeName,
            lat: latitude,
            lon: longitude,
            isGps: true,
          };

          setCurrentLocation(newLocation);
          localStorage.setItem('smart_irrigation_location', JSON.stringify(newLocation));
          await loadWeather(newLocation);
        } catch (err) {
          console.error('Error during post-geocoding fetch:', err);
          setLocationError(t.geoGeneralError);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        console.warn('Geolocation error:', error);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(t.geoPermissionDenied);
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(t.geoUnavailable);
        } else if (error.code === error.TIMEOUT) {
          setLocationError(t.geoTimeout);
        } else {
          setLocationError(error.message || t.geoGeneralError);
        }
      },
      geoOptions
    );
  };

  // Extract upcoming 24h rain metrics for near-term decision engine
  const rainMetrics = weatherData?.hourly
    ? extractUpcomingRainMetrics(weatherData.hourly, 24)
    : {
        upcomingRainProb: weatherData?.dailyList?.[0]?.rainProbMax || 0,
        upcomingRainAmount: weatherData?.dailyList?.[0]?.rainSum || 0,
      };

  // Calculate Crop-Based Smart Irrigation Schedule
  const cropSchedule = useMemo(() => {
    return calculateCropSchedule({
      cropId: selectedCropId,
      soilId: selectedSoilId,
      sowingDate,
      irrigationMethodId,
      soilMoisture,
      upcomingRainProb: rainMetrics.upcomingRainProb,
      upcomingRainAmount: rainMetrics.upcomingRainAmount,
    });
  }, [selectedCropId, selectedSoilId, sowingDate, irrigationMethodId, soilMoisture, rainMetrics]);

  // Farm telemetry context for Farmer AI Assistant
  const botContext = useMemo(() => {
    const recommendation = calculateIrrigationRecommendation(
      soilMoisture,
      rainMetrics.upcomingRainProb,
      rainMetrics.upcomingRainAmount
    );
    return {
      cropNameEn: cropSchedule?.crop?.nameEn || 'Wheat',
      cropNameHi: cropSchedule?.crop?.nameHi || 'गेहूं',
      soilNameEn: cropSchedule?.soil?.labelEn || 'Black Soil',
      soilNameHi: cropSchedule?.soil?.labelHi || 'काली मिट्टी',
      soilMoisture,
      upcomingRainProb: rainMetrics.upcomingRainProb,
      upcomingRainAmount: rainMetrics.upcomingRainAmount,
      recommendationDecision: recommendation.decision,
      nextIrrigationDateStr: cropSchedule?.nextDate
        ? new Date(cropSchedule.nextDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' })
        : '',
      irrigationMethodEn: cropSchedule?.method?.labelEn || 'Flood',
      irrigationMethodHi: cropSchedule?.method?.labelHi || 'पारंपरिक बहाव',
      growthStageEn: cropSchedule?.currentStage?.nameEn || 'Vegetative',
      growthStageHi: cropSchedule?.currentStage?.nameHi || 'वानस्पतिक',
      locationName: currentLocation?.name || 'Bhopal, MP',
    };
  }, [cropSchedule, soilMoisture, rainMetrics, currentLocation, lang]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.appTitle}
              </h1>
              <p className="text-xs text-emerald-800 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation (Dashboard vs Crop Scheduler) */}
          <nav className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => handlePageChange('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.navDashboard}</span>
            </button>

            <button
              type="button"
              onClick={() => handlePageChange('crop_scheduler')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'crop_scheduler'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-current={currentPage === 'crop_scheduler' ? 'page' : undefined}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t.navCropScheduler}</span>
            </button>
          </nav>

          {/* Right Controls: Language Toggle (EN | हिंदी) */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <span className="text-slate-300 px-0.5">|</span>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={lang === 'hi'}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24 sm:pb-8">
        {/* Hardware Limitation Notice Banner */}
        <div className="rounded-xl p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-xs">
          <Leaf className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold mr-1.5">{t.hardwareBadge}:</span>
            {t.hardwareNote}
          </div>
        </div>

        {/* ================= PAGE 1: DASHBOARD ================= */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Current Weather with GPS Detection */}
            <section aria-label="Current Weather">
              <WeatherCard
                weather={weatherData}
                loading={loading}
                error={weatherError}
                onRefresh={() => loadWeather(currentLocation)}
                currentLocation={currentLocation}
                onDetectLocation={handleDetectLocation}
                isDetectingLocation={isDetectingLocation}
                locationError={locationError}
                onDismissLocationError={() => setLocationError(null)}
                t={t}
                lang={lang}
              />
            </section>

            {/* 7-Day Forecast with Rainfall Bar Chart */}
            <section aria-label="7-Day Weather Forecast">
              <Forecast
                weather={weatherData}
                t={t}
                lang={lang}
              />
            </section>

            {/* Soil Moisture Slider & Current Recommendation with Hindi Voice Advisory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Soil Moisture */}
              <section aria-label="Soil Moisture Simulation">
                <SoilMoisture
                  moisture={soilMoisture}
                  onChangeMoisture={handleMoistureChange}
                  t={t}
                />
              </section>

              {/* Recommendation Card & Hindi Voice Advisory */}
              <section aria-label="Watering Recommendation">
                <Recommendation
                  moisture={soilMoisture}
                  upcomingRainProb={rainMetrics.upcomingRainProb}
                  upcomingRainAmount={rainMetrics.upcomingRainAmount}
                  cropSchedule={cropSchedule}
                  t={t}
                  lang={lang}
                />
              </section>
            </div>
          </div>
        )}

        {/* ================= PAGE 2: CROP SCHEDULER ================= */}
        {currentPage === 'crop_scheduler' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Crop & Soil Configuration & Growth Stages Timeline */}
            <section aria-label="Crop & Soil Configuration">
              <CropScheduler
                selectedCropId={selectedCropId}
                onSelectCropId={handleSelectCropId}
                selectedSoilId={selectedSoilId}
                onSelectSoilId={handleSelectSoilId}
                sowingDate={sowingDate}
                onSelectSowingDate={handleSelectSowingDate}
                irrigationMethodId={irrigationMethodId}
                onSelectIrrigationMethod={handleSelectIrrigationMethod}
                soilMoisture={soilMoisture}
                upcomingRainProb={rainMetrics.upcomingRainProb}
                upcomingRainAmount={rainMetrics.upcomingRainAmount}
                t={t}
                lang={lang}
              />
            </section>

            {/* Water Requirement Calculator & Water Saving Tracker */}
            <section aria-label="Water Calculator and Savings">
              <WaterCalculator
                cropId={selectedCropId}
                irrigationMethodId={irrigationMethodId}
                fieldArea={fieldArea}
                onAreaChange={handleAreaChange}
                areaUnit={areaUnit}
                onUnitChange={handleUnitChange}
                t={t}
                lang={lang}
              />
            </section>
          </div>
        )}
      </main>

      {/* Mobile Compact Bottom Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl flex sm:hidden"
        aria-label="Mobile Navigation"
      >
        <button
          type="button"
          onClick={() => handlePageChange('dashboard')}
          className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage === 'dashboard'
              ? 'text-emerald-700 bg-emerald-50/50 border-t-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={currentPage === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t.navDashboard}</span>
        </button>

        <button
          type="button"
          onClick={() => handlePageChange('crop_scheduler')}
          className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage === 'crop_scheduler'
              ? 'text-emerald-700 bg-emerald-50/50 border-t-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={currentPage === 'crop_scheduler' ? 'page' : undefined}
        >
          <CalendarDays className="w-5 h-5" />
          <span>{t.navCropScheduler}</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">{t.appTitle}</span> — {t.footerText}
          </div>
          <div className="text-[11px] text-slate-400">
            Open-Meteo Weather API • {currentLocation?.name || 'Bhopal, India'} ({currentLocation?.lat?.toFixed(2)}°N, {currentLocation?.lon?.toFixed(2)}°E)
          </div>
        </div>
      </footer>

      {/* Floating Farmer AI Assistant (Accessible on both Dashboard and Crop Scheduler) */}
      <FarmerChatbot
        context={botContext}
        lang={lang}
        t={t}
      />
    </div>
  );
}

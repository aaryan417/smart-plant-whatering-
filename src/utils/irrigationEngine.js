// src/utils/irrigationEngine.js

export const THRESHOLDS = {
  SOIL_DRY: 30, // below 30% is dry
  SOIL_WET: 60, // 60% and above is wet
  RAIN_PROB_SIGNIFICANT: 70, // 70% or more
  RAIN_AMOUNT_SIGNIFICANT: 5.0, // 5 mm or more
};

/**
 * Compute near-term rain metrics from hourly forecast (next 24 hours).
 * @param {Object} hourlyData - raw Open-Meteo hourly object with precipitation_probability and precipitation arrays
 * @param {number} hoursAhead - window to evaluate (default 24 hours)
 */
export function extractUpcomingRainMetrics(hourlyData, hoursAhead = 24) {
  if (!hourlyData || !Array.isArray(hourlyData.precipitation_probability)) {
    return {
      upcomingRainProb: 0,
      upcomingRainAmount: 0,
    };
  }

  // Slice first 24 hours or up to hoursAhead
  const probs = hourlyData.precipitation_probability.slice(0, hoursAhead);
  const rains = (hourlyData.precipitation || []).slice(0, hoursAhead);

  // Maximum probability in next 24 hours
  const maxProb = probs.length > 0 ? Math.max(...probs) : 0;

  // Total expected precipitation sum in next 24 hours
  const totalRain = rains.length > 0 ? rains.reduce((acc, val) => acc + (val || 0), 0) : 0;

  return {
    upcomingRainProb: Math.round(maxProb),
    upcomingRainAmount: parseFloat(totalRain.toFixed(1)),
  };
}

/**
 * Irrigation Decision Engine
 *
 * Rules:
 * - Soil moisture >= 60%: SKIP
 * - Soil moisture < 30% and significant rain not expected: WATER
 * - Soil moisture < 30% and significant rain expected soon: DELAY and recheck soil
 * - Soil moisture between 30% and 60% with significant rain expected: DELAY
 * - Otherwise: MONITOR
 *
 * @param {number} soilMoisture (0-100)
 * @param {number} upcomingRainProb (0-100)
 * @param {number} upcomingRainAmount (mm)
 * @returns {Object} { decision: 'WATER'|'SKIP'|'DELAY'|'MONITOR', reasonKey: string, isRainExpected: boolean }
 */
export function calculateIrrigationRecommendation(soilMoisture, upcomingRainProb = 0, upcomingRainAmount = 0) {
  const isSignificantRainExpected =
    upcomingRainProb >= THRESHOLDS.RAIN_PROB_SIGNIFICANT &&
    upcomingRainAmount >= THRESHOLDS.RAIN_AMOUNT_SIGNIFICANT;

  // Rule 1: Soil moisture >= 60% -> SKIP
  if (soilMoisture >= THRESHOLDS.SOIL_WET) {
    return {
      decision: 'SKIP',
      reasonKey: 'reason_skip',
      isRainExpected: isSignificantRainExpected,
      color: 'blue',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    };
  }

  // Rule 2: Soil moisture < 30%
  if (soilMoisture < THRESHOLDS.SOIL_DRY) {
    if (isSignificantRainExpected) {
      return {
        decision: 'DELAY',
        reasonKey: 'reason_delay_dry',
        isRainExpected: true,
        color: 'amber',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    return {
      decision: 'WATER',
      reasonKey: 'reason_water',
      isRainExpected: false,
      color: 'emerald',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }

  // Rule 3: Soil moisture between 30% and 60% (moderate)
  if (isSignificantRainExpected) {
    return {
      decision: 'DELAY',
      reasonKey: 'reason_delay_moderate',
      isRainExpected: true,
      color: 'amber',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  }

  // Otherwise -> MONITOR
  return {
    decision: 'MONITOR',
    reasonKey: 'reason_monitor',
    isRainExpected: false,
    color: 'slate',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  };
}

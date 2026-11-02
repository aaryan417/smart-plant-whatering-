// src/components/SoilMoisture.jsx
import React from 'react';
import { Gauge, Info, Sparkles, Droplets } from 'lucide-react';
import { THRESHOLDS } from '../utils/irrigationEngine';

export default function SoilMoisture({ moisture, onChangeMoisture, t }) {
  // Determine status
  let statusKey = 'moderateStatus';
  let badgeClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let progressColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';

  if (moisture < THRESHOLDS.SOIL_DRY) {
    statusKey = 'dryStatus';
    badgeClasses = 'bg-amber-100 text-amber-800 border-amber-200';
    progressColor = 'bg-amber-500';
    textColor = 'text-amber-700';
  } else if (moisture >= THRESHOLDS.SOIL_WET) {
    statusKey = 'wetStatus';
    badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200';
    progressColor = 'bg-blue-500';
    textColor = 'text-blue-700';
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {t.soilMoistureTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.soilMoistureSubtitle}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
            {t.demoBadge}
          </span>
        </div>

        {/* Demo Mode Disclaimer Notice */}
        <div className="p-3 mb-5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.simulatedReadingNote}
          </p>
        </div>

        {/* Big Value Display */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 mb-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {t.demoSliderLabel}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {moisture}
                </span>
                <span className="text-lg font-bold text-slate-500">%</span>
              </div>
            </div>

            {/* Status Pill */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${badgeClasses}`}>
              {t[statusKey]}
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={moisture}
              onChange={(e) => onChangeMoisture(Number(e.target.value))}
              className="w-full h-2 cursor-pointer"
              aria-label={t.demoSliderLabel}
            />

            {/* Scale markings */}
            <div className="flex justify-between text-[10px] font-medium text-slate-600 px-1 pt-1">
              <span>0% ({t.dryStatus.split(' ')[0]})</span>
              <span>30%</span>
              <span>60%</span>
              <span>100% ({t.wetStatus.split(' ')[0]})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Quick Test Buttons */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.presetsTitle}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeMoisture(20)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
              moisture < 30
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {t.presetDry}
          </button>

          <button
            type="button"
            onClick={() => onChangeMoisture(45)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
              moisture >= 30 && moisture < 60
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {t.presetNormal}
          </button>

          <button
            type="button"
            onClick={() => onChangeMoisture(75)}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
              moisture >= 60
                ? 'bg-blue-100 text-blue-900 border-blue-300 ring-2 ring-blue-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {t.presetWet}
          </button>
        </div>

        <p className="text-[11px] text-slate-600 mt-3 text-center">
          {t.soilHelpText}
        </p>
      </div>
    </div>
  );
}

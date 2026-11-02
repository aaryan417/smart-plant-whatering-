// src/components/WaterCalculator.jsx
import React from 'react';
import { 
  Calculator, 
  Droplet, 
  TrendingDown, 
  Leaf, 
  Info, 
  Sparkles, 
  Gauge, 
  CheckCircle2 
} from 'lucide-react';
import { calculateWaterRequirement } from '../data/cropAgronomy';

export default function WaterCalculator({
  cropId,
  irrigationMethodId,
  fieldArea,
  onAreaChange,
  areaUnit,
  onUnitChange,
  t,
  lang,
}) {
  const calc = calculateWaterRequirement({
    cropId,
    area: fieldArea,
    unit: areaUnit,
    irrigationMethodId,
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-700 flex-shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            {t.waterCalculatorTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {t.waterCalculatorSubtitle}
          </p>
        </div>
      </div>

      {/* Field Area Controls */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            {t.fieldAreaLabel}
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="0.1"
              max="1000"
              step="0.5"
              value={fieldArea}
              onChange={(e) => onAreaChange(Math.max(0.1, Number(e.target.value) || 0.1))}
              className="w-full pl-3 pr-20 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {/* Unit Toggle inside input or alongside */}
            <div className="absolute right-1.5 flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => onUnitChange('acre')}
                className={`px-2 py-1 rounded-md transition-all ${
                  areaUnit === 'acre'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.areaUnitAcre}
              </button>
              <button
                type="button"
                onClick={() => onUnitChange('hectare')}
                className={`px-2 py-1 rounded-md transition-all ${
                  areaUnit === 'hectare'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.areaUnitHectare}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reference Factor */}
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-semibold text-slate-500 block">
            {t.waterDepthValue}
          </span>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            {calc.depthMm} mm ({lang === 'hi' ? calc.crop.nameHi : calc.crop.nameEn})
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {t.perCycleLabel}
          </span>
        </div>
      </div>

      {/* Primary Result Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gross Water to Pump */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-50/40 to-white border border-blue-200 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
            {t.grossWaterLabel}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {calc.actualKiloLitres.toLocaleString()} <span className="text-sm font-bold text-blue-700">{t.thousandLitresUnit}</span>
          </div>
          <div className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1.5">
            <span>≈ {calc.actualM3.toLocaleString()} {t.cubicMetersUnit}</span>
            <span>•</span>
            <span className="text-blue-700 font-semibold">{calc.actualLitres.toLocaleString()} {t.litresUnit}</span>
          </div>
        </div>

        {/* Traditional Baseline Comparison */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t.baselineFloodLabel}
          </span>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {calc.floodKiloLitres.toLocaleString()} <span className="text-sm font-normal text-slate-500">{t.thousandLitresUnit}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {lang === 'hi' 
              ? 'पारंपरिक क्यारी बहाव (55% दक्षता) पर आधारित'
              : 'Standard traditional furrow flood benchmark'}
          </div>
        </div>
      </div>

      {/* Water Saving Tracker */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-white border border-emerald-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {t.waterSavingTrackerTitle}
              </h4>
              <p className="text-[11px] text-emerald-800">
                {t.waterSavingSubtitle}
              </p>
            </div>
          </div>

          {/* Savings Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            calc.percentSaved > 0
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-200 text-slate-700'
          }`}>
            {calc.percentSaved > 0 
              ? `+${calc.percentSaved}% ${t.waterSavedLabel}` 
              : (lang === 'hi' ? 'बहाव विधि (बेसलाइन)' : 'Flood Baseline')}
          </span>
        </div>

        {/* Savings Detail Box */}
        {calc.percentSaved > 0 ? (
          <div className="p-3 bg-white/90 backdrop-blur rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {calc.kiloLitresSaved.toLocaleString()} {t.thousandLitresUnit} ({calc.litresSaved.toLocaleString()} {t.litresUnit}) {t.conservedPerCycle}
              </span>
            </div>
            <p className="text-slate-600 font-medium pt-1">
              {irrigationMethodId === 'drip' ? t.savingTipDrip : t.savingTipSprinkler}
            </p>
          </div>
        ) : (
          <div className="p-3 bg-white/90 backdrop-blur rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.savingTipFlood}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/CropScheduler.jsx
import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Layers, 
  Calendar, 
  Droplet, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  CloudRain, 
  Search, 
  Info, 
  ChevronRight, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { 
  CROPS, 
  SOIL_TYPES, 
  IRRIGATION_METHODS, 
  calculateCropSchedule 
} from '../data/cropAgronomy';

export default function CropScheduler({
  selectedCropId,
  onSelectCropId,
  selectedSoilId,
  onSelectSoilId,
  sowingDate,
  onSelectSowingDate,
  irrigationMethodId,
  onSelectIrrigationMethod,
  soilMoisture,
  upcomingRainProb,
  upcomingRainAmount,
  t,
  lang
}) {
  // Crop Search Query state
  const [cropSearch, setCropSearch] = useState('');
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);

  // Filter crops based on search query
  const filteredCrops = useMemo(() => {
    if (!cropSearch.trim()) return CROPS;
    const query = cropSearch.toLowerCase().trim();
    return CROPS.filter(
      (c) =>
        c.nameEn.toLowerCase().includes(query) ||
        c.nameHi.toLowerCase().includes(query)
    );
  }, [cropSearch]);

  const activeCrop = useMemo(() => {
    return CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  }, [selectedCropId]);

  // Calculate dynamic schedule
  const schedule = useMemo(() => {
    return calculateCropSchedule({
      cropId: selectedCropId,
      soilId: selectedSoilId,
      sowingDate,
      irrigationMethodId,
      soilMoisture,
      upcomingRainProb,
      upcomingRainAmount,
    });
  }, [selectedCropId, selectedSoilId, sowingDate, irrigationMethodId, soilMoisture, upcomingRainProb, upcomingRainAmount]);

  // Quick Sowing Date helper
  const handleQuickDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const formatted = d.toISOString().split('T')[0];
    onSelectSowingDate(formatted);
  };

  // Format date helper
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return '--';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateObj).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
  };

  // Status mapping
  const statusMeta = {
    due_today: {
      label: t.statusDueToday,
      badgeClass: 'bg-emerald-600 text-white shadow-xs',
      icon: AlertTriangle,
    },
    due_soon: {
      label: t.statusDueSoon,
      badgeClass: 'bg-amber-500 text-white shadow-xs',
      icon: Clock,
    },
    delayed_rain: {
      label: t.statusDelayedRain,
      badgeClass: 'bg-blue-600 text-white shadow-xs',
      icon: CloudRain,
    },
    delayed_moisture: {
      label: t.statusDelayedMoisture,
      badgeClass: 'bg-indigo-600 text-white shadow-xs',
      icon: Droplet,
    },
    upcoming: {
      label: t.statusUpcoming,
      badgeClass: 'bg-slate-700 text-white shadow-xs',
      icon: CheckCircle2,
    },
  };

  const currentStatusMeta = statusMeta[schedule.statusKey] || statusMeta.upcoming;
  const StatusIcon = currentStatusMeta.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 flex-shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {t.cropSectionTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.cropSectionSubtitle}
            </p>
          </div>
        </div>

        {/* Estimation Badge */}
        {schedule.isEstimated ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-center">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.estimatedBadge}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.verifiedDateBadge} ({schedule.daysSinceSowing} {t.daysUnit})</span>
          </span>
        )}
      </div>

      {/* Configuration Controls Grid (Crop, Soil, Sowing Date, Irrigation Method) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Crop Selection (Searchable Dropdown) */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.cropDropdownLabel}</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCropDropdownOpen(!isCropDropdownOpen)}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{lang === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}</span>
              <span className="text-[11px] font-normal text-slate-400">({activeCrop.season})</span>
            </button>

            {/* Dropdown Menu */}
            {isCropDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden animate-fadeIn">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                    placeholder={t.searchCropPlaceholder}
                    className="w-full text-xs outline-none text-slate-700 bg-transparent"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {filteredCrops.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectCropId(c.id);
                        setIsCropDropdownOpen(false);
                        setCropSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        c.id === selectedCropId
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang === 'hi' ? c.nameHi : c.nameEn}</span>
                      <span className="text-[10px] text-slate-400">{c.season}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Soil Type Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.soilSelectionLabel}</span>
          </label>
          <select
            value={selectedSoilId}
            onChange={(e) => onSelectSoilId(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-colors"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === 'hi' ? s.labelHi : s.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Sowing Date Picker & Quick Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.sowingDateLabel}</span>
            </label>
            {sowingDate && (
              <button
                type="button"
                onClick={() => onSelectSowingDate('')}
                className="text-[10px] text-red-600 hover:underline font-semibold"
              >
                {t.clearDate}
              </button>
            )}
          </div>
          <input
            type="date"
            value={sowingDate || ''}
            onChange={(e) => onSelectSowingDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          />
          {/* Quick presets */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => handleQuickDate(0)}
              className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
            >
              {t.quickDateToday}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(15)}
              className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
            >
              {t.quickDate15Days}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(30)}
              className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
            >
              {t.quickDate30Days}
            </button>
          </div>
        </div>

        {/* 4. Irrigation Method Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.irrigationMethodLabel}</span>
          </label>
          <select
            value={irrigationMethodId}
            onChange={(e) => onSelectIrrigationMethod(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-colors"
          >
            {IRRIGATION_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {lang === 'hi' ? m.labelHi : m.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Smart Irrigation Schedule Output Display */}
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50/20 to-white rounded-2xl p-5 border border-slate-200/90 space-y-4">
        {/* Top Summary Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">
              {lang === 'hi' ? schedule.crop.nameHi : schedule.crop.nameEn}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {lang === 'hi' ? schedule.soil.labelHi : schedule.soil.labelEn}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {lang === 'hi' ? schedule.method.labelHi : schedule.method.labelEn}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${currentStatusMeta.badgeClass}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{currentStatusMeta.label}</span>
          </div>
        </div>

        {/* Schedule Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Current Growth Stage */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.currentGrowthStage}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {lang === 'hi' ? schedule.currentStage.nameHi : schedule.currentStage.nameEn}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              {lang === 'hi' ? schedule.currentStage.importanceHi : schedule.currentStage.importance}
            </div>
          </div>

          {/* Next Expected Irrigation */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.nextIrrigationDate}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {formatDateDisplay(schedule.nextDate)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {schedule.daysUntilNext === 0
                ? (lang === 'hi' ? 'आज ही देय' : 'Due Today')
                : `${schedule.daysUntilNext} ${t.daysFromNow}`}
            </div>
          </div>

          {/* Recommended Interval */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.recommendedInterval}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              ~{schedule.adjustedIntervalDays} {t.daysUnit}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {t.soilRetentionLabel}: <span className="font-semibold text-slate-700">{schedule.soil.retention}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Weather & Agronomic Reason */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
          <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              {lang === 'hi' ? schedule.reasonHi : schedule.reasonEn}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'hi' ? schedule.cropNoteHi : schedule.cropNoteEn}
            </p>
          </div>
        </div>

        {/* Timeline of Upcoming Growth Stages & Irrigation Events */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.timelineTitle}</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              {schedule.timeline.length} {lang === 'hi' ? 'महत्वपूर्ण चरण' : 'Critical Stages'}
            </span>
          </div>

          {/* Timeline Stages List */}
          <div className="space-y-2">
            {schedule.timeline.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                  item.stageStatus === 'active'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300 font-semibold'
                    : item.stageStatus === 'completed'
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    item.stageStatus === 'active'
                      ? 'bg-emerald-700 text-white'
                      : item.stageStatus === 'completed'
                      ? 'bg-slate-300 text-slate-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {lang === 'hi' ? item.nameHi : item.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {lang === 'hi' ? `${item.dayMin}-${item.dayMax} दिन` : `Day ${item.dayMin}–${item.dayMax}`}
                      {' • '}
                      <span className="text-emerald-800 font-medium">{lang === 'hi' ? item.importanceHi : item.importanceEn}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <span className="text-[11px] font-medium text-slate-600">
                    {formatDateDisplay(item.expectedDate)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    item.stageStatus === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.stageStatus === 'completed'
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.stageStatus === 'active'
                      ? t.stageActive
                      : item.stageStatus === 'completed'
                      ? t.stageCompleted
                      : t.stageUpcoming}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agronomy Reference Note */}
        <div className="pt-2 text-[11px] text-slate-500 flex items-start gap-1.5 border-t border-slate-200/60">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{t.agronomyDisclaimer}</span>
        </div>
      </div>
    </div>
  );
}

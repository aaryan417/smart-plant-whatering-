// src/components/Recommendation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Droplet, 
  XCircle, 
  Clock, 
  Eye, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Radio, 
  AlertCircle 
} from 'lucide-react';
import { calculateIrrigationRecommendation } from '../utils/irrigationEngine';

/**
 * Generate natural, simple Hindi spoken advisory script.
 * Strict adherence to the 4 requirement states:
 * - WATER: आज पौधों को पानी देने की सलाह दी जाती है।
 * - SKIP: मिट्टी में पर्याप्त नमी है। अभी पानी देने की जरूरत नहीं है।
 * - DELAY: जल्द बारिश होने की संभावना है। फिलहाल पानी देने से रुकें।
 * - MONITOR: मिट्टी की नमी ठीक है। कुछ समय बाद दोबारा जांच करें।
 * 
 * Plus dynamic crop & soil schedule context (Requirement 7):
 * "आपकी गेहूं की फसल काली मिट्टी में लगी है। अगली सिंचाई की अनुमानित तारीख 10 नवंबर है। मौसम के अनुसार बारिश की संभावना को भी ध्यान में रखा गया है।"
 */
export function generateHindiSpeechText(decision, moisture, rainProb = 0, rainAmount = 0, cropSchedule = null) {
  let stateMessage = "";
  switch (decision) {
    case "WATER":
      stateMessage = "आज पौधों को पानी देने की सलाह दी जाती है।";
      break;
    case "SKIP":
      stateMessage = "मिट्टी में पर्याप्त नमी है। अभी पानी देने की जरूरत नहीं है।";
      break;
    case "DELAY":
      stateMessage = "जल्द बारिश होने की संभावना है। फिलहाल पानी देने से रुकें।";
      break;
    case "MONITOR":
      stateMessage = "मिट्टी की नमी ठीक है। कुछ समय बाद दोबारा जांच करें।";
      break;
    default:
      stateMessage = "मिट्टी की नमी सामान्य है।";
  }

  // If crop and soil are configured, integrate crop schedule
  if (cropSchedule && cropSchedule.crop && cropSchedule.soil) {
    const cropName = cropSchedule.crop.nameHi;
    const soilName = cropSchedule.soil.labelHi;
    const nextDate = new Date(cropSchedule.nextDate);
    const dateFormatted = nextDate.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long' });
    
    let speech = `आपकी ${cropName} की फसल ${soilName} में लगी है। अगली सिंचाई की अनुमानित तारीख ${dateFormatted} है। ${stateMessage}`;
    if (rainProb >= 40 || rainAmount >= 2) {
      speech += ` मौसम के अनुसार अगले 24 घंटों में ${rainProb} प्रतिशत बारिश की संभावना को भी ध्यान में रखा गया है।`;
    } else {
      speech += ` वर्तमान में खेत की मिट्टी में नमी ${moisture} प्रतिशत है।`;
    }
    return speech;
  }

  // Standard fallback advisory
  let text = `खेत में मिट्टी की नमी ${moisture} प्रतिशत है। ${stateMessage}`;
  if (rainProb > 0 || rainAmount > 0) {
    text += ` अगले 24 घंटों में बारिश की संभावना ${rainProb} प्रतिशत और लगभग ${rainAmount} मिलीमीटर वर्षा का अनुमान है।`;
  }
  return text;
}

/**
 * English spoken advisory script with crop schedule integration.
 */
export function generateEnglishSpeechText(decision, moisture, rainProb = 0, rainAmount = 0, cropSchedule = null) {
  let stateMessage = "";
  switch (decision) {
    case "WATER":
      stateMessage = "Watering the plants is recommended today.";
      break;
    case "SKIP":
      stateMessage = "Soil moisture is sufficient. No watering is needed right now.";
      break;
    case "DELAY":
      stateMessage = "Rain is expected soon. Please delay watering for now.";
      break;
    case "MONITOR":
      stateMessage = "Soil moisture is in the normal range. Please check back later.";
      break;
    default:
      stateMessage = "Soil condition is normal.";
  }

  if (cropSchedule && cropSchedule.crop && cropSchedule.soil) {
    const cropName = cropSchedule.crop.nameEn;
    const soilName = cropSchedule.soil.labelEn;
    const nextDate = new Date(cropSchedule.nextDate);
    const dateFormatted = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    let speech = `Your ${cropName} crop is planted in ${soilName}. The next expected irrigation date is ${dateFormatted}. ${stateMessage}`;
    if (rainProb >= 40 || rainAmount >= 2) {
      speech += ` Weather forecast with ${rainProb}% rain probability has been factored into this schedule.`;
    } else {
      speech += ` Current soil moisture is ${moisture} percent.`;
    }
    return speech;
  }

  let text = `Current soil moisture is ${moisture} percent. ${stateMessage}`;
  if (rainProb > 0 || rainAmount > 0) {
    text += ` Next 24 hours rain probability is ${rainProb} percent with approximately ${rainAmount} millimeters of rainfall expected.`;
  }
  return text;
}

export default function Recommendation({ 
  moisture, 
  upcomingRainProb = 0, 
  upcomingRainAmount = 0, 
  cropSchedule = null,
  t,
  lang 
}) {
  const result = calculateIrrigationRecommendation(moisture, upcomingRainProb, upcomingRainAmount);

  // Configuration for each decision state
  const decisionConfig = {
    WATER: {
      actionLabel: t.actionWater,
      icon: Droplet,
      iconBg: 'bg-emerald-600 text-white',
      cardBg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-white',
      border: 'border-emerald-300',
      tagBg: 'bg-emerald-700 text-white',
      accentColor: 'text-emerald-700',
    },
    SKIP: {
      actionLabel: t.actionSkip,
      icon: XCircle,
      iconBg: 'bg-blue-600 text-white',
      cardBg: 'bg-gradient-to-br from-blue-500/10 via-blue-50/50 to-white',
      border: 'border-blue-300',
      tagBg: 'bg-blue-700 text-white',
      accentColor: 'text-blue-700',
    },
    DELAY: {
      actionLabel: t.actionDelay,
      icon: Clock,
      iconBg: 'bg-amber-600 text-white',
      cardBg: 'bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white',
      border: 'border-amber-300',
      tagBg: 'bg-amber-700 text-white',
      accentColor: 'text-amber-700',
    },
    MONITOR: {
      actionLabel: t.actionMonitor,
      icon: Eye,
      iconBg: 'bg-slate-700 text-white',
      cardBg: 'bg-gradient-to-br from-slate-500/10 via-slate-50/50 to-white',
      border: 'border-slate-300',
      tagBg: 'bg-slate-800 text-white',
      accentColor: 'text-slate-700',
    },
  };

  const currentCfg = decisionConfig[result.decision] || decisionConfig.MONITOR;
  const ActionIcon = currentCfg.icon;
  const reasonText = t[result.reasonKey] || '';

  // --- Web Speech API State ---
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceLang, setVoiceLang] = useState('hi'); // Default: Hindi (hi-IN)
  const [availableVoices, setAvailableVoices] = useState([]);
  
  const utteranceRef = useRef(null);

  // Check browser speech synthesis support & load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup: cancel any speech on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel previous speech if recommendation parameters or crop schedule changes
  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [result.decision, moisture, upcomingRainProb, upcomingRainAmount, cropSchedule?.crop?.id, cropSchedule?.soil?.id, cropSchedule?.nextDate]);

  // Handle Play Speech
  const handlePlay = () => {
    if (!isSupported) return;

    // 1. Cancel previous speech before starting a new message
    window.speechSynthesis.cancel();

    // 2. Generate updated speech text based on current recommendation and voice choice
    const textToSpeak = voiceLang === 'hi'
      ? generateHindiSpeechText(result.decision, moisture, upcomingRainProb, upcomingRainAmount, cropSchedule)
      : generateEnglishSpeechText(result.decision, moisture, upcomingRainProb, upcomingRainAmount, cropSchedule);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95; // Natural, clear pacing for farmers
    utterance.pitch = 1.0;

    // 3. Select an available voice if present (prefer hi-IN/hi)
    if (availableVoices.length > 0) {
      if (voiceLang === 'hi') {
        const hindiVoice = availableVoices.find(v => 
          v.lang === 'hi-IN' || 
          v.lang === 'hi' || 
          v.lang.startsWith('hi-') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.includes('हिन्दी')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const engVoice = availableVoices.find(v => 
          v.lang === 'en-IN' || 
          v.lang === 'en-US' || 
          v.lang.startsWith('en')
        );
        if (engVoice) utterance.voice = engVoice;
      }
    }

    // 4. Utterance Event Listeners
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis event error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Handle Pause
  const handlePause = () => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Handle Resume
  const handleResume = () => {
    if (!isSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      handlePlay();
    }
  };

  // Handle Stop
  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md flex flex-col justify-between ${currentCfg.cardBg} ${currentCfg.border}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {t.recommendationTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.recommendationSubtitle}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {t.decisionLabel}
          </span>
        </div>

        {/* Big Decision Banner */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/90 backdrop-blur shadow-xs border border-slate-200/80 mb-5">
          <div className={`p-3 rounded-2xl shadow-sm ${currentCfg.iconBg}`}>
            <ActionIcon className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.decisionLabel}:
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-0.5">
              {currentCfg.actionLabel}
            </div>
          </div>
        </div>

        {/* Simple Explanation */}
        <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 mb-5 text-sm text-slate-700 leading-relaxed font-medium">
          {reasonText}
        </div>

        {/* 🎙️ Hindi Voice Advisory Section (Requirements 1-13) */}
        <div className="mb-5 p-4 rounded-xl bg-white/95 border border-emerald-200/90 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                {lang === 'hi' ? 'हिंदी वॉयस सलाह' : 'Hindi Voice Advisory'}
              </span>
            </div>

            {/* Optional Voice Language Switcher (Defaults to Hindi hi-IN) */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => {
                  setVoiceLang('hi');
                  if (isPlaying) handleStop();
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  voiceLang === 'hi' 
                    ? 'bg-emerald-700 text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hindi Voice (Default / डिफ़ॉल्ट)"
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceLang('en');
                  if (isPlaying) handleStop();
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  voiceLang === 'en' 
                    ? 'bg-emerald-700 text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English Voice"
              >
                EN
              </button>
            </div>
          </div>

          {!isSupported ? (
            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t.voiceUnavailable}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Voice Spoken Preview & Status */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed font-sans flex items-start gap-2">
                <Radio className={`w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5 ${isPlaying && !isPaused ? 'animate-pulse' : ''}`} />
                <p className="italic">
                  "{voiceLang === 'hi' 
                    ? generateHindiSpeechText(result.decision, moisture, upcomingRainProb, upcomingRainAmount, cropSchedule)
                    : generateEnglishSpeechText(result.decision, moisture, upcomingRainProb, upcomingRainAmount, cropSchedule)}"
                </p>
              </div>

              {/* Speech Controls Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {!isPlaying ? (
                  /* Primary "Listen to Advice / सलाह सुनें" Button */
                  <button
                    type="button"
                    onClick={handlePlay}
                    aria-label={lang === 'hi' ? 'सलाह सुनें' : 'Listen to Advice'}
                    className="flex-1 min-w-[170px] flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>
                      {lang === 'hi' ? 'सलाह सुनें (ऑडियो)' : 'Listen to Advice / सलाह सुनें'}
                    </span>
                  </button>
                ) : (
                  /* Playing Controls: Pause / Resume & Stop */
                  <>
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                      <span className="truncate">
                        {isPaused ? t.pausedNow : t.speakingNow}
                      </span>
                    </div>

                    {/* Pause / Resume Button */}
                    <button
                      type="button"
                      onClick={isPaused ? handleResume : handlePause}
                      aria-label={isPaused ? t.resumeAdvice : t.pauseAdvice}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                      title={isPaused ? t.resumeAdvice : t.pauseAdvice}
                    >
                      {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    </button>

                    {/* Stop Button */}
                    <button
                      type="button"
                      onClick={handleStop}
                      aria-label={t.stopAdvice}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
                      title={t.stopAdvice}
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center mb-5">
          <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-500 block truncate">
              {t.factorSoil}
            </span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              {moisture}%
            </span>
          </div>

          <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-500 block truncate">
              {t.factorRainProb}
            </span>
            <span className="text-sm font-bold text-blue-600 mt-0.5 block">
              {upcomingRainProb}%
            </span>
          </div>

          <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-500 block truncate">
              {t.factorRainSum}
            </span>
            <span className="text-sm font-bold text-blue-700 mt-0.5 block">
              {upcomingRainAmount} mm
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Hardware Notice */}
      <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
        <Cpu className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
        <p className="leading-snug">
          {t.noPhysicalPumpNote}
        </p>
      </div>
    </div>
  );
}

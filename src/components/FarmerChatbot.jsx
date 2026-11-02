// src/components/FarmerChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  ChevronDown, 
  User, 
  Sprout, 
  Layers, 
  Droplet,
  Volume2,
  Square,
  Mic,
  MicOff
} from 'lucide-react';
import { 
  sendFarmerMessage, 
  SUGGESTED_PROMPTS, 
  SAFETY_DISCLAIMER, 
  IS_DEMO_MODE 
} from '../services/aiChatService';
import { 
  preprocessTextForSpeech, 
  chunkSpeechText 
} from '../utils/speechPreprocessor';

export default function FarmerChatbot({
  context,
  lang = 'en',
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initial welcome message
  const initialMessages = [
    {
      id: 'welcome',
      sender: 'bot',
      text: lang === 'hi'
        ? `नमस्ते किसान भाई! 🙏 मैं आपका **किसान एआई सहायक (डेमो)** हूँ।\n\nमैं आपके खेत की चुनी हुई फसल (**${context?.cropNameHi || 'गेहूं'}**), मिट्टी (**${context?.soilNameHi || 'काली मिट्टी'}**), और वर्तमान मिट्टी नमी (**${context?.soilMoisture || 45}%**) के आधार पर सिंचाई व फसल सलाह दे सकता हूँ।\n\nनीचे दिए गए सुझाव पर क्लिक करें या अपना सवाल टाइप करें!`
        : `Hello farmer! 🙏 I am your **Farmer AI Assistant (Demo)**.\n\nI can provide personalized irrigation and crop advice using your farm's active data (**${context?.cropNameEn || 'Wheat'}** in **${context?.soilNameEn || 'Black Soil'}**, Soil Moisture: **${context?.soilMoisture || 45}%**).\n\nTap a suggested question below or type your query!`,
      disclaimer: null,
      timestamp: new Date(),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [activePlayingMsgId, setActivePlayingMsgId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const queueRef = useRef({ msgId: null, chunks: [], index: 0, isCancelled: false });
  const messagesEndRef = useRef(null);

  // Speech-to-Text Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (e) {
        console.warn('Speech voices load error:', e);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop active speech playback
  const handleStopSpeech = () => {
    if (queueRef.current) {
      queueRef.current.isCancelled = true;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActivePlayingMsgId(null);
  };

  // Stop active speech recognition (listening)
  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Stop speech playback or recognition if chat modal is closed
  useEffect(() => {
    if (!isOpen) {
      if (activePlayingMsgId) handleStopSpeech();
      handleStopListening();
      setSpeechError(null);
    }
  }, [isOpen]);

  // Stop listening when language is switched
  useEffect(() => {
    if (isListening) {
      handleStopListening();
    }
  }, [lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Handle Toggle Speech Recognition (Microphone)
  const handleToggleListening = () => {
    // 1. If currently listening, stop it
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // 2. Stop any active text-to-speech so assistant voice doesn't feed into mic
    handleStopSpeech();
    setSpeechError(null);

    // 3. Browser SpeechRecognition support check
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      setSpeechError(
        lang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) समर्थित नहीं है। कृपया Google Chrome या Microsoft Edge का उपयोग करें।'
          : 'Speech recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Base prefix if user has already typed partial text
      const basePrefix = inputMessage.trim() ? inputMessage.trim() + ' ' : '';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        const spoken = finalTranscript || interimTranscript;
        if (spoken) {
          setInputMessage(basePrefix + spoken);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError(
            lang === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
              : 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          );
        } else if (event.error === 'no-speech') {
          setSpeechError(
            lang === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः बोलें।'
              : 'No speech was detected. Please try speaking again.'
          );
        } else if (event.error === 'network') {
          setSpeechError(
            lang === 'hi'
              ? 'नेटवर्क त्रुटि: आवाज़ पहचान के लिए सक्रिय इंटरनेट आवश्यक है।'
              : 'Network error: speech recognition requires an active internet connection.'
          );
        } else if (event.error !== 'aborted') {
          setSpeechError(
            lang === 'hi'
              ? 'आवाज़ पहचानने में समस्या हुई। कृपया पुनः प्रयास करें।'
              : 'Failed to recognize speech. Please try again.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition activation error:', err);
      setIsListening(false);
      setSpeechError(
        lang === 'hi'
          ? 'माइक्रोफ़ोन शुरू करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Could not activate microphone. Please try again.'
      );
    }
  };

  // Handle Play speech for an assistant message
  const handlePlayMessage = (msg) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      return;
    }

    // Toggle off if already playing this message
    if (activePlayingMsgId === msg.id) {
      handleStopSpeech();
      return;
    }

    // Cancel any ongoing speech
    handleStopSpeech();

    // 1. Preprocess text: remove markdown formatting, convert symbols, preserve all farm details & warnings
    const cleanSpeech = preprocessTextForSpeech(msg.text, msg.disclaimer, lang);
    if (!cleanSpeech) return;

    // 2. Split text into sentence chunks to avoid browser SpeechSynthesis timeout cut-offs
    const chunks = chunkSpeechText(cleanSpeech, 180);
    if (!chunks || chunks.length === 0) return;

    setActivePlayingMsgId(msg.id);
    const playbackState = {
      msgId: msg.id,
      chunks,
      index: 0,
      isCancelled: false,
    };
    queueRef.current = playbackState;

    const speakChunk = (idx) => {
      if (playbackState.isCancelled || playbackState.msgId !== msg.id) return;
      if (idx >= chunks.length) {
        setActivePlayingMsgId(null);
        return;
      }

      const chunkText = chunks[idx];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select voice if available
      if (availableVoices && availableVoices.length > 0) {
        if (lang === 'hi') {
          const hindiVoice = availableVoices.find(v => 
            v.lang === 'hi-IN' || 
            v.lang === 'hi' || 
            v.lang.startsWith('hi-') ||
            (v.name && v.name.toLowerCase().includes('hindi')) ||
            (v.name && v.name.includes('हिन्दी'))
          );
          if (hindiVoice) utterance.voice = hindiVoice;
        } else {
          const engVoice = availableVoices.find(v => 
            v.lang === 'en-IN' || 
            v.lang === 'en-GB' || 
            v.lang === 'en-US' || 
            v.lang.startsWith('en')
          );
          if (engVoice) utterance.voice = engVoice;
        }
      }

      utterance.onend = () => {
        if (!playbackState.isCancelled && playbackState.msgId === msg.id) {
          playbackState.index = idx + 1;
          speakChunk(idx + 1);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis error:', e);
        }
        if (playbackState.msgId === msg.id) {
          setActivePlayingMsgId(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    handleStopSpeech();
    handleStopListening();
    setSpeechError(null);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendFarmerMessage({
        message: query,
        context,
        lang,
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        disclaimer: response.disclaimer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: lang === 'hi' 
          ? 'माफ़ कीजिए, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, I encountered an issue retrieving an answer. Please try again.',
        disclaimer: null,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chat
  const handleResetChat = () => {
    handleStopSpeech();
    handleStopListening();
    setSpeechError(null);
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Action Button (Accessible on both pages) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={lang === 'hi' ? 'किसान एआई सहायक से बात करें' : 'Chat with Farmer AI Assistant'}
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-emerald-500/30"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-700 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">
              {lang === 'hi' ? 'किसान AI सहायक' : 'Farmer AI Assistant'}
            </span>
            <span className="text-[10px] text-emerald-200 block">
              {lang === 'hi' ? 'सलाह लें • डेमो' : 'Ask Question • Demo'}
            </span>
          </div>
        </button>
      </div>

      {/* Floating Chat Panel Modal */}
      {isOpen && (
        <div 
          className="fixed inset-x-3 bottom-20 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px] h-[580px] max-h-[80vh] z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Farmer AI Assistant"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-900/60 rounded-xl border border-emerald-600/40">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {lang === 'hi' ? 'किसान AI सहायक' : 'Farmer AI Assistant'}
                  </h3>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-950">
                    DEMO
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">
                  {lang === 'hi' ? 'खेत टेलीमेट्री आधारित सलाह' : 'Farm context-aware advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset History */}
              <button
                type="button"
                onClick={handleResetChat}
                title={lang === 'hi' ? 'बातचीत रीसेट करें' : 'Reset Chat'}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={lang === 'hi' ? 'बंद करें' : 'Close'}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Farm Context Snapshot Strip */}
          <div className="px-3 py-1.5 bg-emerald-50/80 border-b border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-2">
            <span className="font-bold flex items-center gap-1">
              <Sprout className="w-3 h-3 text-emerald-700" />
              {lang === 'hi' ? context?.cropNameHi : context?.cropNameEn}
            </span>
            <span>•</span>
            <span className="text-slate-600">
              {lang === 'hi' ? context?.soilNameHi : context?.soilNameEn}
            </span>
            <span>•</span>
            <span className="text-blue-700 font-semibold flex items-center gap-0.5">
              <Droplet className="w-3 h-3" />
              {context?.soilMoisture}%
            </span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 font-bold border border-emerald-200">
              {context?.recommendationDecision}
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">
                    {msg.text}
                  </p>

                  {/* Safety Disclaimer for disease, pest, or fertilizer inquiries */}
                  {msg.disclaimer && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug flex items-start gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  {/* Message Footer with Play/Stop voice button and Timestamp */}
                  <div className={`flex items-center pt-1.5 mt-1 border-t ${
                    msg.sender === 'bot' 
                      ? 'justify-between border-slate-100' 
                      : 'justify-end border-emerald-600/30'
                  }`}>
                    {/* Voice audio controls for assistant responses */}
                    {msg.sender === 'bot' && (
                      <button
                        type="button"
                        onClick={() => activePlayingMsgId === msg.id ? handleStopSpeech() : handlePlayMessage(msg)}
                        title={activePlayingMsgId === msg.id
                          ? (lang === 'hi' ? 'बोलना रोकें' : 'Stop voice')
                          : (lang === 'hi' ? 'उत्तर बोलकर सुनें' : 'Listen to response')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          activePlayingMsgId === msg.id
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 shadow-xs animate-pulse'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        {activePlayingMsgId === msg.id ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current text-rose-700" />
                            <span>{lang === 'hi' ? 'रोकें' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
                          </>
                        )}
                      </button>
                    )}

                    <span
                      className={`text-[10px] ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing animation indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(lang === 'hi' ? prompt.textHi : prompt.textEn)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
              >
                {lang === 'hi' ? prompt.textHi : prompt.textEn}
              </button>
            ))}
          </div>

          {/* Active Listening Indicator Banner */}
          {isListening && (
            <div className="px-3.5 py-1.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <span className="font-semibold text-[11px]">
                  {lang === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'}
                </span>
                <span className="text-[10px] text-rose-500 font-medium hidden sm:inline">
                  ({lang === 'hi' ? 'हिन्दी hi-IN' : 'English en-IN'})
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopListening}
                className="text-[11px] font-bold text-rose-800 hover:text-rose-950 underline cursor-pointer"
              >
                {lang === 'hi' ? 'रोकें' : 'Stop'}
              </button>
            </div>
          )}

          {/* Speech Recognition Error Banner */}
          {speechError && (
            <div className="px-3.5 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-[11px] text-amber-900 animate-fadeIn">
              <span className="flex-1 mr-2 leading-tight">{speechError}</span>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                title={lang === 'hi' ? 'बंद करें' : 'Dismiss'}
                className="p-1 text-amber-700 hover:text-amber-950 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? (lang === 'hi' ? 'बोलिए, आवाज़ पहचानी जा रही है...' : 'Listening, speak your question...')
                  : (lang === 'hi'
                    ? 'अपनी फसल या सिंचाई के बारे में पूछें...'
                    : 'Ask about irrigation, crops, or weather...')
              }
              className={`flex-1 px-3.5 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 outline-none transition-all ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-300/40 bg-rose-50/20'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'
              }`}
              disabled={isLoading}
            />

            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              disabled={isLoading}
              title={
                isListening
                  ? (lang === 'hi' ? 'आवाज़ सुनना बंद करें' : 'Stop voice listening')
                  : (lang === 'hi' ? 'बोलकर पूछें (माइक)' : 'Voice input (Microphone)')
              }
              aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse ring-2 ring-rose-400/50'
                  : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              title={lang === 'hi' ? 'संदेश भेजें' : 'Send Message'}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

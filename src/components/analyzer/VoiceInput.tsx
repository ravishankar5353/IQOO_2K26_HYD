'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Send, Volume2, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onVoiceTranscript: (query: string) => void;
  isLoading?: boolean;
}

export default function VoiceInput({ onVoiceTranscript, isLoading }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'en-IN';

        reco.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        reco.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(reco);
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start speech reco:', e);
      }
    }
  };

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    onVoiceTranscript(transcript.trim());
  };

  const sampleVoicePrompts = [
    '“Is ₹49,999 a good price for the Apex Pro phone or should I wait?”',
    '“Analyze AuraPulse noise cancelling headphones deal”',
    '“Check if 4TB SSD for ₹1,499 is a scam”',
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-white/10 space-y-4 text-center">
      {/* Microphone button with pulse rings */}
      <div className="relative inline-block my-2">
        {isListening && (
          <>
            <span className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping" />
            <span className="absolute -inset-6 rounded-full bg-cyan-500/20 animate-pulse" />
          </>
        )}
        <button
          type="button"
          onClick={toggleListening}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isListening
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/50'
              : 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 hover:scale-105 shadow-emerald-500/40'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="w-9 h-9 animate-pulse" />
          ) : (
            <Mic className="w-9 h-9 stroke-[2.5]" />
          )}
        </button>
      </div>

      <div>
        <h4 className="text-sm font-bold text-foreground">
          {isListening ? 'Listening... Speak your shopping question' : 'Tap Microphone to Speak'}
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          {isSupported
            ? 'Dictate a product name, price, or ask our AI whether you should buy or wait.'
            : 'Voice API not supported on this browser. You can type directly below.'}
        </p>
      </div>

      {/* Live Transcript / Manual Fallback Box */}
      <div className="space-y-2">
        <textarea
          rows={2}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isListening
              ? 'Listening to speech...'
              : 'Or type your query here (e.g. "Apex Pro 5G Ultra @ ₹49,999 on Flipkart")'
          }
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/80 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all resize-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!transcript.trim() || isLoading}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Analyze Voice Query</span>
        </button>
      </div>

      {/* Suggested voice queries */}
      <div className="text-left pt-2 border-t border-white/5 space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-cyan-400" />
          <span>Sample Voice Queries:</span>
        </p>
        {sampleVoicePrompts.map((prompt, i) => (
          <p
            key={i}
            onClick={() => setTranscript(prompt.replace(/[“”]/g, ''))}
            className="text-[11px] text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {prompt}
          </p>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  Sparkles,
  AlertCircle,
  Volume2,
  Search,
  RefreshCw,
  Cpu,
  Globe,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VoiceProviderSelector, VoiceProviderType } from './VoiceProviderSelector';
import { BrowserSpeechProvider } from '@/services/browserSpeech';

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'recording'
  | 'uploading'
  | 'transcribing'
  | 'retrieving'
  | 'generating'
  | 'complete'
  | 'error';

interface VoiceInterfaceProps {
  onQuerySubmit: (
    query: string,
    isVoice: boolean,
    provider: VoiceProviderType,
    audioBlob?: Blob
  ) => void;
  selectedProvider: VoiceProviderType;
  onSelectProvider: (provider: VoiceProviderType) => void;
  voiceState: VoiceState;
  transcript: string;
  errorMessage: string;
  fallbackSuggestProvider?: VoiceProviderType | null;
}

export function VoiceInterface({
  onQuerySubmit,
  selectedProvider,
  onSelectProvider,
  voiceState,
  transcript,
  errorMessage,
  fallbackSuggestProvider,
}: VoiceInterfaceProps) {
  const [textInput, setTextInput] = useState('');
  const [isRecordingMedia, setIsRecordingMedia] = useState(false);
  const [browserSpeechActive, setBrowserSpeechActive] = useState(false);
  const [liveInterimTranscript, setLiveInterimTranscript] = useState('');
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const browserSpeechRef = useRef<BrowserSpeechProvider | null>(null);

  const sampleQueries = [
    'What is Hacker House Goa 2026?',
    'How does low-latency vector retrieval work?',
    'What safety guardrails are implemented?',
    'Tell me about Sarvam AI Speech-to-Text.',
  ];

  useEffect(() => {
    browserSpeechRef.current = new BrowserSpeechProvider();
    setIsBrowserSupported(browserSpeechRef.current.isSupported());
  }, []);

  const handleStartVoice = async () => {
    setMicPermissionDenied(false);
    setLiveInterimTranscript('');

    const effectiveProvider = selectedProvider === 'auto' ? 'browser' : selectedProvider;

    if (effectiveProvider === 'browser') {
      if (browserSpeechRef.current && browserSpeechRef.current.isSupported()) {
        const started = browserSpeechRef.current.start({
          onStart: () => {
            setBrowserSpeechActive(true);
          },
          onResult: (currentTranscript, isFinal) => {
            setLiveInterimTranscript(currentTranscript);
            if (isFinal && currentTranscript.trim()) {
              browserSpeechRef.current?.stop();
              setBrowserSpeechActive(false);
              onQuerySubmit(currentTranscript.trim(), true, 'browser');
            }
          },
          onError: (err) => {
            setBrowserSpeechActive(false);
            console.warn('[Browser Speech Error]', err);
            // In auto mode or manual browser mode, fallback gracefully if unsupported/denied
            if (selectedProvider === 'auto') {
              console.log('[Auto Mode] Browser STT error, switching to media recording for cloud STT...');
              startMediaRecorder('sarvam');
            } else {
              setMicPermissionDenied(true);
            }
          },
          onEnd: () => {
            setBrowserSpeechActive(false);
          },
        });

        if (!started && selectedProvider === 'auto') {
          startMediaRecorder('sarvam');
        }
      } else {
        if (selectedProvider === 'auto') {
          startMediaRecorder('sarvam');
        } else {
          setMicPermissionDenied(true);
        }
      }
    } else {
      // Cloud STT (Sarvam / ElevenLabs) -> Record Audio Blob
      startMediaRecorder(effectiveProvider);
    }
  };

  const startMediaRecorder = async (provider: VoiceProviderType) => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());
        setIsRecordingMedia(false);

        // Submit voice query with audio blob
        onQuerySubmit('', true, provider, audioBlob);
      };

      mediaRecorder.start();
      setIsRecordingMedia(true);
    } catch (err) {
      console.warn('[Mic Access Denied]', err);
      setMicPermissionDenied(true);
      setIsRecordingMedia(false);
    }
  };

  const handleStopVoice = () => {
    if (browserSpeechActive && browserSpeechRef.current) {
      browserSpeechRef.current.stop();
      setBrowserSpeechActive(false);
      if (liveInterimTranscript.trim()) {
        onQuerySubmit(liveInterimTranscript.trim(), true, 'browser');
      }
    }

    if (isRecordingMedia && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (browserSpeechActive || isRecordingMedia) {
      handleStopVoice();
    } else {
      handleStartVoice();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      textInput.trim() &&
      voiceState !== 'transcribing' &&
      voiceState !== 'retrieving' &&
      voiceState !== 'generating' &&
      voiceState !== 'uploading'
    ) {
      onQuerySubmit(textInput.trim(), false, selectedProvider);
      setTextInput('');
    }
  };

  const isBusy =
    voiceState === 'uploading' ||
    voiceState === 'transcribing' ||
    voiceState === 'retrieving' ||
    voiceState === 'generating';

  const isRecordingActive = browserSpeechActive || isRecordingMedia;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Voice Provider Selector Control */}
      <VoiceProviderSelector
        selectedProvider={selectedProvider}
        onSelectProvider={onSelectProvider}
        isBrowserSupported={isBrowserSupported}
      />

      {/* Main Voice Interaction Hero Card */}
      <div className="editorial-card p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Active Provider Badge */}
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A4C2B] text-[#FFD400] text-xs font-editorial-mono font-bold border border-[#FFD400]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
          <span>ACTIVE: {selectedProvider.toUpperCase()}</span>
        </div>

        <h2 className="font-editorial-serif font-extrabold text-3xl sm:text-5xl text-[#0A4C2B] tracking-tight mb-2">
          ASK THE KNOWLEDGE BASE.
        </h2>
        <p className="font-editorial-mono text-xs sm:text-sm text-[#0A4C2B]/80 max-w-xl mx-auto mb-8 uppercase tracking-wider">
          Speak your question naturally • Low-latency hybrid vector retrieval & grounded answer generation
        </p>

        {/* Primary Microphone Action Button */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isBusy}
            className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isRecordingActive
                ? 'bg-[#FF007A] text-white border-4 border-[#0A4C2B] animate-mic-pulse scale-105 shadow-[0_0_20px_rgba(255,0,122,0.6)]'
                : 'bg-[#FFD400] text-[#0A4C2B] border-4 border-[#0A4C2B] shadow-[6px_6px_0px_#0A4C2B] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_#0A4C2B]'
            }`}
            aria-label={isRecordingActive ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecordingActive ? (
              <>
                <MicOff className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
                <span className="text-[10px] font-editorial-display font-bold uppercase tracking-widest mt-1">
                  TAP TO FINISH
                </span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                <span className="text-[10px] font-editorial-display font-bold uppercase tracking-widest mt-1">
                  TAP TO SPEAK
                </span>
              </>
            )}
          </button>

          {/* Animated Waveform Visual Feedback */}
          {isRecordingActive && (
            <div className="flex items-center gap-1.5 h-8 mt-6">
              <div className="w-1.5 h-6 bg-[#FF007A] rounded-full animate-bounce" />
              <div className="w-1.5 h-8 bg-[#FFD400] rounded-full animate-bounce [animation-delay:0.15s]" />
              <div className="w-1.5 h-4 bg-[#0A4C2B] rounded-full animate-bounce [animation-delay:0.3s]" />
              <div className="w-1.5 h-8 bg-[#FF007A] rounded-full animate-bounce [animation-delay:0.45s]" />
              <div className="w-1.5 h-5 bg-[#FFD400] rounded-full animate-bounce [animation-delay:0.6s]" />
            </div>
          )}

          {/* Live Micro-State Status Indicator */}
          <div className="mt-6 flex items-center justify-center">
            {voiceState === 'idle' && (
              <span className="text-xs font-editorial-mono font-bold text-[#0A4C2B]/80 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#0A4C2B]/10 border border-[#0A4C2B]/20">
                🎙 Microphone Ready ({selectedProvider.toUpperCase()}) • Tap to speak
              </span>
            )}
            {(voiceState === 'listening' || isRecordingActive) && (
              <span className="text-xs font-editorial-mono font-bold text-[#FF007A] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FF007A]/15 border border-[#FF007A]/40 animate-pulse flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FF007A]" /> Listening to input...
              </span>
            )}
            {voiceState === 'uploading' && (
              <span className="text-xs font-editorial-mono font-bold text-[#0A4C2B] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FFD400] border border-[#0A4C2B] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0A4C2B]" /> Uploading audio to server...
              </span>
            )}
            {voiceState === 'transcribing' && (
              <span className="text-xs font-editorial-mono font-bold text-[#0A4C2B] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FFD400] border border-[#0A4C2B] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0A4C2B]" /> Transcribing with {selectedProvider.toUpperCase()}...
              </span>
            )}
            {voiceState === 'retrieving' && (
              <span className="text-xs font-editorial-mono font-bold text-[#0A4C2B] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FFD400] border border-[#0A4C2B] flex items-center gap-2">
                <Search className="w-4 h-4 animate-pulse text-[#0A4C2B]" /> Hybrid Vector Searching Index...
              </span>
            )}
            {voiceState === 'generating' && (
              <span className="text-xs font-editorial-mono font-bold text-white uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FF007A] border border-[#0A4C2B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-white" /> Grounding LLM Answer...
              </span>
            )}
            {voiceState === 'complete' && (
              <span className="text-xs font-editorial-mono font-bold text-[#0A4C2B] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#0A4C2B]/10 border border-[#0A4C2B]/20">
                ✓ Query Completed
              </span>
            )}
            {voiceState === 'error' && (
              <span className="text-xs font-editorial-mono font-bold text-[#FF007A] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#FF007A]/15 border border-[#FF007A]/30">
                ⚠️ Processing Issue
              </span>
            )}
          </div>
        </div>

        {/* Live Interim / Final Transcript Box */}
        {(transcript || liveInterimTranscript) && (
          <div className="mt-4 p-4 rounded-xl bg-[#0A4C2B]/10 border border-[#0A4C2B]/30 text-left max-w-xl mx-auto">
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider text-[#0A4C2B]/70 block mb-1">
              VOICE TRANSCRIPT ({selectedProvider.toUpperCase()}):
            </span>
            <p className="font-editorial-mono text-sm text-[#0A4C2B] font-bold">
              "{liveInterimTranscript || transcript}"
            </p>
          </div>
        )}

        {/* Error Alert Box with Fallback Trigger Action */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-[#FF007A]/15 border-2 border-[#FF007A] text-left max-w-xl mx-auto text-xs font-editorial-mono space-y-2">
            <div className="flex items-center gap-2 text-[#FF007A] font-bold">
              <AlertCircle className="w-4 h-4 text-[#FF007A] flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {fallbackSuggestProvider && (
              <div className="flex items-center justify-between pt-2 border-t border-[#FF007A]/30">
                <span className="text-[#0A4C2B]">Suggested fallback option:</span>
                <button
                  type="button"
                  onClick={() => onSelectProvider(fallbackSuggestProvider)}
                  className="px-3 py-1 rounded-lg bg-[#FFD400] text-[#0A4C2B] font-bold border border-[#0A4C2B] hover:bg-[#FFF000] transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#0A4C2B]"
                >
                  <span>Switch to {fallbackSuggestProvider.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Microphone Permission Warning */}
        {micPermissionDenied && (
          <div className="mt-4 p-3 rounded-xl bg-[#FF007A]/10 border border-[#FF007A]/30 text-xs font-editorial-mono text-[#FF007A] max-w-xl mx-auto flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF007A] flex-shrink-0" />
            <span>Microphone access blocked. Type your question in the text box below.</span>
          </div>
        )}
      </div>

      {/* Text Input Fallback Form */}
      <form onSubmit={handleTextSubmit} className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your question instead (e.g. 'What is Hacker House Goa 2026?')..."
            className="flex-1 bg-[#F7F1DF] text-[#0A4C2B] placeholder:text-[#0A4C2B]/50 font-editorial-mono text-sm sm:text-base px-6 py-4 rounded-full border-2 border-[#1E5A3B] shadow-[4px_4px_0px_#0A4C2B] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
            disabled={isBusy}
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isBusy}
            className="btn-editorial-pink px-6 py-4 rounded-full flex items-center gap-2 cursor-pointer disabled:opacity-50 min-h-[52px]"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">ASK</span>
          </button>
        </div>
      </form>

      {/* Suggested Quick Question Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        <span className="text-xs font-editorial-mono text-[#F7F1DF]/70 mr-1">SUGGESTED:</span>
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuerySubmit(q, false, selectedProvider)}
            className="px-3.5 py-1.5 rounded-full bg-[#0A4C2B] text-[#FFD400] text-xs font-editorial-mono font-bold border border-[#FFD400]/30 hover:border-[#FFD400] hover:bg-[#0E6B3A] transition-all cursor-pointer shadow-[2px_2px_0px_#0A4C2B]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

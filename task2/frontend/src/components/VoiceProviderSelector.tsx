'use client';

import React, { useState } from 'react';
import { Cpu, Globe, Zap, Layers, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export type VoiceProviderType = 'browser' | 'sarvam' | 'elevenlabs' | 'auto';

interface VoiceProviderSelectorProps {
  selectedProvider: VoiceProviderType;
  onSelectProvider: (provider: VoiceProviderType) => void;
  isBrowserSupported: boolean;
  sarvamConfigured?: boolean;
  elevenlabsConfigured?: boolean;
}

export function VoiceProviderSelector({
  selectedProvider,
  onSelectProvider,
  isBrowserSupported,
  sarvamConfigured = false,
  elevenlabsConfigured = false,
}: VoiceProviderSelectorProps) {
  const [showInfo, setShowInfo] = useState(false);

  const providers: {
    id: VoiceProviderType;
    name: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    isDefault?: boolean;
    available: boolean;
  }[] = [
    {
      id: 'browser',
      name: 'BROWSER STT',
      badge: 'DEFAULT • 0-API COST',
      description: 'Uses your web browser speech engine natively. Fast, private, and zero cloud API cost.',
      icon: <Globe className="w-4 h-4 text-[#0A4C2B]" />,
      isDefault: true,
      available: isBrowserSupported,
    },
    {
      id: 'sarvam',
      name: 'SARVAM AI',
      badge: 'CLOUD STT • INDIC',
      description: 'Sarvam AI cloud STT API (saarika:v1). Optimized for Hindi, English, and Indian regional accents.',
      icon: <Cpu className="w-4 h-4 text-[#FF007A]" />,
      available: true,
    },
    {
      id: 'elevenlabs',
      name: 'ELEVENLABS',
      badge: 'CLOUD STT • PRECISION',
      description: 'ElevenLabs Speech-to-Text API (scribe_v1). High precision transcription alternative.',
      icon: <Zap className="w-4 h-4 text-[#FFD400]" />,
      available: true,
    },
    {
      id: 'auto',
      name: 'AUTO MODE',
      badge: 'SMART FALLBACK',
      description: 'Tries Browser STT first. Automatically falls back to Sarvam AI, ElevenLabs, or text query if an error occurs.',
      icon: <Layers className="w-4 h-4 text-[#0A4C2B]" />,
      available: true,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 font-editorial-mono">
      {/* Header Label Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFD400]">
            VOICE INPUT PROVIDER
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A4C2B] text-[#FFD400] font-bold border border-[#FFD400]/40">
            DEFAULT: BROWSER
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs text-[#F7F1DF]/80 hover:text-[#FFD400] flex items-center gap-1 cursor-pointer transition-colors"
          aria-label="Toggle Provider Specs Info"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showInfo ? 'Hide Specs' : 'Provider Info'}</span>
        </button>
      </div>

      {/* Provider Selection Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {providers.map((p) => {
          const isSelected = selectedProvider === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProvider(p.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[96px] ${
                isSelected
                  ? 'bg-[#FFD400] text-[#0A4C2B] border-[#0A4C2B] shadow-[4px_4px_0px_#0A4C2B] scale-[1.02]'
                  : 'bg-[#F7F1DF] text-[#0A4C2B] border-[#1E5A3B] shadow-[2px_2px_0px_#0A4C2B] hover:border-[#FFD400] hover:translate-y-[-1px]'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-1.5 rounded-lg bg-[#0A4C2B]/10 flex items-center justify-center">
                  {p.icon}
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A]" />
                ) : p.isDefault ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0A4C2B] text-[#FFD400]">
                    DEFAULT
                  </span>
                ) : null}
              </div>

              <div>
                <span className="font-bold text-xs sm:text-sm block tracking-tight leading-tight">
                  {p.name}
                </span>
                <span className="text-[9px] font-bold tracking-wider opacity-80 block mt-0.5">
                  {p.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expandable Technical Info Panel */}
      {showInfo && (
        <div className="p-4 rounded-xl bg-[#0A4C2B] border-2 border-[#FFD400] text-[#F7F1DF] text-xs space-y-2 mt-2 shadow-[4px_4px_0px_#FFD400]">
          <div className="font-bold text-[#FFD400] uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-[#FF007A]" /> Voice Provider Architecture Specs
          </div>
          <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#F7F1DF]/90">
            <li>
              <strong className="text-[#FFD400]">Browser STT (Default):</strong> Direct browser-native SpeechRecognition. Zero API cost, sub-10ms transcript output.
            </li>
            <li>
              <strong className="text-[#FFD400]">Sarvam AI:</strong> Proxied via Render backend (`POST /api/stt`). API key is stored strictly server-side.
            </li>
            <li>
              <strong className="text-[#FFD400]">ElevenLabs:</strong> Proxied via Render backend. API key stored strictly server-side.
            </li>
            <li>
              <strong className="text-[#FFD400]">Automatic Fallback:</strong> Seamless chain: Browser → Sarvam → ElevenLabs → Text Input fallback.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

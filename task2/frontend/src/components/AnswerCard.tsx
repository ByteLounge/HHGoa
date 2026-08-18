'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { ttsService } from '@/services/textToSpeech';

export interface SourceChunk {
  source_index: number;
  document_id: string;
  title: string;
  chunk_id: string;
  strategy: string;
  relevance_score: number;
  snippet: string;
}

export interface LatencyInfo {
  stt_ms: number;
  embedding_ms: number;
  retrieval_ms: number;
  rerank_ms: number;
  generation_ms: number;
  guardrail_ms: number;
  total_ms: number;
}

interface AnswerCardProps {
  query: string;
  transcript?: string;
  answer: string;
  sources: SourceChunk[];
  confidence: number;
  grounded: boolean;
  guardrailTriggered?: string;
  latency?: LatencyInfo;
  autoSpeak?: boolean;
}

export function AnswerCard({
  query,
  transcript,
  answer,
  sources,
  confidence,
  grounded,
  guardrailTriggered,
  latency,
  autoSpeak = false,
}: AnswerCardProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const confidencePercent = Math.round(confidence * 100);

  // Trigger auto-speech readout when a new answer arrives if autoSpeak is enabled
  useEffect(() => {
    if (autoSpeak && answer) {
      handleSpeak();
    }
    return () => {
      ttsService.stop();
      setIsSpeaking(false);
    };
  }, [answer, autoSpeak]);

  const handleSpeak = () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      return;
    }

    const started = ttsService.speak(answer, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    if (started) {
      setIsSpeaking(true);
    }
  };

  const handleStopSpeech = () => {
    ttsService.stop();
    setIsSpeaking(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Editorial Grounded Answer Card */}
      <div className="editorial-card p-6 sm:p-8 relative">
        {/* Header Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E5A3B]/30 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF007A] animate-pulse" />
            <span className="font-editorial-mono font-bold text-xs uppercase tracking-wider text-[#0A4C2B]">
              GROUNDED RESPONSE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live Sub-200ms Latency Badge */}
            {latency && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-editorial-mono font-bold border flex items-center gap-1.5 ${
                  latency.total_ms <= 200.0
                    ? 'bg-[#0A4C2B] text-[#FFD400] border-[#FFD400]/40'
                    : 'bg-[#FF007A]/15 text-[#FF007A] border-[#FF007A]/40'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#FF007A]" />
                <span>⚡ {latency.total_ms}ms</span>
              </span>
            )}

            {/* Confidence Badge */}
            <span className="px-3 py-1 rounded-full text-xs font-editorial-mono font-bold bg-[#0A4C2B]/10 text-[#0A4C2B] border border-[#0A4C2B]/30 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#0A4C2B]" />
              <span>{confidencePercent}% CONFIDENCE</span>
            </span>
          </div>
        </div>

        {/* User Question Echo */}
        <div className="mb-6">
          <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-widest text-[#0A4C2B]/60 block mb-1">
            QUESTION:
          </span>
          <h3 className="font-editorial-serif font-bold text-xl sm:text-2xl text-[#0A4C2B]">
            "{query}"
          </h3>
        </div>

        {/* Answer Text Block */}
        <div className="p-6 rounded-2xl bg-[#0A4C2B] text-[#F7F1DF] border-2 border-[#FFD400] shadow-[4px_4px_0px_#FFD400] mb-6 relative">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-[#FFD400]/20 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD400]" />
              <span className="text-xs font-editorial-mono font-bold text-[#FFD400] uppercase tracking-wider">
                FACTUAL ANSWER:
              </span>
            </div>

            {/* Interactive Voice Response Playback Button */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <div className="flex items-center gap-1 h-4 mr-1">
                  <div className="w-1 h-3 bg-[#FF007A] rounded-full animate-bounce" />
                  <div className="w-1 h-4 bg-[#FFD400] rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              )}

              <button
                type="button"
                onClick={handleSpeak}
                className={`px-3 py-1.5 rounded-full text-xs font-editorial-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                  isSpeaking
                    ? 'bg-[#FF007A] text-white border-white animate-pulse shadow-[2px_2px_0px_#FFFFFF]'
                    : 'bg-[#FFD400] text-[#0A4C2B] border-[#0A4C2B] hover:bg-white shadow-[2px_2px_0px_#0A4C2B]'
                }`}
                aria-label={isSpeaking ? 'Stop voice readout' : 'Listen to answer'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>STOP VOICE</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#FF007A]" />
                    <span>LISTEN VOICE 🔊</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="font-editorial-mono text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {answer}
          </p>

          {/* Guardrail Warning Callout if triggered */}
          {guardrailTriggered && (
            <div className="mt-4 p-3 rounded-xl bg-[#FF007A]/20 border border-[#FF007A]/40 text-xs font-editorial-mono text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFD400] flex-shrink-0" />
              <span>Guardrail Enforced: {guardrailTriggered}</span>
            </div>
          )}
        </div>

        {/* Expandable Sources Accordion Button */}
        {sources && sources.length > 0 && (
          <div>
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="btn-editorial-yellow w-full py-3 px-6 rounded-full flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0A4C2B]" />
                <span>VIEW KNOWLEDGE SOURCES ({sources.length})</span>
              </div>
              {sourcesOpen ? (
                <ChevronUp className="w-4 h-4 text-[#0A4C2B]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#0A4C2B]" />
              )}
            </button>

            {/* Sources Drawer Panel */}
            {sourcesOpen && (
              <div className="mt-4 space-y-3 pt-2">
                {sources.map((src) => (
                  <div
                    key={src.source_index}
                    className="p-4 rounded-xl bg-[#0A4C2B]/10 border border-[#0A4C2B]/30 text-left font-editorial-mono"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FF007A] text-white text-[10px] font-bold flex items-center justify-center">
                          {src.source_index}
                        </span>
                        <span className="font-bold text-xs text-[#0A4C2B]">
                          {src.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A4C2B] text-[#FFD400]">
                          {src.strategy}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD400] text-[#0A4C2B] font-bold">
                          Score: {src.relevance_score}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#0A4C2B]/80 leading-relaxed italic bg-white/50 p-2.5 rounded-lg border border-[#0A4C2B]/10">
                      "{src.snippet}"
                    </p>
                    <span className="text-[9px] text-[#0A4C2B]/60 mt-1.5 block uppercase tracking-wider">
                      Chunk ID: {src.chunk_id} • Document ID: {src.document_id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

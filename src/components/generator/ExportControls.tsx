'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExportOptions, ExportResolution } from '@/types';
import { Download, Share2, Copy, Check, QrCode, RefreshCw, Layers } from 'lucide-react';

interface ExportControlsProps {
  exportOptions: ExportOptions;
  onChangeOptions: (options: ExportOptions) => void;
  onGenerateAndDownload: () => Promise<string | null>;
  isGenerating: boolean;
  generatedShareUrl?: string | null;
  onShowQrModal: () => void;
}

export function ExportControls({
  exportOptions,
  onChangeOptions,
  onGenerateAndDownload,
  isGenerating,
  generatedShareUrl,
  onShowQrModal,
}: ExportControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    await onGenerateAndDownload();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('graphicGenerated'));
    }
    // Fire celebratory confetti with HH Goa green, yellow, pink colors!
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0E6B3A', '#FFD400', '#FF007A', '#F7F1DF'],
    });
  };

  const handleCopyLink = async () => {
    let url = generatedShareUrl;
    if (!url) {
      url = await onGenerateAndDownload();
    }
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareToX = async () => {
    let url = generatedShareUrl;
    // If share URL doesn't match current graphicType, generate a fresh unique record
    if (!url || !url.includes(`/${exportOptions.graphicType}/`)) {
      url = await onGenerateAndDownload();
    }

    const targetUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://hhgoa2026.vercel.app');
    const text = `Ready for Hacker House Goa 2026 🚀\n\nJust created my official ${
      exportOptions.graphicType === 'card' ? 'Builder Pass' : 'Profile Frame'
    }!\n\nCheck out my credential #FrameInGoa:`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(targetUrl)}`;

    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 bg-[#F7F1DF] text-[#0A4C2B] p-6 rounded-3xl border-2 border-[#1E5A3B] shadow-[6px_6px_0px_#0A4C2B] font-editorial-mono">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#0A4C2B]">
          <Layers className="w-4 h-4 text-[#FF007A]" /> Output &amp; Export Resolution
        </h4>
      </div>

      {/* Resolution Selector Buttons */}
      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
        {(['1080x1080', '2048x2048'] as ExportResolution[]).map((res) => (
          <button
            key={res}
            type="button"
            onClick={() => onChangeOptions({ ...exportOptions, resolution: res })}
            className={`py-2.5 px-3 rounded-xl border-2 transition-all cursor-pointer min-h-[44px] flex items-center justify-center font-editorial-display uppercase tracking-wider ${
              exportOptions.resolution === res
                ? 'bg-[#FFD400] text-[#0A4C2B] border-[#0A4C2B] shadow-[3px_3px_0px_#0A4C2B]'
                : 'bg-[#F7F1DF] text-[#0A4C2B] border-[#1E5A3B] hover:border-[#FF007A]'
            }`}
          >
            {res === '1080x1080' ? '1080p Standard' : '2048p Ultra HD (4K)'}
          </button>
        ))}
      </div>

      {/* Transparent BG Option for Frame */}
      {exportOptions.graphicType === 'frame' && (
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0A4C2B] pt-1">
          <input
            type="checkbox"
            checked={exportOptions.transparentBg}
            onChange={(e) =>
              onChangeOptions({ ...exportOptions, transparentBg: e.target.checked })
            }
            className="rounded text-[#FF007A] focus:ring-[#FF007A] accent-[#FF007A] w-4 h-4 cursor-pointer"
          />
          Transparent background overlay (PNG)
        </label>
      )}

      {/* Primary Hot Pink Download Button */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 btn-editorial-pink rounded-full text-base min-h-[50px] cursor-pointer"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin text-white" /> Rendering...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 text-white" /> Download Official Graphic PNG
          </>
        )}
      </button>

      {/* Secondary CTAs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleShareToX}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 btn-editorial-cream rounded-full text-xs min-h-[44px] cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#FF007A]" /> Share to X
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 py-3 px-4 btn-editorial-cream rounded-full text-xs min-h-[44px] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#0E6B3A]" /> Copied Link!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#0A4C2B]" /> Copy Link
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onShowQrModal}
          className="p-3 rounded-full bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          title="Show Shareable QR Code"
        >
          <QrCode className="w-4 h-4 text-[#0A4C2B]" />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExportOptions, ExportResolution } from '@/types';
import { Download, Share2, Copy, Check, QrCode, RefreshCw, Layers, Sparkles } from 'lucide-react';

interface ExportControlsProps {
  exportOptions: ExportOptions;
  onChangeOptions: (options: ExportOptions) => void;
  onGenerateAndDownload: () => Promise<void>;
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
    // Fire celebratory confetti on download!
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#FFB800', '#06B6D4', '#FFFFFF'],
    });
  };

  const handleCopyLink = () => {
    if (generatedShareUrl) {
      navigator.clipboard.writeText(generatedShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareToX = () => {
    const text = `Ready for HH Goa 2026 🚀\n\nJust created my official ${
      exportOptions.graphicType === 'card' ? 'Builder Pass' : 'Profile Frame'
    }.\n\n#FrameInGoa`;

    const url = generatedShareUrl || 'https://hhgoa2026.vercel.app';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;

    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 bg-slate-50/80 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-orange-500" /> Export &amp; Resolution Settings
        </h4>
      </div>

      {/* Resolution Selector */}
      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
        {(['1080x1080', '2048x2048'] as ExportResolution[]).map((res) => (
          <button
            key={res}
            type="button"
            onClick={() => onChangeOptions({ ...exportOptions, resolution: res })}
            className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              exportOptions.resolution === res
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                : 'bg-white dark:bg-[#06080d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-orange-500/40'
            }`}
          >
            {res === '1080x1080' ? '1080p Standard' : '2048p Ultra HD (4K)'}
          </button>
        ))}
      </div>

      {/* Transparent BG option for Frame format */}
      {exportOptions.graphicType === 'frame' && (
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
          <input
            type="checkbox"
            checked={exportOptions.transparentBg}
            onChange={(e) =>
              onChangeOptions({ ...exportOptions, transparentBg: e.target.checked })
            }
            className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500 w-4 h-4 cursor-pointer"
          />
          Transparent background overlay (PNG)
        </label>
      )}

      {/* Download Action Button */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed border border-orange-400/20 min-h-[48px] cursor-pointer"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin text-white" /> Rendering Sharp 4K PNG...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Download Official PNG Graphics
          </>
        )}
      </button>

      {/* Sharing & QR Options */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleShareToX}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white border border-slate-800 dark:border-white/10 transition-all min-h-[44px] cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-orange-400" /> Share to X
        </button>

        {generatedShareUrl && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-extrabold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/15 transition-all min-h-[44px] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" /> Copied Link!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onShowQrModal}
          className="p-3 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/15 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          title="Show Shareable QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

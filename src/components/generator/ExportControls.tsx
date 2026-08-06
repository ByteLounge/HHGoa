'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExportOptions, ExportResolution } from '@/types';
import { Download, Share2, Copy, Check, QrCode, RefreshCw, Layers } from 'lucide-react';

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
    // Fire confetti on successful generation!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#FFB800', '#38BDF8', '#8B5CF6'],
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
    <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-orange-500" /> Output &amp; Download Settings
        </h4>
      </div>

      {/* Resolution Selector */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        {(['1080x1080', '2048x2048'] as ExportResolution[]).map((res) => (
          <button
            key={res}
            type="button"
            onClick={() => onChangeOptions({ ...exportOptions, resolution: res })}
            className={`py-2 rounded-xl border transition-all ${
              exportOptions.resolution === res
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-500/40'
            }`}
          >
            {res === '1080x1080' ? '1080p Standard' : '2048p Ultra HD (4K)'}
          </button>
        ))}
      </div>

      {/* Transparent BG option for Frame format */}
      {exportOptions.graphicType === 'frame' && (
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={exportOptions.transparentBg}
            onChange={(e) =>
              onChangeOptions({ ...exportOptions, transparentBg: e.target.checked })
            }
            className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500 w-4 h-4"
          />
          Transparent background overlay
        </label>
      )}

      {/* Download Action Button */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> Rendering High-Res PNG...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Download High-Res PNG
          </>
        )}
      </button>

      {/* Sharing & QR Options */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleShareToX}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white border border-slate-800 dark:border-slate-700 transition-all"
        >
          <Share2 className="w-4 h-4 text-orange-400" /> Share to X
        </button>

        {generatedShareUrl && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" /> Copied!
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
          className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          title="Show QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

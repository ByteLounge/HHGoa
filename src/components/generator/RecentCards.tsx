'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { GeneratedGraphicRecord } from '@/types';
import { History, Download, ExternalLink, Trash2, Sparkles } from 'lucide-react';

export function RecentCards() {
  const [recentList, setRecentList] = useState<GeneratedGraphicRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hhgoa_recent_graphics');
      if (saved) {
        setRecentList(JSON.parse(saved));
      }
    } catch {
      console.warn('Failed to load recent cards from localStorage');
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('hhgoa_recent_graphics');
    setRecentList([]);
  };

  if (recentList.length === 0) return null;

  return (
    <div className="w-full space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-orange-500" /> Your Recent Generated Passes
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentList.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-white/10 p-2.5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 mb-2 relative">
              <img
                src={item.imageDataUrl}
                alt="Generated graphic"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={item.imageDataUrl}
                  download={`HHGoa2026_${item.type}_${item.id.slice(0, 6)}.png`}
                  className="p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 shadow-md min-w-[38px] min-h-[38px] flex items-center justify-center"
                  title="Download PNG"
                >
                  <Download className="w-4 h-4" />
                </a>
                {item.shareUrl && (
                  <a
                    href={item.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 shadow-md min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="View Share Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="px-1 text-left">
              <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                {item.builderInfo.name || 'HH Goa Pass'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                {item.type === 'card' ? 'Builder Pass' : 'Profile Frame'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

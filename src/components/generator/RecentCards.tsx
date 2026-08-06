'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { GeneratedGraphicRecord } from '@/types';
import { History, Download, ExternalLink, Trash2 } from 'lucide-react';

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
    <div className="w-full space-y-4 pt-12 border-t-2 border-[#1E5A3B] font-editorial-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-editorial-serif font-bold text-[#F7F1DF] flex items-center gap-2">
          <History className="w-5 h-5 text-[#FFD400]" /> Recent Passes Generated
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs text-[#F7F1DF]/70 hover:text-[#FF007A] transition-colors flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentList.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#0A4C2B] p-3 overflow-hidden shadow-[4px_4px_0px_#0A4C2B] hover:shadow-[6px_6px_0px_#0A4C2B] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-[#0E6B3A] mb-2.5 relative border border-[#0A4C2B]">
              <img
                src={item.imageDataUrl}
                alt="Generated graphic"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#0A4C2B]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={item.imageDataUrl}
                  download={`HHGoa2026_${item.type}_${item.id.slice(0, 6)}.png`}
                  className="p-2.5 rounded-full bg-[#FF007A] text-white hover:bg-[#E0006C] shadow-[2px_2px_0px_#0A4C2B] min-w-[38px] min-h-[38px] flex items-center justify-center"
                  title="Download PNG"
                >
                  <Download className="w-4 h-4" />
                </a>
                {item.shareUrl && (
                  <a
                    href={item.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-[#FFD400] text-[#0A4C2B] hover:bg-white shadow-[2px_2px_0px_#0A4C2B] min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="View Share Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="px-1 text-left font-editorial-mono">
              <p className="font-bold text-xs text-[#0A4C2B] truncate uppercase">
                {item.builderInfo.name || 'HH Goa Pass'}
              </p>
              <p className="text-[10px] text-[#0E6B3A] font-bold capitalize">
                {item.type === 'card' ? 'Builder Pass' : 'Profile Frame'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

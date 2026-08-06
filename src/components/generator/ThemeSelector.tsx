'use client';

import React from 'react';
import { ThemeId } from '@/types';
import { FRAME_THEMES } from '@/lib/constants';
import { Check, Palette } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: ThemeId;
  onThemeSelect: (themeId: ThemeId) => void;
}

export function ThemeSelector({ selectedThemeId, onThemeSelect }: ThemeSelectorProps) {
  const themes = Object.values(FRAME_THEMES);

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <Palette className="w-3.5 h-3.5 text-[#00FF66]" /> Pass Theme &amp; Color Accent
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeSelect(theme.id)}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-[#00FF66] bg-[#00FF66]/10 dark:bg-[#00FF66]/15 shadow-md shadow-[#00FF66]/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-[#00FF66]/40 hover:bg-[#00FF66]/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ background: theme.primaryColor }}
                />
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#00FF66] text-black flex items-center justify-center font-bold">
                    <Check className="w-3 h-3 text-black stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="w-full">
                <p className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                  {theme.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="space-y-2.5 font-editorial-mono">
      <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider flex items-center gap-1.5">
        <Palette className="w-3.5 h-3.5 text-[#FFD400]" /> Pass Style &amp; Editorial Theme
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeSelect(theme.id)}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-[#FF007A] bg-[#F7F1DF] text-[#0A4C2B] shadow-[4px_4px_0px_#0A4C2B] scale-[1.02]'
                  : 'border-[#1E5A3B] bg-[#F7F1DF]/90 text-[#0A4C2B] hover:border-[#FFD400] hover:bg-[#F7F1DF]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-[#0A4C2B] shadow-sm"
                  style={{ background: theme.primaryColor }}
                />
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#FF007A] text-white flex items-center justify-center font-bold">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="w-full">
                <p className="font-bold text-xs leading-tight font-editorial-mono">
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

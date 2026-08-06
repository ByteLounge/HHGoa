'use client';

import React from 'react';
import { ThemeId } from '@/types';
import { FRAME_THEMES } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: ThemeId;
  onThemeSelect: (themeId: ThemeId) => void;
}

export function ThemeSelector({ selectedThemeId, onThemeSelect }: ThemeSelectorProps) {
  const themes = Object.values(FRAME_THEMES);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Official Pass Style &amp; Theme
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeSelect(theme.id)}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/20 shadow-md shadow-orange-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-orange-500/40'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ background: theme.primaryColor }}
                />
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="w-full">
                <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
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

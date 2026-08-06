'use client';

import React from 'react';
import { BuilderInfo } from '@/types';
import { Sparkles, Dices } from 'lucide-react';
import { SUGGESTED_TITLES } from '@/lib/constants';

interface FormControlsProps {
  builderInfo: BuilderInfo;
  onChange: (info: BuilderInfo) => void;
  onGenerateAiTitle: () => void;
}

export function FormControls({ builderInfo, onChange, onGenerateAiTitle }: FormControlsProps) {
  const handleChange = (field: keyof BuilderInfo, value: string) => {
    onChange({ ...builderInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Full Name <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Alex Rivera"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
      </div>

      {/* Role / Tech Stack */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Role / Primary Stack <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g. Full Stack Engineer (Next.js / Rust)"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
      </div>

      {/* AI Builder Title Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            AI Builder Title <span className="text-orange-500">*</span>
          </label>
          <button
            type="button"
            onClick={onGenerateAiTitle}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" /> Shuffle AI Title
          </button>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={builderInfo.builderTitle}
            onChange={(e) => handleChange('builderTitle', e.target.value)}
            placeholder="e.g. The AI Architect"
            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          <Sparkles className="w-4 h-4 text-orange-500 absolute right-3 pointer-events-none" />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SUGGESTED_TITLES.slice(0, 5).map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => handleChange('builderTitle', title)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                builderInfo.builderTitle === title
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-orange-500/50'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid for Company / College & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Company / College
          </label>
          <input
            type="text"
            value={builderInfo.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g. NextGen AI Lab"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={builderInfo.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Goa, India"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

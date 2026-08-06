'use client';

import React from 'react';
import { BuilderInfo } from '@/types';
import { Sparkles, Dices, User, Code, Building, MapPin } from 'lucide-react';
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
      {/* Full Name */}
      <div>
        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-orange-500" /> Full Name <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Alex Rivera"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      {/* Role / Tech Stack */}
      <div>
        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-orange-500" /> Role / Primary Tech Stack <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g. Full Stack Engineer (Next.js / Rust)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      {/* AI Builder Title Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> AI Builder Title <span className="text-orange-500">*</span>
          </label>
          <button
            type="button"
            onClick={onGenerateAiTitle}
            className="flex items-center gap-1.5 text-xs font-black text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
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
            className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-900 dark:text-white text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
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
              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                builderInfo.builderTitle === title
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-orange-500/50 hover:text-orange-500'
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
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" /> Company / Studio
          </label>
          <input
            type="text"
            value={builderInfo.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g. 2:47 PM Studio"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
          </label>
          <input
            type="text"
            value={builderInfo.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Goa, India"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

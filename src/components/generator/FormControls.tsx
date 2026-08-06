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
    <div className="space-y-5 font-editorial-mono">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#FFD400]" /> Full Name <span className="text-[#FF007A]">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Alex Rivera"
          className="w-full px-4 py-3 rounded-xl border-2 border-[#1E5A3B] bg-[#F7F1DF] text-[#0A4C2B] text-sm font-bold focus:outline-none focus:border-[#FF007A] focus:ring-2 focus:ring-[#FF007A]/30 transition-all placeholder:text-[#0A4C2B]/50 shadow-[3px_3px_0px_#0A4C2B]"
        />
      </div>

      {/* Role / Tech Stack */}
      <div>
        <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-[#FFD400]" /> Primary Tech Stack / Role <span className="text-[#FF007A]">*</span>
        </label>
        <input
          type="text"
          value={builderInfo.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g. Full Stack Engineer (Next.js / Rust)"
          className="w-full px-4 py-3 rounded-xl border-2 border-[#1E5A3B] bg-[#F7F1DF] text-[#0A4C2B] text-sm font-bold focus:outline-none focus:border-[#FF007A] focus:ring-2 focus:ring-[#FF007A]/30 transition-all placeholder:text-[#0A4C2B]/50 shadow-[3px_3px_0px_#0A4C2B]"
        />
      </div>

      {/* AI Builder Title Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" /> AI Builder Title <span className="text-[#FF007A]">*</span>
          </label>
          <button
            type="button"
            onClick={onGenerateAiTitle}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FFD400] hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Dices className="w-3.5 h-3.5 text-[#FFD400]" /> Shuffle Title
          </button>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={builderInfo.builderTitle}
            onChange={(e) => handleChange('builderTitle', e.target.value)}
            placeholder="e.g. The AI Architect"
            className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-[#1E5A3B] bg-[#F7F1DF] text-[#0A4C2B] text-sm font-bold focus:outline-none focus:border-[#FF007A] focus:ring-2 focus:ring-[#FF007A]/30 transition-all placeholder:text-[#0A4C2B]/50 shadow-[3px_3px_0px_#0A4C2B]"
          />
          <Sparkles className="w-4 h-4 text-[#FF007A] absolute right-3 pointer-events-none" />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SUGGESTED_TITLES.slice(0, 5).map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => handleChange('builderTitle', title)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg border-2 transition-all cursor-pointer ${
                builderInfo.builderTitle === title
                  ? 'bg-[#FF007A] text-white border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B]'
                  : 'bg-[#F7F1DF] text-[#0A4C2B] border-[#1E5A3B] hover:border-[#FF007A] hover:bg-white'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid for Company / Org & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#FFD400]" /> Studio / Organization
          </label>
          <input
            type="text"
            value={builderInfo.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g. 2:47 PM Studio"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#1E5A3B] bg-[#F7F1DF] text-[#0A4C2B] text-sm font-bold focus:outline-none focus:border-[#FF007A] focus:ring-2 focus:ring-[#FF007A]/30 transition-all placeholder:text-[#0A4C2B]/50 shadow-[3px_3px_0px_#0A4C2B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#F7F1DF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FFD400]" /> Location
          </label>
          <input
            type="text"
            value={builderInfo.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Goa, India"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#1E5A3B] bg-[#F7F1DF] text-[#0A4C2B] text-sm font-bold focus:outline-none focus:border-[#FF007A] focus:ring-2 focus:ring-[#FF007A]/30 transition-all placeholder:text-[#0A4C2B]/50 shadow-[3px_3px_0px_#0A4C2B]"
          />
        </div>
      </div>
    </div>
  );
}

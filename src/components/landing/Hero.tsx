'use client';

import React from 'react';
import { Sparkles, ArrowDown, Zap, Award, Terminal } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b-2 border-[#1E5A3B] bg-[#0E6B3A]">
      {/* Decorative Dots Backdrop */}
      <div className="absolute inset-0 bg-editorial-dots opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD400]/20 border-2 border-[#FFD400] text-[#FFD400] text-xs font-editorial-mono font-bold uppercase tracking-widest mb-10 shadow-[3px_3px_0px_#0A4C2B]">
          <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-ping" />
          GOA, INDIA &nbsp;·&nbsp; 28 – 31 OCT 2026 &nbsp;·&nbsp; 2:47 PM STUDIO
        </div>

        {/* Oversized Editorial Serif Heading */}
        <h1 className="font-editorial-serif font-bold tracking-tight text-[#F7F1DF] text-6xl sm:text-8xl lg:text-9xl uppercase leading-[0.9] max-w-5xl mx-auto text-center">
          <span className="block text-[#FFD400]">FRAME</span>
          <span className="block text-[#F7F1DF]">YOUR</span>
          <span className="block text-[#FF007A]">IDENTITY</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-8 text-lg sm:text-2xl text-[#F7F1DF]/90 max-w-3xl mx-auto font-editorial-mono font-normal leading-relaxed">
          Official Builder Pass &amp; Profile Overlay Studio for Hacker House Goa 2026. Editorial print typography, server-composited 4K PNG downloads.
        </p>

        {/* Hero Quick Specs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#0A4C2B] font-editorial-mono text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2 bg-[#F7F1DF] px-4 py-2.5 rounded-full border-2 border-[#0A4C2B] shadow-[3px_3px_0px_#0A4C2B]">
            <Zap className="w-4 h-4 text-[#FF007A]" /> 4K Sharp Server PNG
          </div>
          <div className="flex items-center gap-2 bg-[#F7F1DF] px-4 py-2.5 rounded-full border-2 border-[#0A4C2B] shadow-[3px_3px_0px_#0A4C2B]">
            <Award className="w-4 h-4 text-[#0E6B3A]" /> AI Title Shuffler
          </div>
          <div className="flex items-center gap-2 bg-[#F7F1DF] px-4 py-2.5 rounded-full border-2 border-[#0A4C2B] shadow-[3px_3px_0px_#0A4C2B]">
            <Terminal className="w-4 h-4 text-[#FF007A]" /> #FrameInGoa Badge
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#generator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 btn-editorial-pink px-9 py-4 text-base sm:text-lg rounded-full min-h-[54px] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" /> Launch Generator Studio <ArrowDown className="w-4 h-4 animate-bounce text-white" />
          </a>

          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-editorial-cream px-8 py-4 text-base sm:text-lg rounded-full min-h-[54px] cursor-pointer"
          >
            Read Specifications
          </a>
        </div>
      </div>
    </section>
  );
}

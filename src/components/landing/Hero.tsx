'use client';

import React from 'react';
import { Sparkles, ArrowDown, Zap, Award, Terminal } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/80 dark:border-white/10">
      {/* Ambient Lighting Gradients (HH Goa Sunset Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] sm:text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          GOA, INDIA &nbsp;·&nbsp; 28 – 31 OCT 2026 &nbsp;·&nbsp; 2:47 PM STUDIO
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.08]">
          Less Noise. More Signal.{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 mt-2">
            Frame Your HH Goa Pass.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          The official identity studio for India&apos;s premier builder residency. Generate crisp, server-rendered profile frames and attendee passes in seconds.
        </p>

        {/* Hero Quick Stats / Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
            <Zap className="w-4 h-4 text-orange-500" /> Instant Sharp 4K Render
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
            <Award className="w-4 h-4 text-amber-500" /> AI Title Shuffler
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
            <Terminal className="w-4 h-4 text-cyan-400" /> #FrameInGoa Ready
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#generator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-8 py-4 text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.03] active:scale-95 border border-orange-400/20 min-h-[52px]"
          >
            <Sparkles className="w-5 h-5" /> Launch Generator Studio <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>

          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold px-6 py-4 text-base rounded-2xl border border-slate-200 dark:border-white/10 transition-all min-h-[52px]"
          >
            Explore Specs
          </a>
        </div>
      </div>
    </section>
  );
}

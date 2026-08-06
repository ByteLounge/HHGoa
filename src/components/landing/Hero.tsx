'use client';

import React from 'react';
import { Sparkles, ShieldCheck, ArrowDown, Award, Zap, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ShieldCheck className="w-4 h-4" /> OFFICIAL EVENT STUDIO • FEBRUARY 2026 • GOA, INDIA
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Frame Your Photo &amp; Generate Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
            Official HH Goa Pass
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Create high-resolution branded profile picture overlays and conference builder passes in seconds. Server-rendered, pixel-perfect PNG downloads.
        </p>

        {/* Hero Quick Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <Zap className="w-4 h-4 text-orange-500" /> Instant Sharp 4K Render
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <Award className="w-4 h-4 text-amber-500" /> AI Builder Title Engine
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <Users className="w-4 h-4 text-emerald-500" /> Dynamic Open Graph Sharing
          </div>
        </div>

        {/* CTA Arrow Button */}
        <div className="mt-10">
          <a
            href="#generator"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-8 py-4 text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" /> Launch Generator Studio <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

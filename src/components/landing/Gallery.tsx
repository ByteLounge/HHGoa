'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

export function Gallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            SAMPLE OUTPUT PREVIEW
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Official Pass &amp; Frame Gallery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            See how your identity cards will look on social media and conference check-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Example */}
          <div className="rounded-3xl bg-[#0e131f] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left space-y-4">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-white tracking-wide">HH GOA 2026</span>
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] uppercase tracking-widest font-black shadow-sm">
                BUILDER PASS
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-2xl text-white shadow-xl">
                AR
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                  The AI Architect
                </span>
                <h3 className="text-xl font-black text-white mt-1">Alex Rivera</h3>
                <p className="text-xs font-bold text-orange-400">Full Stack Engineer</p>
                <p className="text-xs text-slate-400">2:47 PM Studio • Goa, India</p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>28 – 31 OCT 2026 • #FrameInGoa</span>
              <QrCode className="w-6 h-6 text-slate-300" />
            </div>
          </div>

          {/* Frame Example */}
          <div className="rounded-3xl bg-[#090c15] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-40 h-40 rounded-full border-4 border-orange-500 p-1 relative flex items-center justify-center bg-slate-950 shadow-[0_0_25px_rgba(255,85,0,0.35)]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-3xl">
                SK
              </div>
              <div className="absolute -top-3 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] tracking-widest shadow-md">
                HH GOA 2026
              </div>
            </div>

            <div className="w-full bg-[#0e131f] border border-orange-500/30 rounded-2xl p-4">
              <p className="font-black text-base text-white">Siddharth K.</p>
              <p className="text-xs font-bold text-orange-400 mt-0.5">Prompt Engineer • #FrameInGoa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

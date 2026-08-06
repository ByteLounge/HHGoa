'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

export function Gallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#0E6B3A] border-b-2 border-[#1E5A3B] relative font-editorial-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#FFD400] uppercase tracking-widest px-3 py-1 rounded-full bg-[#FFD400]/20 border border-[#FFD400]/40 shadow-[2px_2px_0px_#0A4C2B]">
            SAMPLE GALLERY
          </span>
          <h2 className="font-editorial-serif font-bold text-4xl sm:text-6xl text-[#F7F1DF] tracking-tight mt-4 uppercase">
            Pass &amp; Frame Gallery
          </h2>
          <p className="text-sm sm:text-base text-[#F7F1DF]/90 mt-2 font-normal">
            See how your identity credentials will look printed and on social media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Example */}
          <div className="editorial-card p-6 sm:p-8 relative overflow-hidden text-left space-y-4">
            <div className="flex items-center justify-between text-xs font-bold border-b-2 border-[#0A4C2B] pb-3">
              <span className="font-editorial-serif text-xl text-[#0A4C2B]">HH GOA 2026</span>
              <span className="px-3 py-1 rounded-full bg-[#FF007A] text-white text-[10px] uppercase font-display tracking-widest shadow-[2px_2px_0px_#0A4C2B]">
                BUILDER PASS
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-20 rounded-2xl bg-[#0E6B3A] border-2 border-[#0A4C2B] flex items-center justify-center font-editorial-serif font-bold text-2xl text-[#FFD400] shadow-[3px_3px_0px_#0A4C2B]">
                AR
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFD400] text-[#0A4C2B] border border-[#0A4C2B] uppercase">
                  The AI Architect
                </span>
                <h3 className="font-editorial-serif font-bold text-2xl text-[#0A4C2B] mt-1 uppercase">Alex Rivera</h3>
                <p className="text-xs font-bold text-[#FF007A]">Full Stack Engineer</p>
                <p className="text-xs text-[#0E6B3A]">2:47 PM Studio • Goa, India</p>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-[#0A4C2B] pt-4 flex items-center justify-between text-xs text-[#0A4C2B] font-bold">
              <span>28 – 31 OCT 2026 • #FrameInGoa</span>
              <QrCode className="w-6 h-6 text-[#0A4C2B]" />
            </div>
          </div>

          {/* Frame Example */}
          <div className="editorial-card p-6 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-40 h-40 rounded-full border-4 border-[#0A4C2B] p-1 relative flex items-center justify-center bg-[#0E6B3A] shadow-[4px_4px_0px_#0A4C2B]">
              <div className="w-full h-full rounded-full bg-[#FFD400] text-[#0A4C2B] flex items-center justify-center font-editorial-serif font-bold text-3xl">
                SK
              </div>
              <div className="absolute -top-3 px-3.5 py-1 rounded-full bg-[#FF007A] text-white font-display font-bold text-xs tracking-widest shadow-[2px_2px_0px_#0A4C2B]">
                HH GOA 2026
              </div>
            </div>

            <div className="w-full bg-[#F7F1DF] border-2 border-[#0A4C2B] rounded-2xl p-4 shadow-[3px_3px_0px_#0A4C2B]">
              <p className="font-editorial-serif font-bold text-xl text-[#0A4C2B] uppercase">Siddharth K.</p>
              <p className="text-xs font-bold text-[#FF007A] mt-0.5">Prompt Engineer • #FrameInGoa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { QrCode } from 'lucide-react';

export function Gallery() {
  return (
    <section id="gallery" className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
            Sample Output Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Example HH Goa 2026 Graphics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Example */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden text-left space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white">HH GOA 2026</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px]">
                BUILDER PASS
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-2xl text-white shadow-lg">
                AR
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  The AI Architect
                </span>
                <h3 className="text-lg font-black text-white mt-1">Alex Rivera</h3>
                <p className="text-xs font-semibold text-orange-400">Full Stack Engineer</p>
                <p className="text-[11px] text-slate-400">NextGen AI Lab • Goa, India</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>FEBRUARY 2026 • #FrameInGoa</span>
              <QrCode className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          {/* Frame Example */}
          <div className="rounded-3xl bg-[#0A0F1D] border border-slate-800 p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-36 h-36 rounded-full border-4 border-orange-500 p-1 relative flex items-center justify-center bg-slate-900 shadow-[0_0_20px_rgba(255,85,0,0.3)]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-3xl">
                SK
              </div>
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px]">
                HH GOA 2026
              </div>
            </div>

            <div className="w-full bg-slate-900/90 border border-orange-500/30 rounded-xl p-3">
              <p className="font-black text-sm text-white">Siddharth K.</p>
              <p className="text-xs font-semibold text-orange-400">Prompt Engineer • #FrameInGoa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

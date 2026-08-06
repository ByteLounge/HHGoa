'use client';

import React from 'react';
import { Cpu, Image, Sparkles, Share2, Smartphone, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Image,
    title: 'Dual Identity Formats',
    description: 'Switch seamlessly between official circular avatar overlays and Apple Pass style attendee passes.',
  },
  {
    icon: Cpu,
    title: 'Sharp 4K Server Rendering',
    description: 'Zero blurry client export. High-res 1080p or 2048p PNG compositing powered by server-side Sharp.',
  },
  {
    icon: Sparkles,
    title: 'AI Builder Title Engine',
    description: 'Shuffle deterministic builder titles tailored to your stack like "The AI Architect" or "Shipping Machine".',
  },
  {
    icon: Smartphone,
    title: 'Mobile & iPhone HEIC Support',
    description: 'Drag & drop, clipboard paste, and on-the-fly conversion of native iPhone HEIC/HEIF camera photos.',
  },
  {
    icon: Share2,
    title: 'Dynamic Open Graph Previews',
    description: 'Share your pass URL on X or LinkedIn with dynamic social cards rendering your exact generated graphic.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Friction & Zero Login',
    description: 'No account creation, passwords, or waitlists. Upload, customize, and export your pass in under 5 seconds.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-[#090c15] border-b border-slate-200/80 dark:border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            ENGINEERED FOR BUILDERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Built for Elite Speed &amp; Quality
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Everything required to generate, preview, export, and showcase your official HH Goa 2026 conference identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-white/10 shadow-sm hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

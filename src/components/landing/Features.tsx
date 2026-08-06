'use client';

import React from 'react';
import { Cpu, Image, Sparkles, Share2, Smartphone, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Image,
    title: 'Dual Graphic Formats',
    description: 'Switch seamlessly between circular avatar overlays and Apple Pass style printed event credentials.',
  },
  {
    icon: Cpu,
    title: 'Sharp 4K Server Compositing',
    description: 'Zero blurry client export. High-res 1080p or 2048p PNG rendering powered by server-side Sharp.',
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
    <section id="features" className="py-20 sm:py-28 bg-[#0E6B3A] border-b-2 border-[#1E5A3B] relative font-editorial-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#FFD400] uppercase tracking-widest px-3 py-1 rounded-full bg-[#FFD400]/20 border border-[#FFD400]/40 shadow-[2px_2px_0px_#0A4C2B]">
            DESIGNED FOR BUILDERS
          </span>
          <h2 className="font-editorial-serif font-bold text-4xl sm:text-6xl text-[#F7F1DF] tracking-tight mt-4 uppercase">
            Built for Speed &amp; Precision
          </h2>
          <p className="mt-4 text-[#F7F1DF]/90 text-base sm:text-lg font-normal">
            Everything required to generate, preview, export, and showcase your official HH Goa 2026 conference identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="editorial-card p-6 sm:p-8 hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A4C2B] group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7 text-[#FF007A]" />
                </div>
                <h3 className="font-editorial-serif font-bold text-2xl text-[#0A4C2B] mb-2 uppercase leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#0E6B3A] leading-relaxed font-normal">
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

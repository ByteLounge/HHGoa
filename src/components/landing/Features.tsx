import React from 'react';
import { Cpu, Image, Sparkles, Share2, Smartphone, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Image,
    title: 'Dual Graphic Formats',
    description: 'Switch instantly between official circular profile picture overlays and Apple Pass style builder cards.',
  },
  {
    icon: Cpu,
    title: 'Sharp 4K Server Rendering',
    description: 'Zero blurry canvas exports. Output crisp 1080p or 2048p PNG graphics composited on the server.',
  },
  {
    icon: Sparkles,
    title: 'AI Builder Title Engine',
    description: 'Generate fun, deterministic builder titles like "The AI Architect", "Shipping Machine", or "Prompt Engineer".',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First & HEIC Support',
    description: 'Seamless drag & drop, clipboard paste, and automatic conversion of iPhone HEIC/HEIF photos.',
  },
  {
    icon: Share2,
    title: 'Dynamic Open Graph Metadata',
    description: 'Share your card on X or LinkedIn with rich link preview metadata showing your exact generated graphic.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Login Required',
    description: 'No signup, no passwords, no friction. Generate and download your pass in under 5 seconds.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Attendees &amp; Builders
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Everything you need to create, preview, download, and showcase your official HH Goa 2026 conference identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-orange-500/40 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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

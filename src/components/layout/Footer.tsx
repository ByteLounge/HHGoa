import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050811] text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-xs">
            HH
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">HH GOA 2026</p>
            <p className="text-xs text-slate-500">Official Builder Pass &amp; Frame Generator</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <a href="#generator" className="hover:text-orange-500 transition-colors">
            Generator
          </a>
          <a href="#features" className="hover:text-orange-500 transition-colors">
            Features
          </a>
          <a href="#gallery" className="hover:text-orange-500 transition-colors">
            Gallery
          </a>
          <a href="#faq" className="hover:text-orange-500 transition-colors">
            FAQ
          </a>
        </div>

        <div className="text-xs text-slate-500 text-center md:text-right">
          <p>© 2026 HH Goa Conference. All rights reserved.</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Built with Next.js 15, Sharp &amp; TailwindCSS</p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import { Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#06080d] text-slate-600 dark:text-slate-400 py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/20">
              <div className="w-full h-full bg-[#06080d] rounded-[10px] flex items-center justify-center font-black text-white text-xs">
                HH
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-slate-900 dark:text-white">HH GOA 2026</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-500">2:47 PM Studio • Profile Frame &amp; Builder Pass Studio</p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-extrabold text-slate-700 dark:text-slate-300">
            <a href="#generator" className="hover:text-orange-500 transition-colors">
              Pass Studio
            </a>
            <a href="#features" className="hover:text-orange-500 transition-colors">
              Features
            </a>
            <a href="#gallery" className="hover:text-orange-500 transition-colors">
              Examples
            </a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">
              FAQ
            </a>
            <a
              href="https://hhgoa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              HHGoa.com ↗
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <a
              href="https://x.com/247pmstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
              title="X / Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current text-orange-500" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @247pmstudio
            </a>
            <a
              href="https://t.me/twofourtysevenpm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
              title="Telegram"
            >
              <Send className="w-4 h-4 text-cyan-400" /> Telegram
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 HH-Goa. All rights reserved. Organized by 2:47PM Studio.</p>
          <p className="text-[11px] text-slate-500">GOA, INDIA &nbsp;·&nbsp; 28 – 31 OCT 2026</p>
        </div>
      </div>
    </footer>
  );
}

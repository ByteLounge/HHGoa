'use client';

import React from 'react';
import { Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t-2 border-[#1E5A3B] bg-[#0E6B3A] text-[#F7F1DF] py-12 sm:py-16 font-editorial-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center font-display font-bold text-base shadow-[2px_2px_0px_#0A4C2B]">
              HH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial-serif font-bold text-xl text-[#FFD400]">HACKER HOUSE GOA 2026</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/40">
                  Official
                </span>
              </div>
              <p className="text-xs text-[#F7F1DF]/80">2:47 PM Studio • Profile Frame &amp; Builder Pass Studio</p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-[#F7F1DF]">
            <a href="#generator" className="hover:text-[#FFD400] transition-colors">
              Studio
            </a>
            <a href="#features" className="hover:text-[#FFD400] transition-colors">
              Specs
            </a>
            <a href="#faq" className="hover:text-[#FFD400] transition-colors">
              FAQ
            </a>
            <a
              href="https://hhgoa-rag-voice.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF007A] transition-colors text-[#FFD400]"
            >
              Task 02: Voice RAG ↗
            </a>
            <a
              href="https://hhgoa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD400] transition-colors text-[#FFD400]"
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
              className="p-2.5 rounded-xl bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5"
              title="X / Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#FF007A]" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @247pmstudio
            </a>
            <a
              href="https://t.me/twofourtysevenpm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5"
              title="Telegram"
            >
              <Send className="w-4 h-4 text-[#FF007A]" /> Telegram
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E5A3B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F1DF]/70 gap-4">
          <p>© 2026 Hacker House Goa. All rights reserved. Organized by 2:47PM Studio.</p>
          <p className="text-[11px] text-[#FFD400] font-bold">GOA, INDIA &nbsp;·&nbsp; 28 – 31 OCT 2026</p>
        </div>
      </div>
    </footer>
  );
}

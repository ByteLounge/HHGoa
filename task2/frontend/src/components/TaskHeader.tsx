'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, IdCard, ExternalLink, Menu, X, ShieldCheck, Zap } from 'lucide-react';

export function TaskHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E6B3A]/90 backdrop-blur-md border-b-2 border-[#1E5A3B] shadow-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Event Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center font-display font-bold text-lg tracking-tighter shadow-[3px_3px_0px_#0A4C2B] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              HH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial-serif font-bold text-xl sm:text-2xl tracking-tight text-[#FFD400]">
                  HACKER HOUSE GOA <span className="text-[#F7F1DF] font-mono text-base font-normal">2026</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#F7F1DF]/70 -mt-0.5">
                AI / RAG Studio • Low Latency Voice System
              </p>
            </div>
          </Link>

          {/* Task Switcher Desktop Tabs */}
          <nav className="hidden lg:flex items-center gap-2 ml-6 p-1.5 rounded-full bg-[#0A4C2B] border-2 border-[#1E5A3B]">
            <a
              href="https://hhgoa-frame-id-generator.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-editorial-mono font-bold text-[#F7F1DF]/80 hover:text-[#FFD400] hover:bg-[#0E6B3A] transition-all flex items-center gap-1.5"
            >
              <IdCard className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>TASK 01: IDENTITY FRAME ↗</span>
            </a>
            <div className="px-4 py-1.5 rounded-full text-xs font-editorial-mono font-bold text-[#0A4C2B] bg-[#FFD400] border border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#FF007A]" />
              <span>TASK 02: VOICE RAG</span>
            </div>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-[#FF007A] animate-pulse" />
            <span>&lt;200ms LATENCY TARGET</span>
          </div>
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-editorial-cream px-4 py-2 text-xs rounded-full flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_#0A4C2B]"
          >
            Official Site <ExternalLink className="w-3.5 h-3.5 text-[#FF007A]" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF007A]" /> : <Menu className="w-5 h-5 text-[#0A4C2B]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 bg-[#0E6B3A]/98 backdrop-blur-xl border-b-2 border-[#1E5A3B] px-6 py-6 shadow-2xl z-50">
          <nav className="flex flex-col space-y-4 font-editorial-mono">
            <a
              href="https://hhgoa-frame-id-generator.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#F7F1DF] hover:text-[#FFD400] py-2 border-b border-[#1E5A3B] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#FFD400]" />
                <span>TASK 01: Frame & Pass Studio</span>
              </div>
              <span className="text-[10px] bg-[#FFD400] text-[#0A4C2B] px-2 py-0.5 rounded-full font-bold">SWITCH ↗</span>
            </a>
            <div className="text-sm font-bold text-[#FFD400] py-2 border-b border-[#1E5A3B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#FF007A]" />
                <span>TASK 02: Voice-Enabled RAG</span>
              </div>
              <span className="text-[10px] bg-[#FF007A] text-white px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

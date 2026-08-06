'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Sparkles, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Pass Studio', href: '#generator' },
    { label: 'Features', href: '#features' },
    { label: 'Examples', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#030406]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#00FF66]/20 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF66] via-[#FFE600] to-[#FF007A] p-0.5 shadow-lg shadow-[#00FF66]/25 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#030406] dark:bg-[#030406] rounded-[10px] flex items-center justify-center font-black text-[#00FF66] text-sm tracking-tighter">
              HH
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                HH GOA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] via-[#FFE600] to-[#FF007A]">2026</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                <ShieldCheck className="w-3 h-3 text-[#00FF66]" /> OFFICIAL
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-[#FFE600]/80 -mt-0.5">
              2:47 PM Studio • Builder Pass
            </p>
          </div>
        </Link>

        {/* Center Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#00FF66] dark:hover:text-[#00FF66] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#00FF66] after:to-[#FFE600] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Desktop Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFE600]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          {/* Primary CTA Button */}
          <a
            href="#generator"
            className="flex items-center gap-2 bg-gradient-to-r from-[#00FF66] via-[#FFE600] to-[#FF007A] hover:opacity-95 text-black font-black px-5 py-2.5 text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00FF66]/20 transition-all hover:scale-[1.02] active:scale-95 border border-[#00FF66]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" /> Create Pass
          </a>
        </div>

        {/* Mobile Right Controls: Theme + Hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFE600]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF007A]" /> : <Menu className="w-5 h-5 text-[#00FF66]" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-[#030406]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-[#00FF66]/20 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200 z-50">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-black text-slate-900 dark:text-white hover:text-[#00FF66] dark:hover:text-[#00FF66] py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#00FF66]" />
              </a>
            ))}

            <a
              href="#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF66] via-[#FFE600] to-[#FF007A] text-black font-black py-3.5 px-4 rounded-xl shadow-lg shadow-[#00FF66]/25 text-sm min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-black" /> Create Pass Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

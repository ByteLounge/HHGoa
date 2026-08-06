'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Menu, X, ArrowRight, ExternalLink } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Studio', href: '#generator' },
    { label: 'Specs', href: '#features' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E6B3A]/90 backdrop-blur-md border-b-2 border-[#1E5A3B] shadow-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Yellow Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#FFD400] text-[#0A4C2B] border-2 border-[#0A4C2B] flex items-center justify-center font-display font-bold text-lg tracking-tighter shadow-[3px_3px_0px_#0A4C2B] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
            HH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial-serif font-bold text-xl sm:text-2xl tracking-tight text-[#FFD400]">
                HACKER HOUSE GOA <span className="text-[#F7F1DF] font-mono text-base font-normal">2026</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/40">
                <ShieldCheck className="w-3 h-3 text-[#FFD400]" /> OFFICIAL
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#F7F1DF]/70 -mt-0.5">
              2:47 PM Studio • Identity Engine
            </p>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-editorial-mono font-bold text-[#F7F1DF]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#FFD400] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFD400] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Desktop Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-editorial-cream px-4 py-2.5 text-xs sm:text-sm rounded-full flex items-center gap-1.5 cursor-pointer font-bold shadow-[2px_2px_0px_#0A4C2B] hover:translate-x-0.5 transition-all"
          >
            Official Site <ExternalLink className="w-3.5 h-3.5 text-[#FF007A]" />
          </a>
          <a
            href="#generator"
            className="btn-editorial-yellow px-5 py-2.5 text-xs sm:text-sm rounded-full flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0A4C2B]" /> Create Pass
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#F7F1DF] text-[#0A4C2B] border-2 border-[#0A4C2B] shadow-[2px_2px_0px_#0A4C2B] min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF007A]" /> : <Menu className="w-5 h-5 text-[#0A4C2B]" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 bg-[#0E6B3A]/98 backdrop-blur-xl border-b-2 border-[#1E5A3B] px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200 z-50">
          <nav className="flex flex-col space-y-4 font-editorial-mono">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-[#F7F1DF] hover:text-[#FFD400] py-2 border-b border-[#1E5A3B] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#FFD400]" />
              </a>
            ))}

            <a
              href="#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 w-full flex items-center justify-center gap-2 btn-editorial-pink py-3.5 px-4 rounded-full text-sm min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-white" /> Create Pass Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

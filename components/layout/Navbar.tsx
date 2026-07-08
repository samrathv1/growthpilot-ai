'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { href: '#features',    label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#use-cases',   label: 'Use Cases' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Main bar */}
        <div className="glass-card rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/growthpilot-logo.png"
                alt="GrowthPilot AI Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden xs:block">
              <span className="font-black text-white text-sm leading-tight block tracking-tight">
                GrowthPilot <span className="text-[#38F29B]">AI</span>
              </span>
              <span className="text-[9px] text-[#94A3B8] font-medium tracking-widest uppercase leading-none">
                Business Toolkit
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-[#38F29B] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-2 glass-card rounded-2xl border border-white/10 p-4 flex flex-col gap-2 md:hidden animate-slide-up">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-[#38F29B] font-medium py-2.5 px-4 rounded-xl hover:bg-white/5 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-5 py-3 rounded-xl text-center mt-1 flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

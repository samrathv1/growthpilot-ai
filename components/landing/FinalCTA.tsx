import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#38F29B]/6 via-[#071827] to-[#22D3EE]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#38F29B]/6 blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo image */}
        <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 animate-float shadow-lg shadow-[#38F29B]/20 border border-[#38F29B]/20">
          <Image
            src="/images/growthpilot-logo.png"
            alt="GrowthPilot AI"
            width={80}
            height={80}
            className="w-full h-full object-contain bg-[#071827]"
          />
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
          Ready to Grow Your{' '}
          <br className="hidden sm:block" />
          Business with <span className="gradient-text">AI?</span>
        </h2>

        <p className="text-slate-400 text-base sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
          Start using AI to save time, generate leads, and grow your business faster.
          Your AI growth toolkit is ready — no setup, no credit card needed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/dashboard"
            id="final-cta-dashboard"
            className="btn-primary w-full sm:w-auto px-9 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/tools/growth-agent"
            className="btn-outline-green w-full sm:w-auto px-9 py-4 rounded-xl text-base font-bold"
          >
            Try Growth Agent →
          </Link>
        </div>

        {/* Honest feature chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
          {[
            '✓ No credit card required',
            '✓ 5 AI tools included',
            '✓ Works for any business',
            '✓ Results in seconds',
          ].map((feat) => (
            <span key={feat} className="text-slate-400 text-xs font-medium">
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/8 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 GrowthPilot AI. Built by{' '}
          <span className="text-[#38F29B] font-semibold">Jay Gadhave</span>.
        </p>
        <p className="text-slate-600 text-xs mt-1">
          An AI business toolkit for freelancers, agencies, local businesses, and founders.
        </p>
      </footer>
    </section>
  );
}

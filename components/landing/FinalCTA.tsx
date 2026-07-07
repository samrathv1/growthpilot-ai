import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-violet-500/30 animate-float">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Ready to Grow Your
          <br />
          Business with <span className="gradient-text">AI?</span>
        </h2>

        <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Join thousands of business owners who are using GrowthPilot AI to save time,
          generate more leads, and scale faster. Your AI growth team is waiting.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            id="final-cta-dashboard"
            className="btn-gradient text-white font-bold px-10 py-5 rounded-2xl text-lg flex items-center gap-3 shadow-lg shadow-violet-500/20"
          >
            Open Dashboard
            <ArrowRight className="w-6 h-6" />
          </Link>
          <Link
            href="/tools/growth-agent"
            className="px-10 py-5 rounded-2xl text-lg font-bold text-slate-300 glass-card border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200"
          >
            Try Growth Agent Free →
          </Link>
        </div>

        {/* Features list */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          {['✓ No credit card required', '✓ 5 AI tools included', '✓ Works for any business', '✓ Results in seconds'].map(
            (feat) => (
              <span key={feat} className="text-slate-400">
                {feat}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

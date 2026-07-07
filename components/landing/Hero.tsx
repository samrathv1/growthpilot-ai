import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl animate-pulse-glow"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-violet-500/30 text-sm text-violet-300 font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          AI-Powered Business Growth Toolkit
          <span className="bg-violet-500/30 text-violet-200 text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-slide-up">
          Turn Any Business Into
          <br />
          <span className="gradient-text">a Growth Machine</span>
          <br />
          With AI
        </h1>

        {/* Subheadline */}
        <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          GrowthPilot AI generates business audits, landing page copy, content strategies, sales follow-ups, and weekly growth actions — in seconds. For any business. At any stage.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Link
            href="/tools/business-audit"
            id="cta-start-audit"
            className="btn-gradient text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2 shadow-lg shadow-violet-500/20"
          >
            🚀 Start Free Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            id="cta-explore-tools"
            className="px-8 py-4 rounded-2xl text-base font-bold text-slate-300 glass-card border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            Explore AI Tools →
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">5</span>
            <span>AI-powered tools</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">8+</span>
            <span>business types supported</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">∞</span>
            <span>growth possibilities</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 pb-16">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#38F29B]/8 blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/6 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06111F]/80" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,242,155,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(56,242,155,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text Content ── */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38F29B]/30 bg-[#38F29B]/8 text-[#38F29B] text-xs font-bold mb-6 animate-fade-in tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Business Growth Toolkit
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-5 animate-slide-up">
              Grow Your Business{' '}
              <span className="gradient-text block sm:inline">Faster with AI</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up"
              style={{ animationDelay: '150ms' }}
            >
              AI-powered toolkit to generate website copy, content strategies,
              lead follow-ups, business audits, and growth actions — for any business,
              in seconds.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                href="/tools/business-audit"
                id="cta-start-audit"
                className="btn-primary w-full sm:w-auto text-center px-7 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                🚀 Start Free Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                id="cta-explore-tools"
                className="btn-outline-green w-full sm:w-auto text-center px-7 py-3.5 rounded-xl text-sm font-bold"
              >
                Explore AI Tools →
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="mt-10 flex items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm animate-fade-in"
              style={{ animationDelay: '500ms' }}
            >
              {[
                { value: '5', label: 'AI Tools' },
                { value: '8+', label: 'Business Types' },
                { value: '∞', label: 'Growth Actions' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <div className="w-px h-6 bg-white/10 mr-2" />}
                  <span className="text-xl font-black text-[#38F29B]">{stat.value}</span>
                  <span className="text-slate-500 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Banner Image ── */}
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-[#38F29B]/10 blur-3xl rounded-3xl scale-90" />
              <div className="relative rounded-2xl overflow-hidden border border-[#38F29B]/20 shadow-2xl shadow-[#38F29B]/10">
                <Image
                  src="/images/growthpilot-banner.png"
                  alt="GrowthPilot AI — Empowering Business Growth with AI"
                  width={800}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                  quality={90}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-bottom-3 sm:-right-3 glass-card-green rounded-xl px-4 py-2 flex items-center gap-2 border border-[#38F29B]/25 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-[#38F29B] animate-pulse" />
                <span className="text-xs font-bold text-[#38F29B]">AI Engine Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

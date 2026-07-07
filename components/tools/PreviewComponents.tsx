'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  User, 
  Layers, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Monitor,
  Check,
  Star
} from 'lucide-react';

export interface LandingPageData {
  page_title: string;
  recommended_layout: string;
  layout_reason: string;
  target_goal: string;
  hero: {
    headline: string;
    subheadline: string;
    primary_cta: string;
    secondary_cta: string;
  };
  problem_section: {
    heading: string;
    description: string;
    pain_points: string[];
  };
  solution_section: {
    heading: string;
    description: string;
  };
  benefits: Array<{ title: string; description: string }>;
  features: Array<{ title: string; description: string }>;
  social_proof: {
    heading: string;
    testimonial_examples: Array<{ quote: string; name: string; role: string }>;
  };
  process_steps: Array<{ step: string; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  final_cta: {
    heading: string;
    subheading: string;
    button_text: string;
  };
  seo?: {
    meta_title: string;
    meta_description: string;
    keywords?: string[];
  };
  expert_review_summary?: {
    what_to_improve: string[];
    conversion_score: number;
    best_next_action: string;
  };
}

interface PreviewProps {
  data: LandingPageData;
  layout: 'lead_gen' | 'saas' | 'service';
  onCtaClick?: () => void;
}

// ─── HERO PREVIEW ────────────────────────────────────────────────────────────
export function HeroPreview({ data, layout, onCtaClick }: PreviewProps) {
  if (layout === 'saas') {
    return (
      <section className="py-20 px-6 border-b border-white/5 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">
              ✨ Software Launch
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {data.hero.headline}
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              {data.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={onCtaClick} className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-lg">
                {data.hero.primary_cta} <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 transition-all">
                {data.hero.secondary_cta || 'Watch Demo'}
              </button>
            </div>
          </div>
          <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center p-4 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 blur-xl opacity-30" />
            <div className="w-full h-full rounded-lg bg-slate-950 border border-white/10 p-2 flex flex-col gap-2 relative z-10">
              <div className="flex gap-1.5 pb-1 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-center gap-3">
                <Monitor className="w-10 h-10 text-slate-700 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500">Interactive SaaS Platform Mockup</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'service') {
    return (
      <section className="py-24 px-6 text-center max-w-4xl mx-auto border-b border-white/5">
        <div className="space-y-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-widest">
            🤝 Private Consultation
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {data.hero.headline}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            {data.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button onClick={onCtaClick} className="btn-gradient w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-sm cursor-pointer shadow-lg">
              {data.hero.primary_cta}
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all">
              {data.hero.secondary_cta || 'Read Strategy'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Lead Gen Layout (Default)
  return (
    <section className="py-20 px-6 text-center border-b border-white/5 bg-gradient-to-b from-violet-950/20 to-transparent">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 uppercase tracking-widest">
          🚀 Special Limited Offer
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          {data.hero.headline}
        </h1>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          {data.hero.subheadline}
        </p>
        <div className="pt-2 flex justify-center">
          <button onClick={onCtaClick} className="btn-gradient px-8 py-3 rounded-xl text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform flex items-center gap-2">
            {data.hero.primary_cta} <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM SECTION ─────────────────────────────────────────────────────────
export function ProblemPreview({ data, layout }: PreviewProps) {
  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {data.problem_section.heading}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
            {data.problem_section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.problem_section.pain_points.map((point, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl border-l-4 border-l-red-500 border border-white/5 space-y-2">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider">Obstacle 0{index + 1}</div>
              <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOLUTION SECTION ────────────────────────────────────────────────────────
export function SolutionPreview({ data, layout }: PreviewProps) {
  if (layout === 'service') {
    return (
      <section className="py-20 px-6 border-b border-white/5 bg-emerald-950/5">
        <div className="max-w-3xl mx-auto text-left space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Our Shared Philosophy</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {data.solution_section.heading}
          </h2>
          <div className="text-slate-300 text-base leading-relaxed space-y-4 font-light">
            <p className="italic">
              "{data.solution_section.description}"
            </p>
            <p className="text-sm text-slate-400">
              We focus on standard parameters to tailor a direct transformation. We handle all elements so you can execute the strategy.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 border-b border-white/5 bg-violet-950/5 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-violet-400 font-bold text-xs uppercase tracking-widest">The Core Solution</div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white">
          {data.solution_section.heading}
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          {data.solution_section.description}
        </p>
      </div>
    </section>
  );
}

// ─── BENEFITS SECTION ────────────────────────────────────────────────────────
export function BenefitsPreview({ data, layout }: PreviewProps) {
  const isSaaS = layout === 'saas';
  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <div className="text-cyan-400 font-bold text-xs uppercase tracking-widest">Core Benefits</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Why Choose Our Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.benefits.map((benefit, i) => (
            <div 
              key={i} 
              className={`glass-card p-6 rounded-2xl border transition-all duration-300 hover:border-violet-500/30 ${
                isSaaS ? 'border-indigo-500/10 bg-indigo-500/2' : 'border-white/10'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-violet-400" />
              </div>
              <h4 className="font-bold text-white text-base mb-2">{benefit.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES SECTION ────────────────────────────────────────────────────────
export function FeaturesPreview({ data, layout }: PreviewProps) {
  if (layout === 'saas') {
    return (
      <section className="py-16 px-6 border-b border-white/5 bg-indigo-950/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Power Packed Features</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Full-Featured System Built for Scaling</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feature, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl glass-card border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm mb-1">{feature.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">System Specifications</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Key Features Included</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.features.map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <Layers className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <h4 className="font-bold text-white text-sm mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS PREVIEW ─────────────────────────────────────────────────────────
export function ProcessPreview({ data, layout }: PreviewProps) {
  return (
    <section className="py-16 px-6 border-b border-white/5 bg-white/2">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">Get Started in 3 Simple Steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {data.process_steps.map((step, i) => (
            <div key={i} className="relative group text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-sm font-black text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                {step.step || `0${i + 1}`}
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF PREVIEW ────────────────────────────────────────────────────
export function SocialProofPreview({ data, layout }: PreviewProps) {
  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {data.social_proof.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.social_proof.testimonial_examples.map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed mb-4">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0 text-violet-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ PREVIEW ─────────────────────────────────────────────────────────────
export function FAQPreview({ data, layout }: PreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {data.faq.map((faqItem, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className="rounded-xl border border-white/10 bg-white/2 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleOpen(i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 text-sm cursor-pointer hover:bg-white/5 transition-all"
                >
                  <span>{faqItem.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                    {faqItem.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA PREVIEW ───────────────────────────────────────────────────────
export function FinalCTAPreview({ data, layout, onCtaClick }: PreviewProps) {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-transparent to-indigo-950/20">
      <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-white/10 p-8 md:p-12 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            {data.final_cta.heading}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {data.final_cta.subheading}
          </p>
          <div className="pt-3">
            <button onClick={onCtaClick} className="btn-gradient w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer shadow-lg hover:scale-105 transition-transform">
              {data.final_cta.button_text}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

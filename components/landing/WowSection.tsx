import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

const capabilities = [
  'Best next action for THIS week',
  'Website improvement checklist',
  'Platform-specific content plan',
  'Zero-budget lead generation ideas',
  'Automation ideas that run 24/7',
  'Ready-to-send message templates',
  'Day-by-day 7-day execution plan',
];

export default function WowSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#38F29B]/8 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#22D3EE]/6 blur-3xl animate-float" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38F29B]/30 bg-[#38F29B]/8 text-[#38F29B] text-xs font-bold mb-6 uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              Featured Tool — AI Growth Agent
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Your Personal AI{' '}
              <span className="gradient-text">Chief Growth Officer</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-7">
              Just tell it your situation in plain language. Get a complete, personalized growth playbook you can execute this week. No jargon. No theory. Pure action.
            </p>

            {/* Capabilities list */}
            <ul className="space-y-2.5 mb-8">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#38F29B] flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{cap}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/tools/growth-agent"
              id="cta-growth-agent"
              className="btn-primary px-7 py-3.5 rounded-xl text-sm inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Launch Growth Agent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Demo card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#38F29B]/15 to-[#22D3EE]/10 blur-3xl rounded-3xl" />

            <div className="relative glass-card rounded-3xl border border-[#38F29B]/25 p-6 sm:p-8 animate-border-glow">
              {/* Fake input */}
              <div className="mb-5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Your Situation</p>
                <div className="bg-white/4 rounded-xl border border-white/8 p-4">
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    "My business is a local gym. We have 50 members but I want 200. My budget is
                    ₹5,000/month. I've tried posting on Instagram but it's not working. What should I
                    do this week?"
                  </p>
                </div>
              </div>

              {/* Fake output */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-semibold text-[#38F29B] uppercase tracking-widest">AI Growth Plan</p>
                {[
                  { emoji: '🚀', title: 'Best Next Action', preview: 'Partner with 3 nearby offices for a corporate fitness trial...' },
                  { emoji: '📱', title: 'Content Plan', preview: '7 posts: Mon transformation, Wed tip, Fri offer...' },
                  { emoji: '⚡', title: 'Automation Idea', preview: 'WhatsApp auto-reply captures leads from story swipe-ups 24/7...' },
                  { emoji: '📅', title: '7-Day Plan', preview: 'Day 1: Set up referral program. Day 2: Shoot 3 Reels...' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                    <span className="text-base mt-0.5">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.preview}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#38F29B] animate-pulse" />
                <span className="text-xs text-[#38F29B] font-medium">7 sections generated • Ready to execute</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

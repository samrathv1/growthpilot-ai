import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

const capabilities = [
  'Best next action for THIS week',
  'Website improvement checklist',
  'Platform-specific content plan',
  'Zero-budget lead generation ideas',
  'Automation that runs 24/7',
  'Ready-to-send message templates',
  'Day-by-day 7-day execution plan',
];

export default function WowSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-3xl animate-float" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              Featured Tool — AI Growth Agent
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your Personal AI{' '}
              <span className="gradient-text">Chief Growth Officer</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Just tell it your situation — in plain English. It comes back with a complete,
              personalized growth playbook that any business owner can execute immediately.
              No jargon. No theory. Pure action.
            </p>

            {/* Capabilities */}
            <ul className="space-y-3 mb-10">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{cap}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/tools/growth-agent"
              id="cta-growth-agent"
              className="btn-gradient text-white font-bold px-8 py-4 rounded-2xl text-base inline-flex items-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Zap className="w-5 h-5" />
              Launch Growth Agent
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: Demo card */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-500/20 blur-3xl rounded-3xl" />

            <div className="relative glass-card rounded-3xl border border-violet-500/30 p-8">
              {/* Fake input */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Your Message</p>
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    "My business is a local gym. We have 50 members but I want 200. My budget is
                    ₹5,000/month. I've tried posting on Instagram but it's not working. What should I
                    do this week?"
                  </p>
                </div>
              </div>

              {/* Fake output preview */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">AI Growth Plan</p>
                {[
                  { emoji: '🚀', title: 'Best Next Action', preview: 'Partner with 3 nearby offices for a corporate fitness trial...' },
                  { emoji: '📱', title: 'Content Plan', preview: '7 posts scheduled: Mon transformation, Wed tip, Fri offer...' },
                  { emoji: '⚡', title: 'Automation Setup', preview: 'WhatsApp bot captures leads from story swipe-ups 24/7...' },
                  { emoji: '📅', title: '7-Day Plan', preview: 'Day 1: Set up referral program. Day 2: Shoot 3 Reels...' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.preview}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">7 sections generated • Ready to use</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

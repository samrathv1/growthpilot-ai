import Link from 'next/link';
import { ClipboardList, FileText, PenTool, MessageSquare, Zap, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    name: 'AI Business Audit',
    description:
      'Get a full analysis of your business — problems, opportunities, and a clear 7-day action plan tailored to your goals.',
    href: '/tools/business-audit',
    gradient: 'from-[#38F29B] to-[#22D3EE]',
    tag: 'Start Here',
  },
  {
    icon: FileText,
    name: 'Landing Page Generator',
    description:
      'Generate high-converting landing page copy with headlines, benefits, FAQs, and CTAs for any offer or service.',
    href: '/tools/landing-page-generator',
    gradient: 'from-[#22D3EE] to-[#0ea5e9]',
    tag: null,
  },
  {
    icon: PenTool,
    name: 'AI Content Generator',
    description:
      'Create Instagram captions, LinkedIn posts, Reel scripts, ad copies, and a full content calendar for your business.',
    href: '/tools/content-generator',
    gradient: 'from-[#0ea5e9] to-[#38F29B]',
    tag: null,
  },
  {
    icon: MessageSquare,
    name: 'Lead Follow-up Generator',
    description:
      'Get personalized WhatsApp messages, email sequences, call scripts, and closing messages for every lead.',
    href: '/tools/lead-follow-up',
    gradient: 'from-[#38F29B] to-emerald-500',
    tag: null,
  },
  {
    icon: Zap,
    name: 'AI Growth Agent',
    description:
      'Your personal AI Chief Growth Officer. Describe your situation — get a complete, actionable growth strategy instantly.',
    href: '/tools/growth-agent',
    gradient: 'from-amber-400 to-[#38F29B]',
    tag: 'Most Powerful',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#38F29B] mb-4 px-3 py-1 rounded-full border border-[#38F29B]/30 bg-[#38F29B]/8">
            AI Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            5 Tools Built for{' '}
            <span className="gradient-text">Real Business Growth</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Each tool is purpose-built for real business owners. Specific, actionable output for your exact situation — not generic AI fluff.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.name}
              className={`glass-card rounded-2xl border border-white/8 p-6 group card-hover flex flex-col ${
                i === features.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Icon + tag */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                {feature.tag && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#38F29B]/15 text-[#38F29B] border border-[#38F29B]/25">
                    {feature.tag}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-lg mb-2.5 group-hover:text-[#38F29B] transition-colors">
                {feature.name}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                className="flex items-center gap-2 text-sm font-semibold text-[#38F29B]/70 group-hover:text-[#38F29B] transition-colors"
              >
                Try this tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

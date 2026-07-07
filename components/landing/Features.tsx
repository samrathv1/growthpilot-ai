import Link from 'next/link';
import { ClipboardList, FileText, PenTool, MessageSquare, Zap, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    name: 'AI Business Audit',
    description:
      'Get a comprehensive analysis of your business — problems, opportunities, content ideas, automation wins, and a 7-day action plan.',
    href: '/tools/business-audit',
    gradient: 'from-violet-600 to-indigo-600',
    tag: 'Most Popular',
  },
  {
    icon: FileText,
    name: 'AI Landing Page Generator',
    description:
      'Generate high-converting landing page copy with hero headlines, benefits, service sections, FAQs, and compelling CTAs.',
    href: '/tools/landing-page-generator',
    gradient: 'from-indigo-600 to-blue-600',
    tag: null,
  },
  {
    icon: PenTool,
    name: 'AI Content Generator',
    description:
      'Create Instagram captions, LinkedIn posts, Reel scripts, ad copies, and a full content calendar tailored to your business.',
    href: '/tools/content-generator',
    gradient: 'from-blue-600 to-cyan-600',
    tag: null,
  },
  {
    icon: MessageSquare,
    name: 'AI Lead Follow-up Generator',
    description:
      'Never lose a lead again. Get WhatsApp messages, email sequences, call scripts, and closing messages personalized to each prospect.',
    href: '/tools/lead-follow-up',
    gradient: 'from-cyan-600 to-teal-600',
    tag: null,
  },
  {
    icon: Zap,
    name: 'AI Growth Agent',
    description:
      'Your personal AI Chief Growth Officer. Just describe your situation and get a complete growth strategy, execution plan, and message templates.',
    href: '/tools/growth-agent',
    gradient: 'from-orange-500 to-violet-600',
    tag: 'Premium',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
            AI Toolkit
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            5 AI Tools That Work Like{' '}
            <span className="gradient-text">Your Business Jarvis</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Each tool is purpose-built for real business owners. No generic AI — specific, actionable output for your exact situation.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.name}
              className={`glass-card rounded-2xl border border-white/10 p-6 group hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col ${
                i === features.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Icon + tag */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.tag && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                    {feature.tag}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-xl mb-3 group-hover:text-violet-200 transition-colors">
                {feature.name}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors"
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

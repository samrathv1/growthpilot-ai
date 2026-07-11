import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ClipboardList, FileText, PenTool, MessageSquare, Zap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — LearnVolt AI',
  description: 'Access all 5 AI growth tools from your LearnVolt AI dashboard.',
};

const tools = [
  {
    icon: ClipboardList,
    name: 'AI Business Audit',
    description: 'Full analysis of your business — problems, opportunities, and a 7-day action plan.',
    href: '/tools/business-audit',
    color: 'from-[#38F29B] to-[#22D3EE]',
    glow: 'shadow-[#38F29B]/15',
    badge: 'Start Here',
  },
  {
    icon: FileText,
    name: 'Landing Page Generator',
    description: 'Generate complete, high-converting landing page copy for any offer or service.',
    href: '/tools/landing-page-generator',
    color: 'from-[#22D3EE] to-sky-500',
    glow: 'shadow-[#22D3EE]/15',
    badge: null,
  },
  {
    icon: PenTool,
    name: 'AI Content Generator',
    description: 'Posts, captions, Reels, ads, WhatsApp promos, and content calendars for any business.',
    href: '/tools/content-generator',
    color: 'from-sky-500 to-[#38F29B]',
    glow: 'shadow-sky-500/15',
    badge: null,
  },
  {
    icon: MessageSquare,
    name: 'Lead Follow-up Generator',
    description: 'WhatsApp, email, call scripts, reminders, and closing messages for your leads.',
    href: '/tools/lead-follow-up',
    color: 'from-emerald-500 to-[#38F29B]',
    glow: 'shadow-emerald-500/15',
    badge: null,
  },
  {
    icon: Zap,
    name: 'AI Growth Agent',
    description: 'Your next best business actions across website, content, leads, sales, and automation.',
    href: '/tools/growth-agent',
    color: 'from-amber-400 to-[#38F29B]',
    glow: 'shadow-amber-400/15',
    badge: 'PRO',
  },
];

const stats = [
  { value: '5', label: 'AI Tools' },
  { value: '∞', label: 'Generations' },
  { value: '0s', label: 'Setup Time' },
  { value: 'Free', label: 'To Use' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* ── Welcome Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Top identity bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-[#38F29B]/20">
            <Image
              src="/images/growthpilot-logo.png"
              alt="GrowthPilot AI"
              width={44}
              height={44}
              className="w-full h-full object-contain bg-[#071827]"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Welcome to</p>
            <h1 className="text-xl font-black text-white">
              LearnVolt <span className="text-[#38F29B]">AI</span>
            </h1>
          </div>
        </div>

        {/* Command center info bar */}
        <div className="glass-card rounded-2xl border border-white/8 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h2 className="text-base font-bold text-white mb-1">Your AI Business Command Center</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose any tool below to generate AI-powered content, strategies, and growth plans tailored to your business. Each tool takes under 2 minutes.
              </p>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex items-center gap-4 sm:gap-6 flex-shrink-0 w-full sm:w-auto border-t border-white/5 pt-4 sm:pt-0 sm:border-t-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center flex-1 sm:flex-none">
                  <p className="text-lg font-black gradient-text leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tool Cards ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
          Available AI Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className={`glass-card rounded-2xl border border-white/8 p-5 group card-hover flex flex-col h-full`}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg ${tool.glow} group-hover:scale-105 transition-transform`}
                >
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                {tool.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38F29B]/12 text-[#38F29B] border border-[#38F29B]/25">
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-sm mb-2 group-hover:text-[#38F29B] transition-colors leading-snug">
                {tool.name}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-4">
                {tool.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-[#38F29B] transition-colors">
                Use this tool
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

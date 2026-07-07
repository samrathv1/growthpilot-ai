import type { Metadata } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolCard from '@/components/dashboard/ToolCard';
import { ClipboardList, FileText, PenTool, MessageSquare, Zap, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — GrowthPilot AI',
  description: 'Access all 5 AI growth tools from your GrowthPilot AI dashboard.',
};

const tools = [
  {
    icon: ClipboardList,
    name: 'AI Business Audit',
    description: 'Get a full analysis of your business — problems, opportunities, and a 7-day action plan.',
    href: '/business-audit',
    gradient: 'from-violet-600 to-indigo-600',
    badge: 'Popular',
  },
  {
    icon: FileText,
    name: 'AI Landing Page Generator',
    description: 'Generate complete, high-converting landing page copy for any offer or service.',
    href: '/landing-page-generator',
    gradient: 'from-indigo-600 to-blue-600',
  },
  {
    icon: PenTool,
    name: 'AI Content Generator',
    description: 'Generate posts, captions, reels, ads, WhatsApp promos, and content calendars for any business.',
    href: '/content-generator',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    icon: MessageSquare,
    name: 'AI Lead Follow-up Generator',
    description: 'WhatsApp messages, emails, call scripts, and closing messages for every lead.',
    href: '/tools/lead-follow-up',
    gradient: 'from-cyan-600 to-teal-600',
  },
  {
    icon: Zap,
    name: 'AI Growth Agent',
    description: 'Your AI Chief Growth Officer. Describe your situation, get a complete growth strategy.',
    href: '/tools/growth-agent',
    gradient: 'from-orange-500 to-violet-600',
    badge: 'PRO',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Welcome back</p>
            <h1 className="text-2xl font-black text-white">GrowthPilot AI</h1>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">Your AI Business Command Center</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose any tool below to generate AI-powered content, strategies, and growth plans
                tailored specifically to your business. Each tool takes under 2 minutes.
              </p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-2xl font-black gradient-text">5</p>
                <p className="text-xs text-slate-500">AI Tools</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-black gradient-text">∞</p>
                <p className="text-xs text-slate-500">Generations</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-black gradient-text">0s</p>
                <p className="text-xs text-slate-500">Setup needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Available AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tools.map((tool, index) => (
            <ToolCard key={tool.name} {...tool} index={index} />
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div className="mt-8 glass-card rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-cyan-300 mb-0.5">Pro Tip</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Start with the <strong className="text-slate-300">AI Business Audit</strong> to get a complete
            picture of your business. Then use the specialized tools to execute the recommendations it gives
            you. This is the fastest path to results.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

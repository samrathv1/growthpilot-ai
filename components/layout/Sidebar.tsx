'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  PenTool,
  MessageSquare,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/business-audit', icon: ClipboardList, label: 'Business Audit' },
  { href: '/landing-page-generator', icon: FileText, label: 'Landing Page' },
  { href: '/content-generator', icon: PenTool, label: 'Content Generator' },
  { href: '/lead-followup-generator', icon: MessageSquare, label: 'Lead Follow-up' },
  { href: '/growth-agent', icon: Zap, label: 'Growth Agent', badge: 'PRO' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hasKeys, setHasKeys] = useState(true);

  useEffect(() => {
    fetch('/api/config-check')
      .then((res) => res.json())
      .then((data) => setHasKeys(!!data.hasKeys))
      .catch(() => setHasKeys(true));
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm leading-tight block">GrowthPilot</span>
            <span className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">AI Toolkit</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium px-3 py-2">AI Tools</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 text-violet-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      {!hasKeys && (
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border border-violet-500/20 p-3">
            <p className="text-xs font-semibold text-violet-300 mb-1">🔑 Add Real AI</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Set <code className="text-cyan-400">OPENAI_API_KEY</code> or <code className="text-cyan-400">GEMINI_API_KEY</code> in <code className="text-slate-300">.env.local</code>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

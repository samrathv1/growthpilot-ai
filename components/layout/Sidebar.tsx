'use client';

import Image from 'next/image';
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
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',                     icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tools/business-audit',          icon: ClipboardList,   label: 'Business Audit' },
  { href: '/tools/landing-page-generator',  icon: FileText,        label: 'Landing Page' },
  { href: '/tools/content-generator',       icon: PenTool,         label: 'Content Generator' },
  { href: '/tools/lead-follow-up',          icon: MessageSquare,   label: 'Lead Follow-up' },
  { href: '/tools/growth-agent',            icon: Zap,             label: 'Growth Agent', badge: 'PRO' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#040e1a] border-r border-white/8 z-40 flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 border border-[#38F29B]/20">
            <Image
              src="/images/growthpilot-logo.png"
              alt="GrowthPilot AI"
              width={40}
              height={40}
              className="w-full h-full object-contain bg-[#071827]"
            />
          </div>
          <div>
            <span className="font-black text-white text-sm leading-tight block tracking-tight">
              GrowthPilot <span className="text-[#38F29B]">AI</span>
            </span>
            <span className="text-[9px] text-slate-500 font-medium tracking-widest uppercase">
              Business Toolkit
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold px-3 py-2 mb-1">
          AI Tools
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'sidebar-active'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#38F29B]' : 'text-slate-600 group-hover:text-slate-300'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#38F29B]/15 text-[#38F29B] border border-[#38F29B]/25">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 text-[#38F29B]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom tip */}
      <div className="p-4 border-t border-white/8">
        <div className="rounded-xl bg-[#38F29B]/6 border border-[#38F29B]/15 p-3">
          <p className="text-xs font-semibold text-[#38F29B] mb-1">💡 Pro Tip</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Start with <strong className="text-slate-300">Business Audit</strong> to get a full picture, then use individual tools to execute.
          </p>
        </div>
      </div>
    </aside>
  );
}

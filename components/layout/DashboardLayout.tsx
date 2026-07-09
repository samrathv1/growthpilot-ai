'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen mesh-bg flex flex-col md:flex-row">
      {/* Mobile Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#040e1a]/95 backdrop-blur-md border-b border-white/8 z-30 flex items-center justify-between px-4 md:hidden">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={closeSidebar}>
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#38F29B]/20">
            <Image
              src="/images/growthpilot-logo.png"
              alt="GrowthPilot AI"
              width={32}
              height={32}
              className="w-full h-full object-contain bg-[#071827]"
            />
          </div>
          <div>
            <span className="font-black text-white text-xs leading-none block tracking-tight">
              GrowthPilot <span className="text-[#38F29B]">AI</span>
            </span>
            <span className="text-[8px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5 block">
              Business Toolkit
            </span>
          </div>
        </Link>

        {/* Menu Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

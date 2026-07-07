import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import WowSection from '@/components/landing/WowSection';
import FinalCTA from '@/components/landing/FinalCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main>
        <Hero />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        <Features />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        <HowItWorks />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        <WowSection />

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        <FinalCTA />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-slate-600">
        <p>
          © 2024 <span className="text-violet-400 font-medium">GrowthPilot AI</span> — Business AI Toolkit
          <span className="mx-3 text-white/10">|</span>
          Built for business owners who refuse to stay small.
        </p>
      </footer>
    </div>
  );
}

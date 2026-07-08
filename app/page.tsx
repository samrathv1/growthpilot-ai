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
    </div>
  );
}

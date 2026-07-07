import { Building2, Dumbbell, Scissors, Stethoscope, UtensilsCrossed, Briefcase, Code, MapPin } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: '📝',
    title: 'Enter Your Business Details',
    description:
      'Tell us about your business type, goals, target customers, and current situation. Takes less than 2 minutes.',
    color: 'from-violet-500 to-indigo-500',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI Analyzes Your Goal',
    description:
      'Our AI processes your inputs using specialized prompt engineering trained on real business growth strategies.',
    color: 'from-indigo-500 to-cyan-500',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Get Ready-to-Use Growth Actions',
    description:
      'Receive structured, actionable outputs — copy, strategies, scripts, and plans you can implement immediately.',
    color: 'from-cyan-500 to-teal-500',
  },
];

const useCases = [
  { icon: Dumbbell, label: 'Gym & Fitness', color: 'text-orange-400' },
  { icon: Scissors, label: 'Salon & Beauty', color: 'text-pink-400' },
  { icon: Stethoscope, label: 'Clinic & Healthcare', color: 'text-emerald-400' },
  { icon: UtensilsCrossed, label: 'Restaurant & Food', color: 'text-yellow-400' },
  { icon: Briefcase, label: 'Agency & Marketing', color: 'text-blue-400' },
  { icon: Building2, label: 'Coach & Consultant', color: 'text-violet-400' },
  { icon: Code, label: 'Freelancer', color: 'text-cyan-400' },
  { icon: MapPin, label: 'Local Business', color: 'text-red-400' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            From Zero to{' '}
            <span className="gradient-text">Growth Strategy</span>
            <br />
            in 3 Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+48px)] right-0 h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
              )}

              {/* Step number + icon */}
              <div className="relative mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl shadow-lg`}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 border border-violet-400 flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">{step.number}</span>
                </div>
              </div>

              <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div id="use-cases" className="text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
            Use Cases
          </span>
          <h2 className="text-4xl font-black text-white mb-4">
            Built for <span className="gradient-text">Every Business Type</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Whether you run a gym or a digital agency, GrowthPilot AI understands your industry and speaks your language.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="glass-card rounded-2xl border border-white/10 p-4 flex flex-col items-center gap-3 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`${useCase.color} group-hover:scale-110 transition-transform`}>
                  <useCase.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {useCase.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

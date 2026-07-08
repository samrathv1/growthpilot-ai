import { Building2, Dumbbell, Scissors, Stethoscope, UtensilsCrossed, Briefcase, Code, MapPin } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: '📝',
    title: 'Enter Your Business Details',
    description: 'Tell us your business type, goals, target customers, and current challenges. Takes less than 2 minutes.',
    color: 'from-[#38F29B] to-[#22D3EE]',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI Analyzes Your Goal',
    description: 'GrowthPilot AI processes your inputs using specialized prompts trained on real business growth strategies.',
    color: 'from-[#22D3EE] to-[#0ea5e9]',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Get Ready-to-Use Actions',
    description: 'Receive structured, actionable outputs — copy, strategies, scripts, and plans you can implement today.',
    color: 'from-[#0ea5e9] to-[#38F29B]',
  },
];

const useCases = [
  { icon: Dumbbell,       label: 'Gym & Fitness',        color: 'text-[#38F29B]' },
  { icon: Scissors,       label: 'Salon & Beauty',       color: 'text-[#22D3EE]' },
  { icon: Stethoscope,    label: 'Clinic & Healthcare',  color: 'text-emerald-400' },
  { icon: UtensilsCrossed,label: 'Restaurant & Food',    color: 'text-amber-400' },
  { icon: Briefcase,      label: 'Agency & Marketing',   color: 'text-[#22D3EE]' },
  { icon: Building2,      label: 'Coach & Consultant',   color: 'text-[#38F29B]' },
  { icon: Code,           label: 'Freelancer',           color: 'text-sky-400' },
  { icon: MapPin,         label: 'Local Business',       color: 'text-rose-400' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#38F29B]/6 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-[#22D3EE]/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#22D3EE] mb-4 px-3 py-1 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/8">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            From Zero to{' '}
            <span className="gradient-text">Growth Strategy</span>
            <br className="hidden sm:block" /> in 3 Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-28">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+52px)] right-0 h-px bg-gradient-to-r from-[#38F29B]/30 to-transparent" />
              )}
              {/* Step icon */}
              <div className="relative mb-5">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl shadow-lg shadow-black/30`}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#06111F] border-2 border-[#38F29B] flex items-center justify-center">
                  <span className="text-[9px] font-black text-[#38F29B]">{step.number}</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div id="use-cases" className="text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#38F29B] mb-4 px-3 py-1 rounded-full border border-[#38F29B]/30 bg-[#38F29B]/8">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Works for <span className="gradient-text">Every Business Type</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Whether you run a gym or a digital agency, GrowthPilot AI understands your industry and delivers results specific to your situation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="glass-card rounded-xl border border-white/8 p-4 flex flex-col items-center gap-2.5 card-hover group cursor-default"
              >
                <div className={`${useCase.color} group-hover:scale-110 transition-transform`}>
                  <useCase.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
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

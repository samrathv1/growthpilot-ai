import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'AI is generating your results...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Animated orb */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#38F29B] to-[#22D3EE] animate-pulse-glow flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#06111F] animate-spin-slow" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#38F29B] to-[#22D3EE] blur-xl opacity-25 animate-pulse-glow" />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-slate-300 font-medium text-lg">{message}</p>
        <p className="text-slate-500 text-sm mt-1">This may take a few seconds</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#38F29B]"
            style={{
              animation: `pulse 1.4s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Loading steps */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 max-w-sm w-full">
        <div className="space-y-3">
          {['Analyzing your business...', 'Processing with AI...', 'Structuring results...'].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#38F29B]"
                  style={{ animation: `pulse 1.4s ease-in-out ${i * 0.5}s infinite` }}
                />
                <span className="text-xs text-slate-400">{step}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

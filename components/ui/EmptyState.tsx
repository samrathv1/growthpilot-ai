import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Ready to Generate',
  description = 'Fill in the form above and click Generate to get your AI-powered results.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
        {icon || <Sparkles className="w-8 h-8 text-violet-400" />}
      </div>
      <div>
        <h3 className="text-slate-300 font-semibold text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">{description}</p>
      </div>
      {/* Decorative dots */}
      <div className="grid grid-cols-3 gap-2 mt-4 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        ))}
      </div>
    </div>
  );
}

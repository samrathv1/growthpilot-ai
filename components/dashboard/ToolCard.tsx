import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
  index?: number;
}

export default function ToolCard({
  icon: Icon,
  name,
  description,
  href,
  gradient,
  badge,
  index = 0,
}: ToolCardProps) {
  return (
    <div
      className="glass-card rounded-2xl border border-white/10 p-6 group hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-violet-200 transition-colors">
        {name}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{description}</p>

      {/* CTA */}
      <Link
        href={href}
        className="flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors mt-auto"
      >
        Open Tool
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

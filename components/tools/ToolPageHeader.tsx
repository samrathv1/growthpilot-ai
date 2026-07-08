interface ToolPageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  gradient?: string;
}

export default function ToolPageHeader({
  icon,
  title,
  description,
  badge,
  gradient = 'from-[#38F29B] to-[#22D3EE]',
}: ToolPageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Icon + badge */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#38F29B]/15 text-[#38F29B] border border-[#38F29B]/30">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{title}</h1>

      {/* Description */}
      <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{description}</p>

      {/* Bottom gradient line */}
      <div className="mt-6 h-px bg-gradient-to-r from-[#38F29B]/50 via-[#22D3EE]/20 to-transparent" />
    </div>
  );
}

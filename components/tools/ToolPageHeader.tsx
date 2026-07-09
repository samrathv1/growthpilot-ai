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
    <div className="mb-6 md:mb-8">
      {/* Icon + badge */}
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full bg-[#38F29B]/15 text-[#38F29B] border border-[#38F29B]/30 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1.5 md:mb-2 break-words leading-tight">{title}</h1>

      {/* Description */}
      <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl break-words">{description}</p>

      {/* Bottom gradient line */}
      <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-[#38F29B]/50 via-[#22D3EE]/20 to-transparent" />
    </div>
  );
}

'use client';

import type { ResultSection } from '@/types';

import CopyButton from '@/components/ui/CopyButton';

// Simple markdown-like renderer for bold text and bullet points
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;

    // Replace **text** with bold
    const rendered = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet points
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('→')) {
      return (
        <li
          key={i}
          className="text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      );
    }

    // Numbered list
    if (/^\d+\./.test(trimmed)) {
      return (
        <li
          key={i}
          className="text-slate-300 text-sm leading-relaxed list-decimal"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      );
    }

    // Table rows (markdown)
    if (trimmed.startsWith('|')) {
      return (
        <p
          key={i}
          className="text-slate-400 text-xs font-mono"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      );
    }

    // Bold lines (section labels)
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return (
        <p
          key={i}
          className="text-[#38F29B] font-semibold text-sm mt-2"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      );
    }

    return (
      <p
        key={i}
        className="text-slate-300 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  });
}

interface ResultSectionCardProps {
  section: ResultSection;
  index: number;
}

function ResultSectionCard({ section, index }: ResultSectionCardProps) {
  return (
    <div
      className="glass-card rounded-2xl border border-white/8 p-6 group hover:border-[#38F29B]/30 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-bold text-white text-base leading-tight">{section.title}</h3>
        <CopyButton text={section.content} />
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-[#38F29B]/40 via-[#22D3EE]/20 to-transparent mb-4" />

      {/* Content */}
      <div className="space-y-1.5 prose-result">
        {renderContent(section.content)}
      </div>
    </div>
  );
}

interface ResultSectionProps {
  sections: ResultSection[];
  onGenerateAgain?: () => void;
}

export default function ResultSection({ sections, onGenerateAgain }: ResultSectionProps) {
  const allText = sections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">
            {sections.length} sections generated
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={allText} label="Copy All" />
          {onGenerateAgain && (
            <button
              onClick={onGenerateAgain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#38F29B]/10 text-[#38F29B] border border-[#38F29B]/25 hover:bg-[#38F29B]/20 transition-all"
            >
              ↺ Generate Again
            </button>
          )}
        </div>
      </div>

      {/* Sections grid */}
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <ResultSectionCard key={index} section={section} index={index} />
        ))}
      </div>
    </div>
  );
}

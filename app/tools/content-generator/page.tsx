'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import ToolForm, { FormField } from '@/components/tools/ToolForm';
import ResultSection from '@/components/tools/ResultSection';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { PenTool } from 'lucide-react';
import { ResultSection as ResultSectionType } from '@/types';

const fields: FormField[] = [
  {
    id: 'businessType',
    label: 'Business Type',
    placeholder: 'e.g. Hair Salon, Digital Agency, Yoga Studio',
    type: 'text',
  },
  {
    id: 'platform',
    label: 'Target Platform(s)',
    placeholder: 'Select platform',
    type: 'select',
    options: ['Instagram', 'LinkedIn', 'Facebook', 'Instagram + LinkedIn', 'All Platforms', 'YouTube', 'Twitter/X'],
  },
  {
    id: 'goal',
    label: 'Content Goal',
    placeholder: 'Select goal',
    type: 'select',
    options: ['Get more followers', 'Generate leads', 'Build brand awareness', 'Drive website traffic', 'Increase bookings', 'Educate audience'],
  },
  {
    id: 'tone',
    label: 'Content Tone',
    placeholder: 'Select tone',
    type: 'select',
    options: ['Fun & Engaging', 'Professional & Expert', 'Motivational', 'Educational', 'Bold & Punchy', 'Casual & Friendly'],
  },
  {
    id: 'numberOfPosts',
    label: 'Number of Post Ideas',
    placeholder: 'Select count',
    type: 'select',
    options: ['5 posts', '7 posts', '10 posts', '14 posts'],
  },
];

export default function ContentGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultSectionType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastData, setLastData] = useState<Record<string, string> | null>(null);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    setLastData(data);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'content-generator', data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResults(json.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = () => {
    if (lastData) handleSubmit(lastData);
  };

  return (
    <DashboardLayout>
      <ToolPageHeader
        icon={<PenTool className="w-6 h-6 text-white" />}
        title="AI Content Generator"
        description="Create a complete content package — post ideas, Instagram captions, LinkedIn posts, Reel scripts, ad copies, and a full content calendar. All tailored to your business."
        gradient="from-blue-600 to-cyan-600"
      />

      <div className="glass-card rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Content Details</h2>
        <ToolForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Generate Content Package" />
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Generated Content</h2>
        {isLoading && <LoadingState message="Crafting your content strategy with AI..." />}
        {!isLoading && error && (
          <div className="text-center py-10">
            <p className="text-red-400 font-medium mb-2">Generation Failed</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button onClick={handleGenerateAgain} className="mt-4 text-violet-400 text-sm underline">Try Again</button>
          </div>
        )}
        {!isLoading && !error && results && (
          <ResultSection sections={results} onGenerateAgain={handleGenerateAgain} />
        )}
        {!isLoading && !error && !results && (
          <EmptyState
            title="Ready to Create Content"
            description="Fill in your business and platform details above to get captions, posts, Reel scripts, and a full content calendar."
            icon={<PenTool className="w-8 h-8 text-violet-400" />}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import ToolForm, { FormField } from '@/components/tools/ToolForm';
import ResultSection from '@/components/tools/ResultSection';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { FileText } from 'lucide-react';
import { ResultSection as ResultSectionType } from '@/types';

const fields: FormField[] = [
  {
    id: 'businessType',
    label: 'Business Type',
    placeholder: 'e.g. Online Fitness Coach',
    type: 'text',
  },
  {
    id: 'offer',
    label: 'Your Offer / Service',
    placeholder: 'e.g. 12-week body transformation program at ₹8,999',
    type: 'text',
  },
  {
    id: 'targetAudience',
    label: 'Target Audience',
    placeholder: 'e.g. busy working moms aged 28-45 who want to lose weight',
    type: 'text',
  },
  {
    id: 'tone',
    label: 'Writing Tone',
    placeholder: 'Select tone',
    type: 'select',
    options: ['Professional & Authoritative', 'Friendly & Conversational', 'Exciting & Energetic', 'Luxurious & Premium', 'Motivational & Bold', 'Calm & Trustworthy'],
  },
  {
    id: 'mainGoal',
    label: 'Main Goal of the Landing Page',
    placeholder: 'Select goal',
    type: 'select',
    options: ['Book a consultation', 'Purchase a product', 'Sign up for a free trial', 'Download a lead magnet', 'Join a waitlist', 'Contact / enquiry'],
  },
];

export default function LandingPageGeneratorPage() {
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
        body: JSON.stringify({ tool: 'landing-page-generator', data }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.error || 'Failed to generate');
      setResults(json.content);
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
        icon={<FileText className="w-6 h-6 text-white" />}
        title="AI Landing Page Generator"
        description="Generate complete, high-converting landing page copy — hero headlines, benefits, service sections, FAQ, and compelling CTAs. Ready to copy and paste."
        gradient="from-[#22D3EE] to-sky-500"
      />

      <div className="glass-card rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Page Details</h2>
        <ToolForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Generate Landing Page" />
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Generated Copy</h2>
        {isLoading && <LoadingState message="Writing your landing page with AI..." />}
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
            title="Ready to Generate Landing Page"
            description="Fill in your offer details above and get a complete landing page with hero, benefits, FAQ, and CTAs."
            icon={<FileText className="w-8 h-8 text-violet-400" />}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import ToolForm, { FormField } from '@/components/tools/ToolForm';
import ResultSection from '@/components/tools/ResultSection';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList } from 'lucide-react';
import { ResultSection as ResultSectionType } from '@/types';

const fields: FormField[] = [
  { id: 'businessName', label: 'Business Name', placeholder: 'e.g. FitLife Gym', type: 'text' },
  {
    id: 'businessType',
    label: 'Business Type',
    placeholder: 'Select type',
    type: 'select',
    options: ['Gym / Fitness', 'Salon / Beauty', 'Clinic / Healthcare', 'Restaurant / Food', 'Agency / Marketing', 'Coach / Consultant', 'Freelancer', 'Local Business', 'E-commerce', 'Other'],
  },
  { id: 'website', label: 'Website or Instagram (optional)', placeholder: 'e.g. fitlifegym.com or @fitlifegym', type: 'text', required: false },
  {
    id: 'goal',
    label: 'Primary Goal',
    placeholder: 'Select goal',
    type: 'select',
    options: ['Get more leads', 'Increase revenue', 'Build brand awareness', 'Improve online presence', 'Launch a new service', 'Retain existing customers'],
  },
  { id: 'targetCustomer', label: 'Target Customer', placeholder: 'e.g. working professionals aged 25-40 in my city', type: 'text' },
];

export default function BusinessAuditPage() {
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
        body: JSON.stringify({ tool: 'business-audit', data }),
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
        icon={<ClipboardList className="w-6 h-6 text-white" />}
        title="AI Business Audit"
        description="Get a comprehensive audit of your business including problem analysis, website improvements, content ideas, automation opportunities, and a 7-day action plan."
        gradient="from-[#38F29B] to-[#22D3EE]"
      />

      {/* Form card */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Business Details</h2>
        <ToolForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Run Business Audit" />
      </div>

      {/* Results */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Audit Results</h2>
        {isLoading && <LoadingState message="Auditing your business with AI..." />}
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
            title="Ready to Audit Your Business"
            description="Fill in your business details above and click 'Run Business Audit' to get your AI-powered growth analysis."
            icon={<ClipboardList className="w-8 h-8 text-violet-400" />}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

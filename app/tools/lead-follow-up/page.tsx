'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import ToolForm, { FormField } from '@/components/tools/ToolForm';
import ResultSection from '@/components/tools/ResultSection';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';
import { ResultSection as ResultSectionType } from '@/types';

const fields: FormField[] = [
  {
    id: 'leadName',
    label: 'Lead Name',
    placeholder: 'e.g. Priya Sharma',
    type: 'text',
  },
  {
    id: 'interestedService',
    label: 'Service They Are Interested In',
    placeholder: 'e.g. 3-month personal training package',
    type: 'text',
  },
  {
    id: 'budget',
    label: 'Their Budget (approx.)',
    placeholder: 'Select range',
    type: 'select',
    options: ['Under ₹2,000', '₹2,000 – ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹50,000', '₹50,000+', 'Not disclosed'],
  },
  {
    id: 'urgency',
    label: 'Their Urgency Level',
    placeholder: 'Select urgency',
    type: 'select',
    options: ['High — needs solution this week', 'Medium — thinking about it', 'Low — just exploring options', 'Unknown'],
  },
  {
    id: 'objection',
    label: 'Main Objection or Concern',
    placeholder: 'e.g. "Too expensive", "Need to think about it", "Not sure if it will work for me"',
    type: 'text',
  },
];

export default function LeadFollowUpPage() {
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
        body: JSON.stringify({ tool: 'lead-follow-up', data }),
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
        icon={<MessageSquare className="w-6 h-6 text-white" />}
        title="AI Lead Follow-up Generator"
        description="Never lose a lead again. Generate personalized WhatsApp messages, email follow-ups, call scripts, closing messages, and reminders — all customized to address their specific objection."
        gradient="from-[#38F29B] to-emerald-500"
      />

      <div className="glass-card rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Lead Details</h2>
        <ToolForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Generate Follow-up Messages" />
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Follow-up Messages</h2>
        {isLoading && <LoadingState message="Crafting personalized follow-up messages..." />}
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
            title="Ready to Create Follow-up Messages"
            description="Enter your lead's details above to get personalized WhatsApp, email, call script, and closing messages that handle their objection."
            icon={<MessageSquare className="w-8 h-8 text-violet-400" />}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

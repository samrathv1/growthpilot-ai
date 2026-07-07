'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import ResultSection from '@/components/tools/ResultSection';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import GradientButton from '@/components/ui/GradientButton';
import { Zap, AlertCircle, Sparkles } from 'lucide-react';
import { ResultSection as ResultSectionType } from '@/types';

const examples = [
  "My business is a gym. My goal is more leads. My budget is low. What should I do this week?",
  "I'm a freelance designer with 2 clients. I need 5 more clients in 30 days. Help me.",
  "My salon has 30 regular clients but I'm not growing. What should I post and do this month?",
  "I run a digital agency. I want to close 3 new clients this month. What's the best approach?",
];

export default function GrowthAgentPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultSectionType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setValidationError('Please describe your business situation.');
      return;
    }
    if (query.trim().length < 20) {
      setValidationError('Please provide more details (at least 20 characters).');
      return;
    }
    setValidationError('');
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'growth-agent', data: { query } }),
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
    if (query.trim()) handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  return (
    <DashboardLayout>
      <ToolPageHeader
        icon={<Zap className="w-6 h-6 text-white" />}
        title="AI Growth Agent"
        description="Your personal AI Chief Growth Officer. Just describe your business situation in plain language and get a complete, actionable growth playbook — including best next action, content plan, lead gen ideas, automations, and a 7-day execution plan."
        gradient="from-orange-500 to-violet-600"
        badge="PREMIUM"
      />

      {/* Premium notice */}
      <div className="mb-6 glass-card rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-300 mb-0.5">Most Powerful Tool</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Growth Agent analyzes your complete situation and creates a personalized, multi-channel growth strategy.
            Be as specific as possible for the best results — include your business type, current challenge, budget, and goals.
          </p>
        </div>
      </div>

      {/* Main input area */}
      <div className="glass-card rounded-2xl border border-white/10 mb-8 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-sm font-semibold text-slate-300">Growth Agent — Online</p>
          </div>
          <p className="text-xs text-slate-500">Describe your business situation below. The more detail, the better the strategy.</p>
        </div>

        {/* Textarea */}
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            id="growth-agent-query"
            rows={6}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="My business is a local gym. I have 60 members currently and I want to get to 200 members within 3 months. My monthly budget for marketing is ₹3,000. I've been posting on Instagram but not getting results. What should I do this week?"
            className={`w-full px-4 py-4 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm resize-none leading-relaxed ${
              validationError ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
            }`}
          />
          {validationError && (
            <p className="text-red-400 text-xs flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {validationError}
            </p>
          )}

          {/* Character count */}
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs ${query.length < 20 ? 'text-slate-600' : 'text-slate-500'}`}>
              {query.length} characters {query.length < 20 && query.length > 0 ? `(${20 - query.length} more needed)` : ''}
            </span>
            <GradientButton type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Activate Growth Agent
                </>
              )}
            </GradientButton>
          </div>
        </form>

        {/* Example prompts */}
        <div className="px-6 pb-6">
          <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest font-medium">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                className="text-xs text-slate-500 hover:text-slate-300 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 rounded-lg px-3 py-1.5 transition-all text-left"
              >
                {ex.substring(0, 55)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-5">Your Growth Strategy</h2>
        {isLoading && (
          <LoadingState message="Your Growth Agent is building your personalized strategy..." />
        )}
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
            title="Waiting for Your Business Situation"
            description="Describe your business above — the more context you give, the more powerful and specific your growth strategy will be."
            icon={<Zap className="w-8 h-8 text-orange-400" />}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

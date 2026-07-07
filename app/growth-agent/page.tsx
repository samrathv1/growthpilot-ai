'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import CopyButton from '@/components/ui/CopyButton';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import GradientButton from '@/components/ui/GradientButton';
import { 
  Zap, Save, RefreshCw, XCircle, Briefcase, TrendingUp,
  Globe, Edit3, MessageSquare, Settings, Calendar, ListChecks, CheckCircle, Target
} from 'lucide-react';
import { GrowthAgentData, GrowthAgentResult, SavedGrowthAgent } from '@/types';

const INITIAL_FORM_DATA: GrowthAgentData = {
  businessName: '',
  businessType: '',
  currentSituation: '',
  mainGoal: 'Get more leads',
  onlinePresence: 'Just starting',
  biggestProblem: 'Not getting leads',
  targetAudience: '',
  offer: '',
  budgetLevel: 'Medium budget',
  timeframe: 'Next 30 days',
  extraNotes: ''
};

function SectionWrapper({ title, icon, action, children, gradient = 'from-slate-800 to-slate-900', border = 'border-slate-700/50' }: { title: string, icon?: React.ReactNode, action?: React.ReactNode, children: React.ReactNode, gradient?: string, border?: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 backdrop-blur-sm shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-bold flex items-center gap-2">
          {icon}
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function GrowthAgentPage() {
  const [formData, setFormData] = useState<GrowthAgentData>(INITIAL_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GrowthAgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedGrowthAgent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_growth_plans');
    if (saved) {
      try {
        setSavedPlans(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved plans', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/growth-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate growth plan');
      }

      setResult(data);
      savePlanToHistory(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlanToHistory = (planData: GrowthAgentResult) => {
    const newSavedPlan: SavedGrowthAgent = {
      id: Date.now().toString(),
      businessName: formData.businessName,
      mainGoal: formData.mainGoal,
      biggestProblem: formData.biggestProblem,
      result: planData,
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [newSavedPlan, ...savedPlans];
    setSavedPlans(updatedPlans);
    localStorage.setItem('saved_growth_plans', JSON.stringify(updatedPlans));
  };

  const loadSavedPlan = (plan: SavedGrowthAgent) => {
    setFormData({
      ...INITIAL_FORM_DATA,
      businessName: plan.businessName,
      mainGoal: plan.mainGoal,
      biggestProblem: plan.biggestProblem,
    });
    setResult(plan.result);
    setError(null);
  };

  const deleteSavedPlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('saved_growth_plans', JSON.stringify(updated));
    if (result && savedPlans.find(p => p.id === id)?.result === result) {
      setResult(null);
    }
  };

  const formatFullPlanForCopy = () => {
    if (!result) return '';
    
    let text = `======================================\n`;
    text += `🔥 AI GROWTH PLAN: ${formData.businessName.toUpperCase()} 🔥\n`;
    text += `======================================\n\n`;

    if (result.business_diagnosis) {
      text += `[BUSINESS DIAGNOSIS]\n`;
      text += `Summary: ${result.business_diagnosis.summary}\n`;
      text += `Main Problem: ${result.business_diagnosis.main_problem}\n`;
      text += `Growth Stage: ${result.business_diagnosis.growth_stage}\n`;
      text += `Priority: ${result.business_diagnosis.priority_level}\n\n`;
    }

    if (result.next_best_action) {
      text += `[THE NEXT BEST ACTION]\n`;
      text += `${result.next_best_action.title}\n`;
      text += `Why: ${result.next_best_action.reason}\n`;
      text += `Impact: ${result.next_best_action.expected_impact}\n\n`;
    }

    if (result.quick_wins?.length) {
      text += `[QUICK WINS]\n`;
      result.quick_wins.forEach(w => text += `- ${w}\n`);
      text += `\n`;
    }

    if (result.seven_day_growth_plan?.length) {
      text += `[7-DAY PLAN]\n`;
      result.seven_day_growth_plan.forEach(day => {
        text += `${day.day}: ${day.task} -> Goal: ${day.goal}\n`;
      });
      text += `\n`;
    }

    if (result.thirty_day_growth_plan?.length) {
      text += `[30-DAY PLAN]\n`;
      result.thirty_day_growth_plan.forEach(week => {
        text += `${week.week} - ${week.focus}\n`;
        week.actions.forEach(a => text += `  - ${a}\n`);
      });
      text += `\n`;
    }

    if (result.website_actions?.length) {
      text += `[WEBSITE ACTIONS]\n`;
      result.website_actions.forEach(w => text += `- ${w.action} (${w.difficulty})\n  Why: ${w.why_it_matters}\n`);
      text += `\n`;
    }

    if (result.content_actions?.length) {
      text += `[CONTENT ACTIONS]\n`;
      result.content_actions.forEach(c => text += `- [${c.platform}] ${c.action}\n  Idea: ${c.content_idea}\n  CTA: ${c.cta}\n`);
      text += `\n`;
    }

    if (result.lead_followup_actions?.length) {
      text += `[LEAD FOLLOW-UP ACTIONS]\n`;
      result.lead_followup_actions.forEach(l => text += `- ${l.when_to_send}: ${l.action}\n  Message: ${l.message_angle}\n`);
      text += `\n`;
    }

    if (result.automation_actions?.length) {
      text += `[AUTOMATION ACTIONS]\n`;
      result.automation_actions.forEach(a => text += `- Use ${a.tool_suggestion} to ${a.automation}\n  Benefit: ${a.benefit}\n`);
      text += `\n`;
    }

    if (result.mistakes_to_avoid?.length) {
      text += `[MISTAKES TO AVOID]\n`;
      result.mistakes_to_avoid.forEach(m => text += `- ${m}\n`);
      text += `\n`;
    }

    if (result.recommended_growth_stack) {
      text += `[RECOMMENDED TECH STACK]\n`;
      text += `Website: ${result.recommended_growth_stack.website}\n`;
      text += `Content: ${result.recommended_growth_stack.content}\n`;
      text += `Lead Capture: ${result.recommended_growth_stack.lead_capture}\n`;
      text += `Follow-up: ${result.recommended_growth_stack.followup}\n`;
      text += `Automation: ${result.recommended_growth_stack.automation}\n\n`;
    }

    if (result.final_recommendation) {
      text += `[FINAL RECOMMENDATION]\n${result.final_recommendation}\n`;
    }

    return text;
  };

  const getSevenDayCopy = () => {
    return result?.seven_day_growth_plan.map(d => `${d.day}:\nTask: ${d.task}\nGoal: ${d.goal}`).join('\n\n') || '';
  };
  
  const getThirtyDayCopy = () => {
    return result?.thirty_day_growth_plan.map(w => `${w.week}: ${w.focus}\n- ${w.actions.join('\n- ')}`).join('\n\n') || '';
  };

  const getNextBestActionCopy = () => {
    if (!result?.next_best_action) return '';
    return `Next Best Action: ${result.next_best_action.title}\nWhy: ${result.next_best_action.reason}\nImpact: ${result.next_best_action.expected_impact}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <ToolPageHeader 
          title="AI Growth Agent" 
          description="Get your next best business actions across website, content, leads, sales, and automation."
          icon={<Zap className="w-6 h-6 text-white" />}
          gradient="from-green-500 to-emerald-700"
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="xl:col-span-4 space-y-6">
            <form onSubmit={handleSubmit} className="bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. FitPro Studio"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    placeholder="e.g. Gym, SaaS, Agency, Real Estate"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
                  <input
                    type="text"
                    name="targetAudience"
                    required
                    value={formData.targetAudience}
                    onChange={handleChange}
                    placeholder="e.g. Working professionals aged 22-35"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Offer / Product / Service</label>
                  <input
                    type="text"
                    name="offer"
                    required
                    value={formData.offer}
                    onChange={handleChange}
                    placeholder="e.g. 12-week transformation program"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Current Situation</label>
                  <textarea
                    name="currentSituation"
                    value={formData.currentSituation}
                    onChange={handleChange}
                    placeholder="e.g. We get some Instagram inquiries but very few people book consultations."
                    rows={2}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Main Goal</label>
                  <select
                    name="mainGoal"
                    value={formData.mainGoal}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm appearance-none"
                  >
                    <option>Get more leads</option>
                    <option>Increase sales</option>
                    <option>Improve website conversion</option>
                    <option>Create better content</option>
                    <option>Convert existing leads</option>
                    <option>Launch a new offer</option>
                    <option>Automate business tasks</option>
                    <option>Build online presence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Current Online Presence</label>
                  <select
                    name="onlinePresence"
                    value={formData.onlinePresence}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm appearance-none"
                  >
                    <option>No website</option>
                    <option>Website exists but not converting</option>
                    <option>Instagram only</option>
                    <option>LinkedIn only</option>
                    <option>Website + social media</option>
                    <option>Just starting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Biggest Problem</label>
                  <select
                    name="biggestProblem"
                    value={formData.biggestProblem}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm appearance-none"
                  >
                    <option>Not getting leads</option>
                    <option>Leads are not converting</option>
                    <option>No proper website</option>
                    <option>Weak content</option>
                    <option>No follow-up system</option>
                    <option>No automation</option>
                    <option>Poor offer clarity</option>
                    <option>Low trust/credibility</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Budget Level</label>
                    <select
                      name="budgetLevel"
                      value={formData.budgetLevel}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm appearance-none"
                    >
                      <option>No budget</option>
                      <option>Low budget</option>
                      <option>Medium budget</option>
                      <option>High budget</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Timeframe</label>
                    <select
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm appearance-none"
                    >
                      <option>This week</option>
                      <option>Next 14 days</option>
                      <option>Next 30 days</option>
                      <option>Next 90 days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Extra Notes (Optional)</label>
                  <textarea
                    name="extraNotes"
                    value={formData.extraNotes}
                    onChange={handleChange}
                    placeholder="e.g. Need simple steps, WhatsApp leads, Instagram growth..."
                    rows={2}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700">
                <GradientButton 
                  type="submit" 
                  disabled={isGenerating} 
                  className="w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing Growth Plan...</>
                  ) : (
                    <><Zap className="w-5 h-5" /> Generate Growth Strategy</>
                  )}
                </GradientButton>
              </div>
            </form>

            {savedPlans.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 flex items-center gap-2">
                  <Save className="w-5 h-5 text-neon-green" />
                  <h3 className="font-bold text-white text-sm">Saved Growth Plans</h3>
                </div>
                <div className="max-h-[350px] overflow-y-auto p-2">
                  {savedPlans.map(plan => (
                    <div 
                      key={plan.id}
                      onClick={() => loadSavedPlan(plan)}
                      className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-white font-medium flex items-center gap-2 text-sm">
                          {plan.businessName}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {plan.mainGoal}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteSavedPlan(plan.id, e)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete saved plan"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result Column */}
          <div className="xl:col-span-8">
            {error ? (
              <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                <p className="text-red-200">{error}</p>
              </div>
            ) : isGenerating ? (
              <LoadingState 
                message="Analyzing your business data and synthesizing a custom growth strategy..." 
              />
            ) : result ? (
              <div className="space-y-6">
                
                {/* Header Action Bar */}
                <div className="flex justify-between items-center bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 shadow-sm backdrop-blur-sm">
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Target className="w-6 h-6 text-neon-green" />
                      Your Custom Growth Strategy
                    </h3>
                    {result.isDemoMode && (
                      <span className="text-xs font-medium text-yellow-400 mt-1 block px-2 py-0.5 bg-yellow-400/10 rounded-full inline-block">
                        Preview Mode - Add API key for a real analysis
                      </span>
                    )}
                  </div>
                  <CopyButton text={formatFullPlanForCopy()} label="Copy Full Plan" />
                </div>

                {/* Business Diagnosis & Next Best Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.business_diagnosis && (
                    <SectionWrapper 
                      title="Business Diagnosis" 
                      icon={<Briefcase className="w-5 h-5 text-violet-400" />}
                      border="border-violet-500/30"
                    >
                      <div className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {result.business_diagnosis.summary}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-slate-900/80 rounded-lg p-3">
                            <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Growth Stage</span>
                            <span className="text-sm font-semibold text-white">{result.business_diagnosis.growth_stage}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded-lg p-3">
                            <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Priority</span>
                            <span className="text-sm font-semibold text-white">{result.business_diagnosis.priority_level}</span>
                          </div>
                          <div className="bg-slate-900/80 rounded-lg p-3 col-span-2">
                            <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Main Problem Identified</span>
                            <span className="text-sm font-medium text-red-300">{result.business_diagnosis.main_problem}</span>
                          </div>
                        </div>
                      </div>
                    </SectionWrapper>
                  )}

                  {result.next_best_action && (
                    <SectionWrapper 
                      title="The Next Best Action" 
                      icon={<Zap className="w-5 h-5 text-neon-green" />}
                      gradient="from-green-900/20 to-emerald-900/20"
                      border="border-neon-green/30"
                      action={<CopyButton text={getNextBestActionCopy()} />}
                    >
                      <div className="flex flex-col h-full justify-center space-y-4">
                        <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-4">
                          <h5 className="text-neon-green font-bold text-lg leading-tight mb-2">
                            {result.next_best_action.title}
                          </h5>
                          <p className="text-sm text-slate-300">
                            <strong>Why:</strong> {result.next_best_action.reason}
                          </p>
                        </div>
                        <div className="bg-slate-900/80 rounded-xl p-4 flex gap-3 items-center border border-slate-700/50">
                          <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
                          <div>
                            <span className="block text-xs text-slate-400">Expected Impact</span>
                            <span className="text-sm font-semibold text-white">{result.next_best_action.expected_impact}</span>
                          </div>
                        </div>
                      </div>
                    </SectionWrapper>
                  )}
                </div>

                {/* Quick Wins & Mistakes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.quick_wins?.length > 0 && (
                    <SectionWrapper title="Quick Wins" icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}>
                      <ul className="space-y-3">
                        {result.quick_wins.map((win, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span> {win}
                          </li>
                        ))}
                      </ul>
                    </SectionWrapper>
                  )}
                  {result.mistakes_to_avoid?.length > 0 && (
                    <SectionWrapper title="Mistakes to Avoid" icon={<XCircle className="w-5 h-5 text-red-400" />}>
                      <ul className="space-y-3">
                        {result.mistakes_to_avoid.map((mistake, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                            <span className="text-red-400 font-bold shrink-0">✕</span> {mistake}
                          </li>
                        ))}
                      </ul>
                    </SectionWrapper>
                  )}
                </div>

                {/* Strategy Execution Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.website_actions?.length > 0 && (
                    <SectionWrapper title="Website Actions" icon={<Globe className="w-5 h-5 text-blue-400" />}>
                      <div className="space-y-3">
                        {result.website_actions.map((act, i) => (
                          <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h5 className="font-semibold text-white text-sm">{act.action}</h5>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
                                {act.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{act.why_it_matters}</p>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}

                  {result.content_actions?.length > 0 && (
                    <SectionWrapper title="Content Actions" icon={<Edit3 className="w-5 h-5 text-pink-400" />}>
                      <div className="space-y-3">
                        {result.content_actions.map((act, i) => (
                          <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                {act.platform}
                              </span>
                              <h5 className="font-semibold text-white text-sm">{act.action}</h5>
                            </div>
                            <p className="text-xs text-slate-300 mt-2"><strong>Idea:</strong> {act.content_idea}</p>
                            <p className="text-xs text-slate-400 mt-1"><strong>CTA:</strong> {act.cta}</p>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}

                  {result.lead_followup_actions?.length > 0 && (
                    <SectionWrapper title="Lead Follow-up Actions" icon={<MessageSquare className="w-5 h-5 text-amber-400" />}>
                      <div className="space-y-3">
                        {result.lead_followup_actions.map((act, i) => (
                          <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {act.when_to_send}
                              </span>
                            </div>
                            <h5 className="font-semibold text-white text-sm mb-1">{act.action}</h5>
                            <p className="text-xs text-slate-400"><strong>Angle:</strong> {act.message_angle}</p>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}

                  {result.automation_actions?.length > 0 && (
                    <SectionWrapper title="Automation Actions" icon={<Settings className="w-5 h-5 text-cyan-400" />}>
                      <div className="space-y-3">
                        {result.automation_actions.map((act, i) => (
                          <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {act.tool_suggestion}
                              </span>
                            </div>
                            <h5 className="font-semibold text-white text-sm mb-1">{act.automation}</h5>
                            <p className="text-xs text-slate-400"><strong>Benefit:</strong> {act.benefit}</p>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}
                </div>

                {/* 7-Day & 30-Day Plans */}
                <div className="space-y-6">
                  {result.seven_day_growth_plan?.length > 0 && (
                    <SectionWrapper 
                      title="7-Day Execution Plan" 
                      icon={<ListChecks className="w-5 h-5 text-neon-green" />}
                      action={<CopyButton text={getSevenDayCopy()} label="Copy 7-Day Plan" />}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {result.seven_day_growth_plan.map((day, i) => (
                          <div key={i} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                              <Calendar className="w-12 h-12 text-neon-green" />
                            </div>
                            <span className="text-xs font-bold text-neon-green block mb-2">{day.day.toUpperCase()}</span>
                            <h5 className="text-white font-semibold text-sm mb-2 relative z-10">{day.task}</h5>
                            <p className="text-xs text-slate-400 relative z-10"><strong>Goal:</strong> {day.goal}</p>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}

                  {result.thirty_day_growth_plan?.length > 0 && (
                    <SectionWrapper 
                      title="30-Day Blueprint" 
                      icon={<Calendar className="w-5 h-5 text-violet-400" />}
                      action={<CopyButton text={getThirtyDayCopy()} label="Copy 30-Day Plan" />}
                    >
                      <div className="space-y-4">
                        {result.thirty_day_growth_plan.map((week, i) => (
                          <div key={i} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                              <span className="text-sm font-bold text-violet-400 shrink-0">{week.week.toUpperCase()}</span>
                              <span className="text-sm font-semibold text-white">{week.focus}</span>
                            </div>
                            <ul className="space-y-2 pl-2">
                              {week.actions.map((action, j) => (
                                <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                                  <span className="text-violet-500 mt-1">●</span> {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </SectionWrapper>
                  )}
                </div>

                {/* Final Recommendation & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.recommended_growth_stack && (
                    <SectionWrapper title="Recommended Tech Stack" icon={<Globe className="w-5 h-5 text-slate-300" />}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 text-center">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">Website</span>
                          <span className="font-semibold text-white">{result.recommended_growth_stack.website}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 text-center">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">Content</span>
                          <span className="font-semibold text-white">{result.recommended_growth_stack.content}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 text-center">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">Lead Capture</span>
                          <span className="font-semibold text-white">{result.recommended_growth_stack.lead_capture}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 text-center">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">Follow-up</span>
                          <span className="font-semibold text-white">{result.recommended_growth_stack.followup}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50 text-center col-span-2">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">Automation</span>
                          <span className="font-semibold text-white">{result.recommended_growth_stack.automation}</span>
                        </div>
                      </div>
                    </SectionWrapper>
                  )}

                  {result.final_recommendation && (
                    <SectionWrapper title="Final Note" icon={<Target className="w-5 h-5 text-yellow-400" />}>
                      <div className="h-full flex items-center p-4 bg-yellow-400/10 border-l-4 border-l-yellow-400 rounded-r-xl">
                        <p className="text-sm text-yellow-100/90 leading-relaxed italic">
                          "{result.final_recommendation}"
                        </p>
                      </div>
                    </SectionWrapper>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[500px] flex items-center justify-center">
                <EmptyState 
                  title="Ready for Growth Analysis" 
                  description="Provide your business details and current challenges to get a custom, actionable step-by-step AI growth strategy."
                  icon={<Zap className="w-12 h-12 text-slate-600" />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

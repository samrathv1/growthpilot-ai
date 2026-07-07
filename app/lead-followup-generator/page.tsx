'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';


import CopyButton from '@/components/ui/CopyButton';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import GradientButton from '@/components/ui/GradientButton';
import { 
  Building2, MessageSquare, Target, Save, FileText, FileAudio, RefreshCw, Send, Mail, Phone, CalendarClock, AlertCircle, CheckCircle2, ChevronRight, XCircle
} from 'lucide-react';
import { LeadFollowupData, LeadFollowupResult, SavedLeadFollowup } from '@/types';

const INITIAL_FORM_DATA: LeadFollowupData = {
  businessName: '',
  businessType: '',
  leadName: '',
  leadInterest: '',
  leadStage: 'New lead',
  mainGoal: 'Book a call',
  leadObjection: '',
  preferredChannel: 'WhatsApp',
  tone: 'Professional',
  extraNotes: ''
};

function SectionWrapper({ title, icon, action, children }: { title: string, icon?: React.ReactNode, action?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function LeadFollowupGeneratorPage() {
  const [formData, setFormData] = useState<LeadFollowupData>(INITIAL_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<LeadFollowupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedLeadFollowup[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_lead_plans');
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
      const res = await fetch('/api/lead-followup-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate plan');
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

  const savePlanToHistory = (planData: LeadFollowupResult) => {
    const newSavedPlan: SavedLeadFollowup = {
      id: Date.now().toString(),
      businessName: formData.businessName,
      leadName: formData.leadName,
      leadStage: formData.leadStage,
      result: planData,
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [newSavedPlan, ...savedPlans];
    setSavedPlans(updatedPlans);
    localStorage.setItem('saved_lead_plans', JSON.stringify(updatedPlans));
  };

  const loadSavedPlan = (plan: SavedLeadFollowup) => {
    setFormData({
      ...INITIAL_FORM_DATA,
      businessName: plan.businessName,
      leadName: plan.leadName,
      leadStage: plan.leadStage as any,
    });
    setResult(plan.result);
    setError(null);
  };

  const deleteSavedPlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('saved_lead_plans', JSON.stringify(updated));
    if (result && savedPlans.find(p => p.id === id)?.result === result) {
      setResult(null);
    }
  };

  const formatFullPlanForCopy = () => {
    if (!result) return '';
    
    let text = `======================================\n`;
    text += `🔥 LEAD FOLLOW-UP PLAN: ${formData.leadName.toUpperCase()} 🔥\n`;
    text += `======================================\n\n`;

    if (result.lead_summary) {
      text += `[LEAD SUMMARY]\n`;
      text += `Score: ${result.lead_summary.lead_score}/100\n`;
      text += `Stage: ${result.lead_summary.lead_stage}\n`;
      text += `Intent: ${result.lead_summary.intent_level}\n`;
      text += `Approach: ${result.lead_summary.recommended_approach}\n\n`;
    }

    if (result.whatsapp_messages?.length) {
      text += `[WHATSAPP MESSAGES]\n`;
      result.whatsapp_messages.forEach(msg => {
        text += `- ${msg.type}:\n${msg.message}\n\n`;
      });
    }

    if (result.email_followups?.length) {
      text += `[EMAIL FOLLOW-UPS]\n`;
      result.email_followups.forEach((email, idx) => {
        text += `Email ${idx + 1}:\nSubject: ${email.subject}\n\n${email.body}\n\n`;
      });
    }

    if (result.call_script) {
      text += `[CALL SCRIPT]\n`;
      text += `Opening: ${result.call_script.opening}\n\n`;
      text += `Questions:\n`;
      result.call_script.questions_to_ask.forEach(q => text += `- ${q}\n`);
      text += `\nPitch: ${result.call_script.pitch}\n\n`;
      text += `Closing: ${result.call_script.closing_line}\n\n`;
    }

    if (result.objection_handling?.length) {
      text += `[OBJECTION HANDLING]\n`;
      result.objection_handling.forEach(obj => {
        text += `If they say: "${obj.objection}"\nResponse: ${obj.response}\n\n`;
      });
    }

    if (result.closing_messages?.length) {
      text += `[CLOSING MESSAGES]\n`;
      result.closing_messages.forEach(msg => {
        text += `- ${msg.message}\n\n`;
      });
    }

    if (result.followup_schedule?.length) {
      text += `[FOLLOW-UP SCHEDULE]\n`;
      result.followup_schedule.forEach(item => {
        text += `${item.day} (${item.message_type}): ${item.action}\n`;
      });
      text += `\n`;
    }

    if (result.final_recommendation) {
      text += `[FINAL RECOMMENDATION]\n${result.final_recommendation}\n`;
    }

    return text;
  };

  const getWhatsAppCopy = () => result?.whatsapp_messages.map(m => `[${m.type}]\n${m.message}`).join('\n\n') || '';
  const getEmailCopy = () => result?.email_followups.map(e => `Subject: ${e.subject}\n\n${e.body}`).join('\n\n---\n\n') || '';
  const getCallScriptCopy = () => {
    if (!result?.call_script) return '';
    return `Opening:\n${result.call_script.opening}\n\nQuestions:\n${result.call_script.questions_to_ask.join('\n')}\n\nPitch:\n${result.call_script.pitch}\n\nClosing:\n${result.call_script.closing_line}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <ToolPageHeader 
          title="AI Lead Follow-up Generator" 
          description="Generate personalized WhatsApp, email, call scripts, and closing messages for your business leads."
          icon={<MessageSquare className="w-6 h-6 text-white" />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSubmit} className="bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. FitPro Studio"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
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
                    placeholder="e.g. Gym, Agency, Real Estate"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Lead Name</label>
                  <input
                    type="text"
                    name="leadName"
                    required
                    value={formData.leadName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Lead Interest</label>
                  <input
                    type="text"
                    name="leadInterest"
                    required
                    value={formData.leadInterest}
                    onChange={handleChange}
                    placeholder="e.g. 12-week transformation program"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Lead Stage</label>
                    <select
                      name="leadStage"
                      value={formData.leadStage}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 appearance-none"
                    >
                      <option>New lead</option>
                      <option>Warm lead</option>
                      <option>Hot lead</option>
                      <option>Follow-up needed</option>
                      <option>Ghosted lead</option>
                      <option>Price objection</option>
                      <option>Ready to close</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Main Goal</label>
                    <select
                      name="mainGoal"
                      value={formData.mainGoal}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 appearance-none"
                    >
                      <option>Book a call</option>
                      <option>Get payment</option>
                      <option>Send proposal</option>
                      <option>Re-engage lead</option>
                      <option>Handle objection</option>
                      <option>Close the deal</option>
                      <option>Share more information</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Lead Objection / Concern</label>
                  <input
                    type="text"
                    name="leadObjection"
                    value={formData.leadObjection}
                    onChange={handleChange}
                    placeholder="e.g. Price is high, needs time, comparing options"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Preferred Channel</label>
                    <select
                      name="preferredChannel"
                      value={formData.preferredChannel}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 appearance-none"
                    >
                      <option>WhatsApp</option>
                      <option>Email</option>
                      <option>Phone Call</option>
                      <option>Multi-channel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tone</label>
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 appearance-none"
                    >
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Premium</option>
                      <option>Persuasive</option>
                      <option>Short and direct</option>
                      <option>Warm and helpful</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Extra Notes (Optional)</label>
                  <textarea
                    name="extraNotes"
                    value={formData.extraNotes}
                    onChange={handleChange}
                    placeholder="e.g. Mention limited slots, free consultation, discount..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <GradientButton 
                  type="submit" 
                  disabled={isGenerating} 
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Follow-up...</>
                  ) : (
                    <><MessageSquare className="w-5 h-5" /> Generate Follow-up Plan</>
                  )}
                </GradientButton>
              </div>
            </form>

            {savedPlans.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                  <Save className="w-5 h-5 text-neon-green" />
                  <h3 className="font-semibold text-white">Saved Follow-up Plans</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {savedPlans.map(plan => (
                    <div 
                      key={plan.id}
                      onClick={() => loadSavedPlan(plan)}
                      className="p-3 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          {plan.leadName}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {plan.businessName} • {plan.leadStage}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteSavedPlan(plan.id, e)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete saved plan"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result Column */}
          <div className="lg:col-span-7">
            {error ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Generation Failed</h3>
                <p className="text-red-200">{error}</p>
              </div>
            ) : isGenerating ? (
              <LoadingState 
                message="Crafting follow-up strategy. Analyzing lead context and generating personalized messages..." 
              />
            ) : result ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-neon-green" />
                      Lead Follow-up Strategy Ready
                    </h3>
                    {result.isDemoMode && (
                      <span className="text-xs text-yellow-400 mt-1 block">Preview Mode - Add API key for custom generation</span>
                    )}
                  </div>
                  <CopyButton text={formatFullPlanForCopy()} label="Full Plan" />
                </div>

                {result.lead_summary && (
                  <SectionWrapper title="Lead Summary & Score" icon={<Target className="w-5 h-5" />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Score</span>
                        <span className="text-xl font-bold text-neon-green">{result.lead_summary.lead_score}/100</span>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Stage</span>
                        <span className="text-sm font-semibold text-white">{result.lead_summary.lead_stage}</span>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 col-span-2">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Intent</span>
                        <span className="text-sm font-semibold text-white">{result.lead_summary.intent_level}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300">
                      <strong>Recommended Approach:</strong> {result.lead_summary.recommended_approach}
                    </div>
                  </SectionWrapper>
                )}

                {result.whatsapp_messages?.length > 0 && (
                  <SectionWrapper title="WhatsApp Messages" icon={<Send className="w-5 h-5" />}
                    action={<CopyButton text={getWhatsAppCopy()} />}
                  >
                    <div className="space-y-4">
                      {result.whatsapp_messages.map((msg, i) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-700 relative group">
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-slate-800 text-xs text-neon-green rounded-full border border-slate-600">
                            {msg.type}
                          </span>
                          <p className="text-white whitespace-pre-wrap text-sm mt-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </SectionWrapper>
                )}

                {result.email_followups?.length > 0 && (
                  <SectionWrapper title="Email Follow-ups" icon={<Mail className="w-5 h-5" />}
                    action={<CopyButton text={getEmailCopy()} />}
                  >
                    <div className="space-y-4">
                      {result.email_followups.map((email, i) => (
                        <div key={i} className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                            <span className="text-xs text-slate-400">Subject: </span>
                            <span className="text-sm font-medium text-white">{email.subject}</span>
                          </div>
                          <div className="p-4">
                            <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{email.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionWrapper>
                )}

                {result.call_script && (
                  <SectionWrapper title="Phone Call Script" icon={<Phone className="w-5 h-5" />}
                    action={<CopyButton text={getCallScriptCopy()} />}
                  >
                    <div className="space-y-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opening</h4>
                        <p className="text-white text-sm bg-slate-800 p-3 rounded">{result.call_script.opening}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Questions to Ask</h4>
                        <ul className="space-y-2">
                          {result.call_script.questions_to_ask.map((q, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-neon-green">Q:</span> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">The Pitch</h4>
                        <p className="text-white text-sm bg-slate-800 p-3 rounded">{result.call_script.pitch}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Closing</h4>
                        <p className="text-neon-green text-sm font-medium">{result.call_script.closing_line}</p>
                      </div>
                    </div>
                  </SectionWrapper>
                )}

                {result.objection_handling?.length > 0 && (
                  <SectionWrapper title="Handling Objections" icon={<AlertCircle className="w-5 h-5" />}>
                    <div className="grid gap-4">
                      {result.objection_handling.map((obj, i) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col gap-3">
                          <div className="flex gap-2 items-start">
                            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold shrink-0 mt-0.5">If they say:</span>
                            <span className="text-white text-sm">"{obj.objection}"</span>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="bg-neon-green/20 text-neon-green text-xs px-2 py-1 rounded font-bold shrink-0 mt-0.5">Response:</span>
                            <span className="text-slate-300 text-sm">{obj.response}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionWrapper>
                )}

                {result.closing_messages?.length > 0 && (
                  <SectionWrapper title="Closing Messages" icon={<CheckCircle2 className="w-5 h-5" />}>
                    <div className="space-y-3">
                      {result.closing_messages.map((msg, i) => (
                        <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                          <p className="text-white text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </SectionWrapper>
                )}

                {result.followup_schedule?.length > 0 && (
                  <SectionWrapper title="Follow-up Schedule" icon={<CalendarClock className="w-5 h-5" />}>
                    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                      {result.followup_schedule.map((item, i) => (
                        <div key={i} className={`flex items-center p-3 sm:p-4 ${i !== result.followup_schedule.length - 1 ? 'border-b border-slate-800' : ''}`}>
                          <div className="w-16 shrink-0 font-bold text-neon-green text-sm">{item.day}</div>
                          <div className="flex-1 text-sm text-slate-300">{item.action}</div>
                          <div className="w-24 shrink-0 text-right">
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 border border-slate-700">
                              {item.message_type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionWrapper>
                )}

                {result.final_recommendation && (
                  <SectionWrapper title="Final Recommendation" icon={<FileText className="w-5 h-5" />}>
                    <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-l-neon-green text-sm text-slate-300 leading-relaxed">
                      {result.final_recommendation}
                    </div>
                  </SectionWrapper>
                )}

              </div>
            ) : (
              <EmptyState 
                title="Awaiting Lead Details" 
                description="Fill out the form on the left with your lead's information to generate a personalized, high-converting follow-up sequence."
                icon={<MessageSquare className="w-12 h-12 text-slate-600" />}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

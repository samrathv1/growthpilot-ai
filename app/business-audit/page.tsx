'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import CopyButton from '@/components/ui/CopyButton';
import { 
  ClipboardList, 
  AlertTriangle, 
  Globe, 
  PenTool, 
  Zap, 
  Sparkles, 
  Calendar, 
  Award, 
  Trash2, 
  History, 
  ExternalLink,
  PlusCircle,
  FileText
} from 'lucide-react';

interface DayPlan {
  day: string;
  task: string;
}

interface AuditResult {
  id: string;
  timestamp: string;
  isDemoMode?: boolean;
  businessName: string;
  businessType: string;
  website: string;
  goal: string;
  targetAudience: string;
  business_summary: string;
  main_problems: string[];
  website_improvements: string[];
  content_ideas: string[];
  automation_ideas: string[];
  ai_tool_suggestions: string[];
  seven_day_action_plan: DayPlan[];
  final_recommendation: string;
}

export default function BusinessAuditPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    website: '',
    goal: '',
    targetAudience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedAudits, setSavedAudits] = useState<AuditResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem('growthpilot_business_audits');
    if (history) {
      try {
        setSavedAudits(JSON.parse(history));
      } catch (e) {
        console.error('Failed to parse audit history', e);
      }
    }
  }, []);

  // Save history to localStorage helper
  const saveToHistory = (newAudit: AuditResult) => {
    const updated = [newAudit, ...savedAudits.filter((item) => item.id !== newAudit.id)].slice(0, 10);
    setSavedAudits(updated);
    localStorage.setItem('growthpilot_business_audits', JSON.stringify(updated));
  };

  // Delete an audit from history
  const deleteAudit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAudits.filter((item) => item.id !== id);
    setSavedAudits(updated);
    localStorage.setItem('growthpilot_business_audits', JSON.stringify(updated));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business Type is required';
    if (!formData.goal.trim()) newErrors.goal = 'Main Goal is required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target Audience is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setCurrentResult(null);

    try {
      const res = await fetch('/api/business-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data: any = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const json = await res.json();
          if (!res.ok || json.success === false) {
            throw new Error(json.error || 'Failed to generate business audit');
          }
          data = json.content;
        } catch (jsonErr: any) {
          throw new Error(jsonErr.message || 'Failed to parse response data.');
        }
      } else {
        const textErr = await res.text();
        throw new Error(textErr || `Server returned status ${res.status}`);
      }

      // Add unique ID and timestamp to the result
      const fullResult: AuditResult = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString(),
        businessName: formData.businessName,
        businessType: formData.businessType,
        website: formData.website || 'None',
        goal: formData.goal,
        targetAudience: formData.targetAudience,
      };

      setCurrentResult(fullResult);
      saveToHistory(fullResult);
    } catch (err) {
      console.error(err);
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedAudit = (audit: AuditResult) => {
    setCurrentResult(audit);
    setFormData({
      businessName: audit.businessName,
      businessType: audit.businessType,
      website: audit.website === 'None' ? '' : audit.website,
      goal: audit.goal,
      targetAudience: audit.targetAudience,
    });
    setApiError(null);
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      businessType: '',
      website: '',
      goal: '',
      targetAudience: '',
    });
    setCurrentResult(null);
    setApiError(null);
  };

  // Construct text for copy button
  const getShareableText = (audit: AuditResult) => {
    return `AI BUSINESS AUDIT: ${audit.businessName.toUpperCase()}
Type: ${audit.businessType}
Website: ${audit.website}
Goal: ${audit.goal}
Target Audience: ${audit.targetAudience}

BUSINESS SUMMARY:
${audit.business_summary}

MAIN PROBLEMS:
${audit.main_problems.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

WEBSITE IMPROVEMENTS:
${audit.website_improvements.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

CONTENT IDEAS:
${audit.content_ideas.map((p, idx) => `• ${p}`).join('\n')}

AUTOMATION IDEAS:
${audit.automation_ideas.map((p, idx) => `• ${p}`).join('\n')}

AI TOOL SUGGESTIONS:
${audit.ai_tool_suggestions.map((p, idx) => `• ${p}`).join('\n')}

7-DAY ACTION PLAN:
${audit.seven_day_action_plan.map((d) => `${d.day}: ${d.task}`).join('\n')}

FINAL RECOMMENDATION:
${audit.final_recommendation}
`;
  };

  return (
    <DashboardLayout>
      <ToolPageHeader
        icon={<ClipboardList className="w-6 h-6 text-white" />}
        title="AI Business Audit"
        description="Submit your business parameters to trigger a full growth, content, website, and automation analysis using Google Gemini."
        gradient="from-violet-600 to-indigo-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & History */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Form Card */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Business Info</h2>
              {currentResult && (
                <button 
                  onClick={resetForm}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> New Audit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Example: Nexa Fitness Studio"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors.businessName ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Business Type</label>
                <input
                  type="text"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="Example: Gym, Cafe, Real Estate, Agency"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors.businessType ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.businessType && <p className="text-red-400 text-xs mt-1">{errors.businessType}</p>}
              </div>

              {/* Website/Instagram Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Website / Instagram Link <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Example: nexafitness.com or @nexafitness"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm hover:border-white/20"
                />
              </div>

              {/* Main Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Main Goal</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="Example: Get more leads"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors.goal ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.goal && <p className="text-red-400 text-xs mt-1">{errors.goal}</p>}
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Example: Working professionals aged 22-35"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors.targetAudience ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.targetAudience && <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gradient py-3 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Audit...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Audit
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History Card */}
          {savedAudits.length > 0 && (
            <div className="glass-card rounded-2xl border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-violet-400" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Audits</h2>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {savedAudits.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadSavedAudit(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      currentResult && currentResult.id === item.id
                        ? 'bg-violet-600/10 border-violet-500/35 text-violet-300'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold truncate">{item.businessName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.businessType} • {item.timestamp.split(',')[0]}</p>
                    </div>
                    <button
                      onClick={(e) => deleteAudit(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Audit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Loading, Success, Error or Empty States */}
        <div className="lg:col-span-8">
          
          {isLoading && (
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <LoadingState message="Analyzing details & generating your Business Audit..." />
            </div>
          )}

          {apiError && !isLoading && (
            <div className="glass-card rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Audit Generation Failed</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">{apiError}</p>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all font-semibold text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !apiError && !currentResult && (
            <EmptyState
              title="Awaiting Business Parameters"
              description="Fill out the details on the left, then click 'Generate Audit' to get actionable growth strategies, content suggestions, website improvements, and a structured 7-day task list."
              icon={<ClipboardList className="w-10 h-10 text-violet-400 animate-pulse" />}
            />
          )}

          {currentResult && !isLoading && !apiError && (
            <div className="space-y-6">
              
              {/* Audit Header Panel */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {currentResult.isDemoMode ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">Demo Mode — Mock AI</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Gemini AI Active</span>
                    )}
                    {currentResult.website !== 'None' && (
                      <a 
                        href={currentResult.website.startsWith('http') ? currentResult.website : `https://${currentResult.website}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                      >
                        Visit site <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white">{currentResult.businessName}</h2>
                  <p className="text-xs text-slate-500">Generated on {currentResult.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={getShareableText(currentResult)} label="Copy Audit" />
                </div>
              </div>

              {/* Business Summary Card */}
              <div className="glass-card rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Business Summary</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{currentResult.business_summary}</p>
              </div>

              {/* Side-by-side problems and website improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Main Problems */}
                <div className="glass-card rounded-2xl border border-red-500/10 bg-red-500/2 p-6 hover:border-red-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <h3 className="font-bold text-white text-base">Main Problems</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentResult.main_problems.map((problem, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-300 text-sm leading-relaxed">
                        <span className="text-red-400 font-bold font-mono">{i + 1}.</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Website Improvements */}
                <div className="glass-card rounded-2xl border border-cyan-500/10 bg-cyan-500/2 p-6 hover:border-cyan-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white text-base">Website Improvements</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentResult.website_improvements.map((imp, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-300 text-sm leading-relaxed">
                        <span className="text-cyan-400 font-bold font-mono">{i + 1}.</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Ideas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Content Ideas */}
                <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-violet-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center">
                      <PenTool className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Content Ideas</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentResult.content_ideas.map((idea, i) => (
                      <li key={i} className="flex gap-2 text-slate-300 text-xs leading-relaxed">
                        <span className="text-violet-400">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Automation Ideas */}
                <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-violet-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Automation Ideas</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentResult.automation_ideas.map((auto, i) => (
                      <li key={i} className="flex gap-2 text-slate-300 text-xs leading-relaxed">
                        <span className="text-amber-400">•</span>
                        <span>{auto}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Tools Suggestions */}
                <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-violet-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">AI Tool Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentResult.ai_tool_suggestions.map((tool, i) => (
                      <li key={i} className="flex gap-2 text-slate-300 text-xs leading-relaxed">
                        <span className="text-emerald-400">•</span>
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* 7-Day Action Plan */}
              <div className="glass-card rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">7-Day Action Plan</h3>
                </div>

                {/* Timeline layout */}
                <div className="relative pl-6 border-l border-white/10 space-y-6 ml-3">
                  {currentResult.seven_day_action_plan.map((dayItem, i) => (
                    <div key={i} className="relative group">
                      {/* Timeline dot badge */}
                      <span className="absolute -left-[37px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#050816] border border-violet-500 text-[10px] font-black text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-1">{dayItem.day}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{dayItem.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Recommendation Card */}
              <div className="glass-card rounded-2xl border-l-4 border-l-emerald-500 border-t border-r border-b border-white/10 bg-emerald-950/5 p-6 shadow-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Award className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-emerald-400 text-base">Final Growth Recommendation</h3>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  {currentResult.final_recommendation}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}

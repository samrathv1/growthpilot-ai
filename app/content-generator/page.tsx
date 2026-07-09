'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import CopyButton from '@/components/ui/CopyButton';
import {
  PenTool,
  AlertTriangle,
  Sparkles,
  History,
  Trash2,
  PlusCircle,
  Target,
  Lightbulb,
  MessageCircle,
  Film,
  Megaphone,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Hash,
} from 'lucide-react';

// ── Interfaces ───────────────────────────────────────────────────────────────

interface ContentStrategy {
  summary: string;
  target_audience_angle: string;
  main_message: string;
  recommended_platform: string;
  posting_frequency: string;
}

interface PostIdea {
  title: string;
  description: string;
  content_type: string;
}

interface Caption {
  caption: string;
  cta: string;
  hashtags: string[];
}

interface ReelScript {
  hook: string;
  script: string;
  visual_idea: string;
  cta: string;
}

interface AdCopy {
  headline: string;
  primary_text: string;
  cta: string;
}

interface WhatsAppPromo {
  message: string;
  follow_up: string;
}

interface CalendarEntry {
  day: string;
  platform: string;
  content_type: string;
  topic: string;
  caption: string;
  cta: string;
}

interface ContentResult {
  id: string;
  timestamp: string;
  isDemoMode?: boolean;
  businessName: string;
  platform: string;
  goal: string;
  content_strategy: ContentStrategy;
  post_ideas: PostIdea[];
  captions: Caption[];
  reel_scripts: ReelScript[];
  ad_copies: AdCopy[];
  whatsapp_promos: WhatsAppPromo[];
  content_calendar: CalendarEntry[];
  best_performing_angles: string[];
  final_recommendation: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ContentGeneratorPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    offer: '',
    targetAudience: '',
    platform: 'Instagram',
    goal: 'Get more leads',
    tone: 'Professional',
    contentDuration: '7 days',
    extraNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ContentResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<ContentResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem('growthpilot_content_plans');
    if (history) {
      try {
        setSavedPlans(JSON.parse(history));
      } catch (e) {
        console.error('Failed to parse content plan history', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newPlan: ContentResult) => {
    const updated = [newPlan, ...savedPlans.filter((item) => item.id !== newPlan.id)].slice(0, 10);
    setSavedPlans(updated);
    localStorage.setItem('growthpilot_content_plans', JSON.stringify(updated));
  };

  // Delete a plan from history
  const deletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPlans.filter((item) => item.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('growthpilot_content_plans', JSON.stringify(updated));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    if (!formData.offer.trim()) newErrors.offer = 'Product / Offer is required';
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
      const res = await fetch('/api/content-generator', {
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
            throw new Error(json.error || 'Failed to generate content plan');
          }
          data = json.content;
        } catch (jsonErr: any) {
          throw new Error(jsonErr.message || 'Failed to parse response data.');
        }
      } else {
        const textErr = await res.text();
        throw new Error(textErr || `Server returned status ${res.status}`);
      }

      const fullResult: ContentResult = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString(),
        businessName: formData.businessName,
        platform: formData.platform,
        goal: formData.goal,
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

  const loadSavedPlan = (plan: ContentResult) => {
    setCurrentResult(plan);
    setApiError(null);
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      businessType: '',
      offer: '',
      targetAudience: '',
      platform: 'Instagram',
      goal: 'Get more leads',
      tone: 'Professional',
      contentDuration: '7 days',
      extraNotes: '',
    });
    setCurrentResult(null);
    setApiError(null);
  };

  // ── Copy Helpers ─────────────────────────────────────────────────────────

  const getFullPlanText = (r: ContentResult) => {
    return `CONTENT PLAN: ${r.businessName.toUpperCase()}
Platform: ${r.platform} | Goal: ${r.goal}
Generated: ${r.timestamp}

═══ CONTENT STRATEGY ═══
${r.content_strategy.summary}
Audience Angle: ${r.content_strategy.target_audience_angle}
Main Message: ${r.content_strategy.main_message}
Recommended Platform: ${r.content_strategy.recommended_platform}
Posting Frequency: ${r.content_strategy.posting_frequency}

═══ POST IDEAS ═══
${r.post_ideas.map((p, i) => `${i + 1}. [${p.content_type}] ${p.title}\n   ${p.description}`).join('\n\n')}

═══ CAPTIONS ═══
${r.captions.map((c, i) => `${i + 1}. ${c.caption}\nCTA: ${c.cta}\nHashtags: ${c.hashtags.join(' ')}`).join('\n\n')}

═══ REEL SCRIPTS ═══
${r.reel_scripts.map((s, i) => `${i + 1}. Hook: ${s.hook}\nScript: ${s.script}\nVisual: ${s.visual_idea}\nCTA: ${s.cta}`).join('\n\n')}

═══ AD COPIES ═══
${r.ad_copies.map((a, i) => `${i + 1}. Headline: ${a.headline}\n${a.primary_text}\nCTA: ${a.cta}`).join('\n\n')}

═══ WHATSAPP PROMOS ═══
${r.whatsapp_promos.map((w, i) => `${i + 1}. Message: ${w.message}\nFollow-up: ${w.follow_up}`).join('\n\n')}

═══ CONTENT CALENDAR ═══
${r.content_calendar.map((c) => `${c.day} | ${c.platform} | ${c.content_type} | ${c.topic}`).join('\n')}

═══ BEST PERFORMING ANGLES ═══
${r.best_performing_angles.map((a, i) => `${i + 1}. ${a}`).join('\n')}

═══ FINAL RECOMMENDATION ═══
${r.final_recommendation}
`;
  };

  const getCaptionsText = (r: ContentResult) => {
    return r.captions.map((c, i) => `Caption ${i + 1}:\n${c.caption}\n\nCTA: ${c.cta}\nHashtags: ${c.hashtags.join(' ')}`).join('\n\n---\n\n');
  };

  const getReelScriptsText = (r: ContentResult) => {
    return r.reel_scripts.map((s, i) => `Reel ${i + 1}:\nHook: ${s.hook}\n\nScript:\n${s.script}\n\nVisual Idea: ${s.visual_idea}\n\nCTA: ${s.cta}`).join('\n\n---\n\n');
  };

  const getAdCopiesText = (r: ContentResult) => {
    return r.ad_copies.map((a, i) => `Ad ${i + 1}:\nHeadline: ${a.headline}\n\n${a.primary_text}\n\nCTA: ${a.cta}`).join('\n\n---\n\n');
  };

  const getWhatsAppText = (r: ContentResult) => {
    return r.whatsapp_promos.map((w, i) => `WhatsApp ${i + 1}:\n${w.message}\n\nFollow-up:\n${w.follow_up}`).join('\n\n---\n\n');
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <ToolPageHeader
        icon={<PenTool className="w-6 h-6 text-white" />}
        title="AI Content Generator"
        description="Generate captions, reels, ads, WhatsApp messages, and content calendars for any business."
        gradient="from-blue-600 to-cyan-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Form & History */}
        <div className="lg:col-span-4 space-y-6">

          {/* Form Card */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Content Details</h2>
              {currentResult && (
                <button
                  onClick={resetForm}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> New Plan
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
                  placeholder="Example: FitPro Studio"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm ${
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
                  placeholder="Example: Gym, Cafe, Real Estate, SaaS, Agency, Freelancer"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm ${
                    errors.businessType ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.businessType && <p className="text-red-400 text-xs mt-1">{errors.businessType}</p>}
              </div>

              {/* Product / Offer */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Product / Service / Offer</label>
                <input
                  type="text"
                  name="offer"
                  value={formData.offer}
                  onChange={handleInputChange}
                  placeholder="Example: 12-week body transformation program"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm ${
                    errors.offer ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.offer && <p className="text-red-400 text-xs mt-1">{errors.offer}</p>}
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Example: Busy working professionals aged 22–35"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm ${
                    errors.targetAudience ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.targetAudience && <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>}
              </div>

              {/* Platform & Goal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Platform</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  >
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>YouTube</option>
                    <option>WhatsApp</option>
                    <option>X / Twitter</option>
                    <option>Multi-platform</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Main Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  >
                    <option>Get more leads</option>
                    <option>Increase sales</option>
                    <option>Build brand awareness</option>
                    <option>Promote an offer</option>
                    <option>Educate audience</option>
                    <option>Increase engagement</option>
                    <option>Launch product/service</option>
                  </select>
                </div>
              </div>

              {/* Tone & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  >
                    <option>Professional</option>
                    <option>Premium</option>
                    <option>Friendly</option>
                    <option>Bold</option>
                    <option>Conversational</option>
                    <option>Persuasive</option>
                    <option>Funny</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Duration</label>
                  <select
                    name="contentDuration"
                    value={formData.contentDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  >
                    <option>7 days</option>
                    <option>15 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>

              {/* Extra Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Extra Notes <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                </label>
                <textarea
                  name="extraNotes"
                  value={formData.extraNotes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Example: Mention free consultation, limited slots, discount offer, WhatsApp contact, or local audience."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm resize-none hover:border-white/20"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gradient py-3 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Content Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History Card */}
          {savedPlans.length > 0 && (
            <div className="glass-card rounded-2xl border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Content Plans</h2>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {savedPlans.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadSavedPlan(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      currentResult && currentResult.id === item.id
                        ? 'bg-cyan-600/10 border-cyan-500/35 text-cyan-300'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold truncate">{item.businessName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.platform} • {item.goal} • {item.timestamp.split(',')[0]}</p>
                    </div>
                    <button
                      onClick={(e) => deletePlan(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Loading, Error, Empty, or Results */}
        <div className="lg:col-span-8">

          {isLoading && (
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <LoadingState message="Crafting your content strategy with AI..." />
            </div>
          )}

          {apiError && !isLoading && (
            <div className="glass-card rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Content Generation Failed</h3>
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
              title="Awaiting Content Parameters"
              description="Fill out your business details on the left, then click 'Generate Content Plan' to get platform-specific captions, reel scripts, ad copies, WhatsApp promos, and a full content calendar."
              icon={<PenTool className="w-10 h-10 text-cyan-400 animate-pulse" />}
            />
          )}

          {currentResult && !isLoading && !apiError && (
            <div className="space-y-6">

              {/* Result Header Panel */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {currentResult.isDemoMode ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">Demo Mode — Mock AI</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Gemini AI Active</span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500">{currentResult.platform} • {currentResult.goal}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{currentResult.businessName}</h2>
                  <p className="text-xs text-slate-500">Generated on {currentResult.timestamp}</p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <CopyButton text={getFullPlanText(currentResult)} label="Full Plan" />
                  <CopyButton text={getCaptionsText(currentResult)} label="Captions" />
                  <CopyButton text={getReelScriptsText(currentResult)} label="Reels" />
                  <CopyButton text={getAdCopiesText(currentResult)} label="Ads" />
                  <CopyButton text={getWhatsAppText(currentResult)} label="WhatsApp" />
                </div>
              </div>

              {/* Content Strategy Card */}
              <div className="glass-card rounded-2xl border border-cyan-500/10 bg-cyan-500/2 p-6 hover:border-cyan-500/20 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                    <Target className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Content Strategy</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{currentResult.content_strategy.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Audience Angle</p>
                    <p className="text-xs text-slate-300">{currentResult.content_strategy.target_audience_angle}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Main Message</p>
                    <p className="text-xs text-slate-300">{currentResult.content_strategy.main_message}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Platform</p>
                    <p className="text-xs text-slate-300">{currentResult.content_strategy.recommended_platform}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Posting Frequency</p>
                    <p className="text-xs text-slate-300">{currentResult.content_strategy.posting_frequency}</p>
                  </div>
                </div>
              </div>

              {/* Post Ideas Card */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-violet-500/20 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Post Ideas</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentResult.post_ideas.map((idea, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-violet-500/15 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded">{idea.content_type}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{idea.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{idea.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Captions Card */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-blue-500/20 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Ready-to-Post Captions</h3>
                </div>
                <div className="space-y-4">
                  {currentResult.captions.map((cap, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-slate-200 leading-relaxed mb-3">{cap.caption}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs font-semibold text-blue-400">{cap.cta}</p>
                        <div className="flex flex-wrap gap-1">
                          {cap.hashtags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/30 text-blue-400 border border-blue-500/10 flex items-center gap-0.5">
                              <Hash className="w-2.5 h-2.5" />{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reel Scripts & Ad Copies side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Reel Scripts */}
                <div className="glass-card rounded-2xl border border-pink-500/10 bg-pink-500/2 p-6 hover:border-pink-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                      <Film className="w-4 h-4 text-pink-400" />
                    </div>
                    <h3 className="font-bold text-white text-base">Reel Scripts</h3>
                  </div>
                  <div className="space-y-4">
                    {currentResult.reel_scripts.map((reel, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-0.5">Hook</p>
                          <p className="text-xs text-slate-200 font-medium italic">{reel.hook}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Script</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{reel.script}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Visual Idea</p>
                          <p className="text-xs text-slate-400">{reel.visual_idea}</p>
                        </div>
                        <p className="text-xs font-semibold text-pink-400 pt-1">{reel.cta}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ad Copies */}
                <div className="glass-card rounded-2xl border border-amber-500/10 bg-amber-500/2 p-6 hover:border-amber-500/20 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <Megaphone className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-white text-base">Ad Copies</h3>
                  </div>
                  <div className="space-y-4">
                    {currentResult.ad_copies.map((ad, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2">
                        <h4 className="text-sm font-bold text-white">{ad.headline}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{ad.primary_text}</p>
                        <p className="text-xs font-semibold text-amber-400 pt-1">{ad.cta}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* WhatsApp Promos */}
              <div className="glass-card rounded-2xl border border-emerald-500/10 bg-emerald-500/2 p-6 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">WhatsApp Promos</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentResult.whatsapp_promos.map((wp, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Initial Message</p>
                        <p className="text-xs text-slate-200 leading-relaxed">{wp.message}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Follow-up</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{wp.follow_up}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Calendar */}
              <div className="glass-card rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Content Calendar</h3>
                </div>

                {/* Timeline layout */}
                <div className="relative pl-6 border-l border-white/10 space-y-4 ml-3">
                  {currentResult.content_calendar.map((entry, i) => (
                    <div key={i} className="relative group">
                      <span className="absolute -left-[37px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#050816] border border-indigo-500 text-[10px] font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                        {i + 1}
                      </span>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{entry.day}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/15">{entry.platform}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{entry.content_type}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium mb-1">{entry.topic}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{entry.caption}</p>
                        <p className="text-[10px] font-semibold text-indigo-400 mt-1.5">{entry.cta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Performing Angles */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 hover:border-cyan-500/20 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-white text-base">Best Performing Angles</h3>
                </div>
                <ul className="space-y-3">
                  {currentResult.best_performing_angles.map((angle, i) => (
                    <li key={i} className="flex gap-2.5 text-slate-300 text-sm leading-relaxed">
                      <span className="text-cyan-400 font-bold font-mono">{i + 1}.</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Final Recommendation Card */}
              <div className="glass-card rounded-2xl border-l-4 border-l-emerald-500 border-t border-r border-b border-white/10 bg-emerald-950/5 p-6 shadow-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Award className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-emerald-400 text-base">Final Recommendation</h3>
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

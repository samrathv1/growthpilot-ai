'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ToolPageHeader from '@/components/tools/ToolPageHeader';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import CopyButton from '@/components/ui/CopyButton';
import ExpertReviewModal from '@/components/tools/ExpertReviewModal';
import { 
  HeroPreview,
  ProblemPreview,
  SolutionPreview,
  BenefitsPreview,
  FeaturesPreview,
  ProcessPreview,
  SocialProofPreview,
  FAQPreview,
  FinalCTAPreview,
  LandingPageData
} from '@/components/tools/PreviewComponents';
import { 
  FileText, 
  AlertTriangle, 
  History, 
  Trash2, 
  Sparkles, 
  PlusCircle, 
  Copy,
  Laptop,
  CheckCircle,
  Mail,
  Sliders,
  Send,
  Eye,
  Award
} from 'lucide-react';

interface SavedLandingPage {
  id: string;
  timestamp: string;
  businessName: string;
  landingPageType: string;
  offer: string;
  selectedLayout: 'lead_gen' | 'saas' | 'service';
  data: LandingPageData & { isDemoMode?: boolean };
}

export default function LandingPageGeneratorPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    offer: '',
    targetAudience: '',
    mainGoal: 'Get more leads',
    landingPageType: 'Lead Generation Landing Page',
    designStyle: 'Dark Premium',
    tone: 'Persuasive',
    cta: '',
    extraNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<LandingPageData & { isDemoMode?: boolean } | null>(null);
  const [activeLayout, setActiveLayout] = useState<'lead_gen' | 'saas' | 'service'>('lead_gen');
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedPages, setSavedPages] = useState<SavedLandingPage[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);

  // Load saved history
  useEffect(() => {
    const history = localStorage.getItem('growthpilot_landing_pages');
    if (history) {
      try {
        setSavedPages(JSON.parse(history));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

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
    if (!formData.offer.trim()) newErrors.offer = 'Product/Service Offer is required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target Audience is required';
    if (!formData.cta.trim()) newErrors.cta = 'CTA Button Text is required';
    return newErrors;
  };

  const saveToHistory = (id: string, pageData: LandingPageData & { isDemoMode?: boolean }, layout: 'lead_gen' | 'saas' | 'service') => {
    const newPage: SavedLandingPage = {
      id,
      timestamp: new Date().toLocaleString(),
      businessName: formData.businessName,
      landingPageType: formData.landingPageType,
      offer: formData.offer,
      selectedLayout: layout,
      data: pageData
    };
    const updated = [newPage, ...savedPages.filter((item) => item.id !== id)].slice(0, 10);
    setSavedPages(updated);
    localStorage.setItem('growthpilot_landing_pages', JSON.stringify(updated));
  };

  const deleteSavedPage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPages.filter((item) => item.id !== id);
    setSavedPages(updated);
    localStorage.setItem('growthpilot_landing_pages', JSON.stringify(updated));
    if (currentResultId === id) {
      setCurrentResult(null);
      setCurrentResultId(null);
    }
  };

  const loadSavedPage = (page: SavedLandingPage) => {
    setCurrentResult(page.data);
    setCurrentResultId(page.id);
    setActiveLayout(page.selectedLayout);
    setFormData({
      businessName: page.businessName,
      businessType: page.data.hero.headline.includes(page.businessName) ? 'Gym' : 'Startup', // Fallback or approximation
      offer: page.offer,
      targetAudience: page.data.problem_section.description.includes('moms') ? 'Moms' : 'Professionals', // Approximation
      mainGoal: page.data.target_goal || 'Get more leads',
      landingPageType: page.landingPageType,
      designStyle: 'Dark Premium',
      tone: 'Persuasive',
      cta: page.data.hero.primary_cta,
      extraNotes: ''
    });
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setCurrentResult(null);
    setCurrentResultId(null);

    try {
      const res = await fetch('/api/landing-page-generator', {
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
            throw new Error(json.error || 'Failed to generate landing page copy');
          }
          data = json.content;
        } catch (parseErr: any) {
          throw new Error(parseErr.message || 'Failed to parse response data.');
        }
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned error status ${res.status}`);
      }

      setCurrentResult(data);
      
      const newId = Math.random().toString(36).substr(2, 9);
      setCurrentResultId(newId);

      // Determine default layout from recommendations
      let initialLayout: 'lead_gen' | 'saas' | 'service' = 'lead_gen';
      const rec = String(data.recommended_layout).toLowerCase();
      if (rec.includes('saas') || rec.includes('product')) {
        initialLayout = 'saas';
      } else if (rec.includes('brand') || rec.includes('service')) {
        initialLayout = 'service';
      }
      setActiveLayout(initialLayout);

      // Save page state
      saveToHistory(newId, data, initialLayout);
    } catch (err) {
      console.error(err);
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      businessType: '',
      offer: '',
      targetAudience: '',
      mainGoal: 'Get more leads',
      landingPageType: 'Lead Generation Landing Page',
      designStyle: 'Dark Premium',
      tone: 'Persuasive',
      cta: '',
      extraNotes: ''
    });
    setCurrentResult(null);
    setCurrentResultId(null);
    setApiError(null);
  };

  const updateLayoutAndHistory = (layout: 'lead_gen' | 'saas' | 'service') => {
    setActiveLayout(layout);
    if (currentResult && currentResultId) {
      saveToHistory(currentResultId, currentResult, layout);
    }
  };

  // Content copying helpers
  const getFullCopyText = (res: LandingPageData) => {
    return `LANDING PAGE COPY: ${res.page_title.toUpperCase()}
Goal: ${res.target_goal}
Recommended Layout: ${res.recommended_layout}

--- HERO SECTION ---
Headline: ${res.hero.headline}
Subheadline: ${res.hero.subheadline}
Primary CTA: ${res.hero.primary_cta}
Secondary CTA: ${res.hero.secondary_cta}

--- PROBLEM SECTION ---
Heading: ${res.problem_section.heading}
Description: ${res.problem_section.description}
Pain Points:
${res.problem_section.pain_points.map((p, i) => `- ${p}`).join('\n')}

--- SOLUTION SECTION ---
Heading: ${res.solution_section.heading}
Description: ${res.solution_section.description}

--- BENEFITS ---
${res.benefits.map((b, i) => `[${b.title}] ${b.description}`).join('\n')}

--- FEATURES ---
${res.features.map((f, i) => `[${f.title}] ${f.description}`).join('\n')}

--- SOCIAL PROOF ---
Heading: ${res.social_proof.heading}
Testimonials:
${res.social_proof.testimonial_examples.map((t) => `"${t.quote}" - ${t.name} (${t.role})`).join('\n\n')}

--- PROCESS ---
${res.process_steps.map((s) => `${s.step}. ${s.title}: ${s.description}`).join('\n')}

--- FAQ ---
${res.faq.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}

--- FINAL CTA ---
Heading: ${res.final_cta.heading}
Subheading: ${res.final_cta.subheading}
CTA Text: ${res.final_cta.button_text}
`;
  };

  const getHeroCopyText = (res: LandingPageData) => {
    return `Hero Headline: ${res.hero.headline}\nHero Subheadline: ${res.hero.subheadline}\nCTA: ${res.hero.primary_cta}`;
  };

  const getFaqCopyText = (res: LandingPageData) => {
    return res.faq.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
  };

  const getSeoCopyText = (res: any) => {
    if (!res.seo) return 'No SEO Metadata generated.';
    return `Meta Title: ${res.seo.meta_title}\nMeta Description: ${res.seo.meta_description}\nKeywords: ${res.seo.keywords ? res.seo.keywords.join(', ') : ''}`;
  };

  return (
    <DashboardLayout>
      <ToolPageHeader
        icon={<Laptop className="w-6 h-6 text-white" />}
        title="AI Landing Page Generator"
        description="Fill in your product and audience criteria to automatically generate high-converting copy layout and review it inside real-time layout previews."
        gradient="from-indigo-600 to-blue-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form & Saved History */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Inputs Card */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Page Parameters</h2>
              {currentResult && (
                <button 
                  onClick={resetForm}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Start New
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Business Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Example: FitPro Studio"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs ${
                    errors.businessName ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.businessName && <p className="text-red-400 text-[10px] mt-1">{errors.businessName}</p>}
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Business Type</label>
                <input
                  type="text"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="Example: Gym, SaaS, Agency, Cafe"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs ${
                    errors.businessType ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.businessType && <p className="text-red-400 text-[10px] mt-1">{errors.businessType}</p>}
              </div>

              {/* Offer */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Your Offer / Program</label>
                <input
                  type="text"
                  name="offer"
                  value={formData.offer}
                  onChange={handleInputChange}
                  placeholder="Example: 12-week body transformation program"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs ${
                    errors.offer ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.offer && <p className="text-red-400 text-[10px] mt-1">{errors.offer}</p>}
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Example: Working professionals aged 22-35"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs ${
                    errors.targetAudience ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.targetAudience && <p className="text-red-400 text-[10px] mt-1">{errors.targetAudience}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Main Goal */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Main Goal</label>
                  <select
                    name="mainGoal"
                    value={formData.mainGoal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                  >
                    <option>Get more leads</option>
                    <option>Sell a product</option>
                    <option>Book more calls</option>
                    <option>Promote a service</option>
                    <option>Launch a startup/product</option>
                    <option>Build personal brand</option>
                    <option>Collect event/webinar registrations</option>
                  </select>
                </div>

                {/* Landing Page Type */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Page Type</label>
                  <select
                    name="landingPageType"
                    value={formData.landingPageType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                  >
                    <option>Lead Generation Landing Page</option>
                    <option>SaaS Product Landing Page</option>
                    <option>Agency / Service Landing Page</option>
                    <option>Personal Brand Landing Page</option>
                    <option>E-commerce Product Landing Page</option>
                    <option>Real Estate Landing Page</option>
                    <option>Event / Webinar Landing Page</option>
                    <option>Portfolio Landing Page</option>
                    <option>App Launch Landing Page</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Design Style */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Design Style</label>
                  <select
                    name="designStyle"
                    value={formData.designStyle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                  >
                    <option>Dark Premium</option>
                    <option>Clean Minimal</option>
                    <option>Bold Startup</option>
                    <option>Luxury</option>
                    <option>Professional Corporate</option>
                    <option>Friendly Modern</option>
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Writing Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                  >
                    <option>Professional</option>
                    <option>Premium</option>
                    <option>Friendly</option>
                    <option>Bold</option>
                    <option>Conversational</option>
                    <option>Persuasive</option>
                  </select>
                </div>
              </div>

              {/* Call To Action */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">CTA Button Text</label>
                <input
                  type="text"
                  name="cta"
                  value={formData.cta}
                  onChange={handleInputChange}
                  placeholder="Example: Book Free Consultation"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs ${
                    errors.cta ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {errors.cta && <p className="text-red-400 text-[10px] mt-1">{errors.cta}</p>}
              </div>

              {/* Extra Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">Extra Notes (Optional)</label>
                <textarea
                  name="extraNotes"
                  value={formData.extraNotes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Example: Mention limited seats, 100% money-back guarantee, or WhatsApp support."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gradient py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Landing Page...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Landing Page
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Saved Pages history */}
          {savedPages.length > 0 && (
            <div className="glass-card rounded-2xl border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Landing Pages</h2>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {savedPages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadSavedPage(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      currentResultId === item.id
                        ? 'bg-indigo-600/10 border-indigo-500/35 text-indigo-300'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold truncate">{item.businessName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.offer} • {item.timestamp.split(',')[0]}</p>
                    </div>
                    <button
                      onClick={(e) => deleteSavedPage(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Copy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Loading, Error, Empty, or Preview Output */}
        <div className="lg:col-span-8">
          
          {isLoading && (
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <LoadingState message="Writing copy & framing responsive landing page..." />
            </div>
          )}

          {apiError && !isLoading && (
            <div className="glass-card rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center animate-fade-in">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Generation Failed</h3>
              <p className="text-slate-450 text-xs max-w-md mx-auto mb-6">{apiError}</p>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-650/20 text-red-300 border border-red-500/30 hover:bg-red-650/30 transition-all font-semibold text-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !apiError && !currentResult && (
            <EmptyState
              title="Awaiting Landing Page Criteria"
              description="Enter your target offer and style metrics on the left, then click 'Generate Landing Page' to draft copywriting sections, recommend a layout, configure SEO, and review a live visual page layout."
              icon={<Laptop className="w-10 h-10 text-indigo-400 animate-pulse" />}
            />
          )}

          {currentResult && !isLoading && !apiError && (
            <div className="space-y-6">
              
              {/* Output Controls Panel */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {currentResult.isDemoMode ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">Demo Mode — Mock AI</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Gemini AI Active</span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500">Score: {currentResult.expert_review_summary?.conversion_score || 85}/100</span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight">Landing Page Copy Frame</h2>
                    <p className="text-xs text-slate-400">Recommend: {currentResult.recommended_layout}</p>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" /> Request Review
                    </button>
                    <button 
                      onClick={() => setIsReviewModalOpen(true)} // Prefills/opens build website
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Build Full Website
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Section copy buttons grid */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <CopyButton text={getFullCopyText(currentResult)} label="Copy All Copy" />
                    <CopyButton text={getHeroCopyText(currentResult)} label="Hero Section" />
                    <CopyButton text={getFaqCopyText(currentResult)} label="FAQs" />
                    <CopyButton text={getSeoCopyText(currentResult)} label="SEO Meta" />
                  </div>

                  {/* Layout Selector */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
                    <button
                      onClick={() => updateLayoutAndHistory('lead_gen')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                        activeLayout === 'lead_gen'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      Lead Gen
                    </button>
                    <button
                      onClick={() => updateLayoutAndHistory('saas')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                        activeLayout === 'saas'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      SaaS
                    </button>
                    <button
                      onClick={() => updateLayoutAndHistory('service')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                        activeLayout === 'service'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      Brand
                    </button>
                  </div>

                </div>

              </div>

              {/* Conversion Analysis Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Expert Review Card */}
                <div className="glass-card rounded-2xl border border-violet-500/10 bg-violet-500/2 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-violet-400" />
                    <h3 className="text-xs font-bold text-violet-300 uppercase tracking-widest">Conversion Strategy</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">"{currentResult.layout_reason}"</p>
                  
                  {currentResult.expert_review_summary?.what_to_improve && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Suggested Optimizations:</p>
                      <ul className="space-y-1">
                        {currentResult.expert_review_summary.what_to_improve.map((item, idx) => (
                          <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-violet-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* SEO Metatags Card */}
                {currentResult.seo && (
                  <div className="glass-card rounded-2xl border border-cyan-500/10 bg-cyan-500/2 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">SEO Metadata</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Meta Title:</p>
                        <p className="text-xs text-slate-200 font-bold truncate">{currentResult.seo.meta_title}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Meta Description:</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{currentResult.seo.meta_description}</p>
                      </div>
                      {currentResult.seo.keywords && (
                        <div>
                          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {currentResult.seo.keywords.map((word) => (
                              <span key={word} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/20 text-cyan-400 border border-cyan-500/10">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* LIVE PREVIEW CANVAS */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#03060f]">
                <div className="px-6 py-4 border-b border-white/5 bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="px-3 py-1 rounded bg-white/5 text-[10px] font-mono text-slate-500 truncate max-w-xs">
                    preview://{formData.businessName.toLowerCase().replace(/\s+/g, '-') || 'growthpilot'}.ai
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Laptop className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">{activeLayout.replace('_', ' ')} Layout</span>
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  <HeroPreview data={currentResult} layout={activeLayout} onCtaClick={() => setIsReviewModalOpen(true)} />
                  <ProblemPreview data={currentResult} layout={activeLayout} />
                  <SolutionPreview data={currentResult} layout={activeLayout} />
                  <BenefitsPreview data={currentResult} layout={activeLayout} />
                  <FeaturesPreview data={currentResult} layout={activeLayout} />
                  <ProcessPreview data={currentResult} layout={activeLayout} />
                  <SocialProofPreview data={currentResult} layout={activeLayout} />
                  <FAQPreview data={currentResult} layout={activeLayout} />
                  <FinalCTAPreview data={currentResult} layout={activeLayout} onCtaClick={() => setIsReviewModalOpen(true)} />
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Expert Review Overlay Modal */}
      {currentResult && (
        <ExpertReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          businessName={formData.businessName || currentResult.page_title}
          offer={formData.offer || currentResult.page_title}
          businessType={formData.businessType}
          landingPageType={formData.landingPageType}
          selectedLayout={activeLayout}
          generatedHeadline={currentResult.hero.headline}
          generatedSubheadline={currentResult.hero.subheadline}
          conversionScore={currentResult.expert_review_summary?.conversion_score || 85}
          aiBestNextAction={currentResult.expert_review_summary?.best_next_action || 'N/A'}
          generatedLandingPageData={currentResult}
        />
      )}

    </DashboardLayout>
  );
}

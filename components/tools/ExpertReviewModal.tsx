'use client';

import { useState } from 'react';
import { X, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ExpertReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  offer: string;
  businessType?: string;
  landingPageType?: string;
  selectedLayout?: 'lead_gen' | 'saas' | 'service';
  generatedHeadline?: string;
  generatedSubheadline?: string;
  conversionScore?: number;
  aiBestNextAction?: string;
  generatedLandingPageData?: any;
  targetAudience?: string;
  tone?: string;
  mainGoal?: string;
  toolName?: string;
}

export default function ExpertReviewModal({ 
  isOpen, 
  onClose, 
  businessName, 
  offer,
  businessType = '',
  landingPageType = '',
  selectedLayout = 'lead_gen',
  generatedHeadline = '',
  generatedSubheadline = '',
  conversionScore = 85,
  aiBestNextAction = 'N/A',
  generatedLandingPageData = {},
  targetAudience = '',
  tone = '',
  mainGoal = '',
  toolName = 'Landing Page Generator'
}: ExpertReviewModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    budget: 'Under ₹25,000 / $300',
    timeline: '1-2 Weeks',
    requestType: 'Build this as a full website',
    extraRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailFailed, setIsEmailFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      setError('Please fill in Name, Email, and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setIsEmailFailed(false);

    const fullPayload = {
      ...formData,
      businessName,
      offer,
      businessType,
      landingPageType,
      selectedLayout,
      generatedHeadline,
      generatedSubheadline,
      conversionScore,
      aiBestNextAction,
      generatedLandingPageData,
      targetAudience,
      tone,
      mainGoal,
      toolName,
      createdAt: new Date().toLocaleString(),
    };

    // 1. Save locally as backup
    try {
      const existing = localStorage.getItem('reviewRequests');
      let requests = [];
      if (existing) {
        try {
          requests = JSON.parse(existing);
        } catch (err) {
          console.error('Failed to parse local review requests', err);
        }
      }
      requests.push(fullPayload);
      localStorage.setItem('reviewRequests', JSON.stringify(requests));
    } catch (localErr) {
      console.error('Failed to save request locally:', localErr);
    }

    // 2. Call backend route /api/review-request
    try {
      const res = await fetch('/api/review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'SMTP delivery failed');
      }

      setIsSuccess(true);
      setHasSubmitted(true);
    } catch (err: any) {
      console.error('Email notification failed:', err);
      setIsEmailFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Content Card with Scroll Constraints */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-white/10 p-6 md:p-8 animate-slide-up z-10 shadow-2xl max-h-[90vh] flex flex-col my-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess && !isEmailFailed ? (
          <>
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-lg font-extrabold text-white mb-1.5">🚀 Request Custom Review / Build</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Get a custom review from GrowthPilot AI to refine your generated copy, improve conversion layout, or build a complete live website for <strong className="text-indigo-400">{businessName}</strong>.
              </p>
            </div>

            {error && (
              <div className="mb-3 text-[11px] font-semibold text-red-400 bg-red-500/5 border border-red-500/10 p-2.5 rounded-xl flex-shrink-0">
                {error}
              </div>
            )}

            {/* Scrollable Form Viewport */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1.5 space-y-4 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@company.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">WhatsApp / Phone *</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Budget */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">Est. Project Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                  >
                    <option>Under ₹25,000 / $300</option>
                    <option>₹25k - ₹60k / $300 - $700</option>
                    <option>₹60k - ₹1.2L / $700 - $1,500</option>
                    <option>₹1.2L+ / $1,500+</option>
                  </select>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">Target Launch</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                  >
                    <option>Under 1 Week</option>
                    <option>1-2 Weeks</option>
                    <option>2-4 Weeks</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">Project Direction</label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0a0f1e] border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs"
                >
                  <option>Expert review only</option>
                  <option>Build this as a full website</option>
                  <option>Add chatbot + automation also</option>
                </select>
              </div>

              {/* Extra requirements */}
              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">Extra Requirements (Optional)</label>
                <textarea
                  name="extraRequirements"
                  value={formData.extraRequirements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Include branding guidelines, custom graphics, domains needed, or specific integrations..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-xs resize-none"
                />
              </div>

              {/* Submit - Fixed Footer container */}
              <div className="pt-2 flex-shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting || hasSubmitted}
                  className="w-full btn-gradient py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending request...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : isEmailFailed ? (
          <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto text-yellow-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Review Saved Locally</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
              Request saved locally, but email notification failed. Please try again later.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-350 hover:text-slate-200 text-xs transition-all font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Review Request Received</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
              Request sent successfully. I will review your landing page and contact you soon.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-[#090d16] hover:bg-white/5 border border-white/10 text-slate-350 hover:text-slate-200 text-xs transition-all font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

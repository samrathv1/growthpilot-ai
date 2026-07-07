'use client';

import { useState, FormEvent } from 'react';
import GradientButton from '@/components/ui/GradientButton';
import { AlertCircle } from 'lucide-react';

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  rows?: number;
}

interface ToolFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
  submitLabel?: string;
}

export default function ToolForm({ fields, onSubmit, isLoading, submitLabel = 'Generate with AI' }: ToolFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required !== false && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => {
          const isFullWidth = field.type === 'textarea' || field.id === 'query';
          return (
            <div key={field.id} className={`flex flex-col gap-1.5 ${isFullWidth ? 'md:col-span-2' : ''}`}>
              <label htmlFor={field.id} className="text-sm font-medium text-slate-300">
                {field.label}
                {field.required !== false && (
                  <span className="text-violet-400 ml-1">*</span>
                )}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm resize-none ${
                    errors[field.id] ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors[field.id] ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <option value="" disabled className="text-slate-600">{field.placeholder}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0a0f1e]">{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                    errors[field.id] ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                />
              )}

              {errors[field.id] && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <GradientButton
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>✨ {submitLabel}</>
          )}
        </GradientButton>
      </div>
    </form>
  );
}

import { ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function GradientButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: GradientButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: 'btn-gradient text-white font-semibold rounded-xl',
    secondary:
      'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5',
    outline:
      'border border-violet-500/60 text-violet-300 hover:bg-violet-500/10 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${sizes[size]} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      {...props}
    >
      {children}
    </button>
  );
}

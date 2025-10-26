import { forwardRef, type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'gradient';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)]',
      success: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      error: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]',
      warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      info: 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_0_15px_rgba(102,126,234,0.3)]',
      gradient: 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    };
    
    return (
      <div
        ref={ref}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';


import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#000a14] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';
    
    const variants = {
      default: 'bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:shadow-lg',
      primary: 'bg-gradient-to-r from-[#00527d] to-[#001477] text-white hover:shadow-[0_0_30px_rgba(0,82,125,0.4)] focus:ring-[#00527d]',
      secondary: 'bg-gradient-to-r from-[#004268] to-[#001060] text-white hover:shadow-[0_0_30px_rgba(0,66,104,0.4)] focus:ring-[#004268]',
      outline: 'border-2 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.3)]',
      ghost: 'text-white hover:bg-[rgba(255,255,255,0.05)]',
      destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      gradient: 'bg-gradient-to-r from-[#00527d] to-[#001477] text-white hover:shadow-[0_0_30px_rgba(0,82,125,0.4)]',
    };
    
    const sizes = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';


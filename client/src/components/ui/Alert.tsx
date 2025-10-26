import { forwardRef, type HTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white',
      success: 'bg-[rgba(16,185,129,0.1)] border-emerald-500/30 text-emerald-300',
      error: 'bg-[rgba(239,68,68,0.1)] border-red-500/30 text-red-300',
      warning: 'bg-[rgba(245,158,11,0.1)] border-amber-500/30 text-amber-300',
      info: 'bg-[rgba(102,126,234,0.1)] border-[#667eea]/30 text-blue-300',
    };
    
    const icons = {
      default: <Info className="w-6 h-6" />,
      success: <CheckCircle className="w-6 h-6" />,
      error: <XCircle className="w-6 h-6" />,
      warning: <AlertCircle className="w-6 h-6" />,
      info: <Info className="w-6 h-6" />,
    };
    
    return (
      <div
        ref={ref}
        className={`flex gap-4 p-5 border-2 rounded-2xl backdrop-blur-md shadow-lg ${variants[variant]} ${className}`}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icons[variant]}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h5 ref={ref} className={`font-bold text-lg mb-2 ${className}`} {...props}>
        {children}
      </h5>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`text-base leading-relaxed ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';


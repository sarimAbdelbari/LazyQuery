import { HTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-800 border-gray-700 text-gray-200',
      success: 'bg-green-900/20 border-green-700 text-green-200',
      error: 'bg-red-900/20 border-red-700 text-red-200',
      warning: 'bg-yellow-900/20 border-yellow-700 text-yellow-200',
      info: 'bg-blue-900/20 border-blue-700 text-blue-200',
    };
    
    const icons = {
      default: <Info className="w-5 h-5" />,
      success: <CheckCircle className="w-5 h-5" />,
      error: <XCircle className="w-5 h-5" />,
      warning: <AlertCircle className="w-5 h-5" />,
      info: <Info className="w-5 h-5" />,
    };
    
    return (
      <div
        ref={ref}
        className={`flex gap-3 p-4 border rounded-lg ${variants[variant]} ${className}`}
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
      <h5 ref={ref} className={`font-semibold mb-1 ${className}`} {...props}>
        {children}
      </h5>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`text-sm ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';


import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, label, className = '', disabled, ...props }, ref) => {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-white cursor-pointer select-none">
            {label}
          </label>
        )}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:ring-offset-2 focus:ring-offset-[#001029]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${checked ? 'bg-[#00527d]' : 'bg-[rgba(255,255,255,0.2)]'}
            ${!disabled && 'hover:bg-opacity-80'}
          `}
          {...props}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';


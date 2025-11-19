import { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ value, options, onChange, label, placeholder = 'Select...', className = '', ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div ref={selectRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full flex items-center justify-between gap-2 px-3 py-2
              bg-[rgba(0,82,125,0.03)] border border-[rgba(255,255,255,0.1)]
              rounded-lg text-white text-sm font-medium
              hover:bg-[rgba(0,82,125,0.05)] hover:border-[rgba(255,255,255,0.2)]
              focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:ring-offset-2 focus:ring-offset-[#001029]
              transition-all duration-200
            `}
          >
            <span className={selectedOption ? 'text-white' : 'text-[rgba(255,255,255,0.5)]'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[#001029] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg overflow-hidden">
              <div className="max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full text-left px-3 py-2 text-sm text-white
                      hover:bg-[rgba(0,82,125,0.1)]
                      focus:outline-none focus:bg-[rgba(0,82,125,0.1)]
                      transition-colors
                      ${value === option.value ? 'bg-[rgba(0,82,125,0.15)] font-medium' : ''}
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';


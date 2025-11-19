import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = ({ title, children, defaultOpen = false, className = '' }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-[rgba(255,255,255,0.1)] ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:ring-offset-2 focus:ring-offset-[#001029] rounded"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="py-2 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};


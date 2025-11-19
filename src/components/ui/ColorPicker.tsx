import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import type { HTMLAttributes } from 'react';

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker = ({ value, onChange, label, className = '', ...props }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 200;
      const popoverHeight = 150;
      const padding = 8;
      
      // Calculate position - prefer below, but adjust if needed
      let top = rect.bottom + window.scrollY + padding;
      let left = rect.left + window.scrollX;
      
      // Adjust if popover would go off-screen to the right
      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - padding;
      }
      
      // Adjust if popover would go off-screen to the bottom
      if (top + popoverHeight > window.innerHeight + window.scrollY) {
        // Position above the button instead
        top = rect.top + window.scrollY - popoverHeight - padding;
        // If still off-screen at top, position at top of viewport
        if (top < window.scrollY) {
          top = window.scrollY + padding;
        }
      }
      
      // Ensure it doesn't go off-screen to the left
      if (left < window.scrollX) {
        left = window.scrollX + padding;
      }
      
      setPosition({ top, left });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  return (
    <>
      <div className={`relative ${className}`} {...props}>
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="flex items-center gap-3">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-10 h-10 rounded-lg border-2 border-[rgba(255,255,255,0.2)]
              hover:border-[rgba(255,255,255,0.3)] transition-all
              focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:ring-offset-2 focus:ring-offset-[#001029]
              shadow-sm
            `}
            style={{ backgroundColor: value }}
            aria-label="Pick a color"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              flex-1 px-3 py-2 bg-[rgba(0,82,125,0.03)] border border-[rgba(255,255,255,0.1)]
              rounded-lg text-white text-sm font-mono
              hover:bg-[rgba(0,82,125,0.05)] hover:border-[rgba(255,255,255,0.2)]
              focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:ring-offset-2 focus:ring-offset-[#001029]
              transition-all duration-200
            `}
            placeholder="#000000"
          />
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed z-[9999] p-3 bg-[#001029] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div style={{ width: '200px', height: '150px' }}>
              <HexColorPicker
                color={value || '#000000'}
                onChange={onChange}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};


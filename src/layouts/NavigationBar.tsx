/**
 * NavigationBar Component
 * Glassmorphism-styled navigation bar with back button functionality
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { generatePath } from '../lib/types/routing';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const handleBackClick = () => {
    navigate(generatePath.home());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl shadow-[0_0_20px_rgba(102,126,234,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg tracking-tight">LazyQuery</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {!isHomePage && (
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] rounded-xl transition-all duration-300 text-white font-semibold hover:scale-[1.02]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Demos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


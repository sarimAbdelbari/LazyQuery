/**
 * NavigationBar Component
 * Glassmorphism-styled navigation bar with back button functionality
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Github } from 'lucide-react';
import { generatePath } from '../lib/types/routing';
import whiteLogo from '../assets/whiteLogo.svg';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const handleBackClick = () => {
    navigate(generatePath.home());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-[rgba(0,82,125,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 h-11">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl ">
              <img src={whiteLogo} alt="LazyQuery" className="h-22 pt-1 w-auto" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {/* Documentation Link */}
            <a
              href="https://docs.lazyquery.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(0,82,125,0.03)] hover:bg-[rgba(0,82,125,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[#00527d] rounded-xl transition-all duration-300 text-white font-medium hover:scale-[1.02] group"
            >
              <BookOpen className="w-4 h-4 group-hover:text-[#00527d] transition-colors" />
              <span className="hidden sm:inline">Documentation</span>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/lazyquery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(0,82,125,0.03)] hover:bg-[rgba(0,82,125,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[#00527d] rounded-xl transition-all duration-300 text-white font-medium hover:scale-[1.02] group"
            >
              <Github className="w-4 h-4 group-hover:text-[#00527d] transition-colors" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {!isHomePage && (
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-[rgba(0,82,125,0.03)] hover:bg-[rgba(0,82,125,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[#00527d] rounded-xl transition-all duration-300 text-white font-semibold hover:scale-[1.02]"
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


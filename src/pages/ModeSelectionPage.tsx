/**
 * ModeSelectionPage Component
 * Allows users to choose between visualization and text-to-SQL modes
 */

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { NavigationBar } from '../layouts/NavigationBar';
import { PrismaParser } from '../parsers';
import { useSchemaContext } from '../lib/hooks/useSchemaContext';
import { generatePath } from '../lib/types/routing';
import { Button } from '../components/ui/Button';

export const ModeSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { demoId } = useParams<{ demoId: string }>();
  const { setSchemaData } = useSchemaContext();

  // Get schema data from navigation state
  const { schemaContent, moduleName } = location.state as {
    schemaContent: string;
    moduleName: string;
  };

  const handleVisualizeClick = () => {
    try {
      // Parse the schema
      const parsed = PrismaParser.parse(schemaContent);
      
      // Store in context
      setSchemaData(parsed.models, parsed.enums, parsed.connections, moduleName);
      
      // Navigate to visualizer
      navigate(generatePath.visualizer());
    } catch (error) {
      console.error('Error parsing schema:', error);
      alert('Failed to parse schema. Please check the file format.');
    }
  };

  return (
    <>
      <NavigationBar />
      
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden pt-28">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/10 via-transparent to-[#764ba2]/10"></div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)'
        }}></div>
        
        <div className="max-w-5xl w-full relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full">
                <span className="text-white font-semibold text-sm tracking-wide">READY TO EXPLORE</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Choose how to explore{' '}
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {moduleName}
              </span>
            </h1>
            <p className="text-[#a1a1aa] text-xl max-w-2xl mx-auto leading-relaxed">
              Select your preferred mode to interact with the database schema
            </p>
          </div>

          <div className="flex items-stretch justify-center gap-6">
            {/* Visualize Option */}
            <button
              onClick={handleVisualizeClick}
              className="group relative p-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border-2 border-[rgba(255,255,255,0.1)] hover:border-[#667eea] rounded-3xl transition-all duration-300 text-left flex-1 max-w-md hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(102,126,234,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[#667eea] transition-colors">
                  Visualize Schema
                </h3>
                <p className="text-[#a1a1aa] leading-relaxed mb-6 text-lg">
                  Interactive UML diagram showing tables, relationships, and data types with visual indicators
                </p>
                <ul className="space-y-3 text-base">
                  <li className="flex items-center gap-3 text-[#a1a1aa]">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                    <span>ERD visualization</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#a1a1aa]">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                    <span>Relationship mapping</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#a1a1aa]">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                    <span>Export diagrams</span>
                  </li>
                </ul>
              </div>
            </button>

            {/* Talk to Your Database Option */}
            <div className="relative flex-1 max-w-md">
              <div className="group relative p-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border-2 border-[rgba(255,255,255,0.1)] rounded-3xl text-left">
                <div className="relative z-10">
                  <div className="text-6xl mb-6">💬</div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Talk to Your Database
                  </h3>
                  <p className="text-[#a1a1aa] leading-relaxed mb-6 text-lg">
                    AI-powered natural language to SQL queries with intelligent schema understanding
                  </p>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-center gap-3 text-[#a1a1aa]">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm">✓</span>
                      <span>Text-to-SQL generation</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#a1a1aa]">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm">✓</span>
                      <span>Schema-aware AI</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#a1a1aa]">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm">✓</span>
                      <span>Query explanations</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#a1a1aa]">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm">✓</span>
                      <span>Real-time validation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 backdrop-blur-[6px] bg-[rgba(0,0,0,0.4)] rounded-3xl flex items-center justify-center z-10">
                <div className="text-center px-6 py-8">
                  <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-[0_0_30px_rgba(147,51,234,0.4)]">
                    <span className="text-white font-bold text-base tracking-wide">COMING SOON</span>
                  </div>
                  <p className="text-lg text-white font-semibold">
                    AI Chat Feature
                  </p>
                  <p className="text-sm text-[#a1a1aa] mt-2">
                    Currently in development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


import { useState } from 'react';
import { SchemaVisualizer } from './components/SchemaVisualizer';

import { ThemeProvider } from './lib/contexts/theme';
import { SettingsProvider } from './lib/contexts/settings';
import { ColorThemeKind } from './lib/types/schema';
import type { Enum, Model, ModelConnection } from './lib/types/schema';
import { ReactFlowProvider } from '@xyflow/react';
import { SchemaUpload } from './components/SchemaUpload';
import { PrismaParser } from './parsers';

type ViewMode = 'select' | 'visualize' | 'chat';

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [enums, setEnums] = useState<Enum[]>([]);
  const [connections, setConnections] = useState<ModelConnection[]>([]);
  const [theme] = useState<ColorThemeKind>(ColorThemeKind.Dark);
  const [currentModule, setCurrentModule] = useState<string>('');
  const [schemaContent, setSchemaContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [showModeChoice, setShowModeChoice] = useState(false);
  const [tempSchemaData, setTempSchemaData] = useState<{ content: string; name: string } | null>(null);

  const handleSchemaLoad = (schemaContent: string, moduleName: string) => {
    // Store schema data and show mode choice
    setTempSchemaData({ content: schemaContent, name: moduleName });
    setShowModeChoice(true);
  };

  const handleModeSelect = (mode: 'visualize' | 'chat') => {
    if (!tempSchemaData) return;

    try {
      const parsed = PrismaParser.parse(tempSchemaData.content);
      setModels(parsed.models);
      setEnums(parsed.enums);
      setConnections(parsed.connections);
      setCurrentModule(tempSchemaData.name);
      setSchemaContent(tempSchemaData.content);
      setViewMode(mode);
      setShowModeChoice(false);
    } catch (error) {
      console.error('Error parsing schema:', error);
      alert('Failed to parse schema. Please check the file format.');
      setShowModeChoice(false);
    }
  };

  const handleBackToModules = () => {
    setModels([]);
    setEnums([]);
    setConnections([]);
    setCurrentModule('');
    setSchemaContent('');
    setViewMode('select');
    setShowModeChoice(false);
    setTempSchemaData(null);
  };

  return (
    <>
      {viewMode === 'select' && !showModeChoice && (
        <SchemaUpload onSchemaLoad={handleSchemaLoad} />
      )}

      {/* Mode Selection Modal */}
      {showModeChoice && tempSchemaData && (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
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
                  {tempSchemaData.name}
                </span>
              </h1>
              <p className="text-[#a1a1aa] text-xl max-w-2xl mx-auto leading-relaxed">
                Select your preferred mode to interact with the database schema
              </p>
            </div>

            <div className="flex items-stretch justify-center gap-6">
              {/* Visualize Option */}
              <button
                onClick={() => handleModeSelect('visualize')}
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

              {/*  Chat Option 
              <button
                onClick={() => handleModeSelect('chat')}
                className="group p-8 bg-gray-900 border-2 border-gray-800 hover:border-purple-500 rounded-xl transition-all text-left"
              >
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  h
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  AI-powered natural language to SQL conversion using Ollama Mistral 7B
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Text-to-SQL generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Schema-aware AI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Query explanations
                  </li>
                </ul>
              </button> */}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setShowModeChoice(false);
                  setTempSchemaData(null);
                }}
                className="px-6 py-3 text-[#a1a1aa] hover:text-white transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] rounded-xl font-medium"
              >
                ← Back to modules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualize Mode */}
      {viewMode === 'visualize' && (
        <div className="w-full h-screen relative">
          <button
            onClick={handleBackToModules}
            className="absolute top-4 left-4 z-50 px-6 py-3 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] cursor-pointer text-white rounded-xl shadow-lg transition-all duration-300 font-semibold hover:scale-[1.02]"
          >
             ◀️ Back to Modules
          </button>
          
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentModule}
            </h2>
          </div>

          <ThemeProvider theme={theme}>
            <SettingsProvider>
              <ReactFlowProvider>
                <SchemaVisualizer
                  models={models}
                  connections={connections}
                  enums={enums}
                />
              </ReactFlowProvider>
            </SettingsProvider>
          </ThemeProvider>
        </div>
      )}

     
    </>
  );
}

export default App;

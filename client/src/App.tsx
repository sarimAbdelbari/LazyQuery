import { useState } from 'react';
import { SchemaVisualizer } from './components/SchemaVisualizer';
import { ChatInterface } from './components/ChatInterface';
import { ThemeProvider } from './lib/contexts/theme';
import { SettingsProvider } from './lib/contexts/settings';
import { ColorThemeKind } from './lib/types/schema';
import type { Enum, Model, ModelConnection } from './lib/types/schema';
import { ReactFlowProvider } from '@xyflow/react';
import { ModuleSelector } from './components/ModuleSelector';
import { PrismaParser } from './utils/prismaParser';

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
        <ModuleSelector onSchemaLoad={handleSchemaLoad} />
      )}

      {/* Mode Selection Modal */}
      {showModeChoice && tempSchemaData && (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Choose how to explore {tempSchemaData.name}
              </h1>
              <p className="text-gray-400">
                Select your preferred mode to interact with the database schema
              </p>
            </div>

            <div className="flex items-center justify-center gap-6">
              {/* Visualize Option */}
              <button
                onClick={() => handleModeSelect('visualize')}
                className="group p-8 bg-gray-900 border-2 border-gray-800 hover:border-blue-500 rounded-xl transition-all text-left"
              >
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Visualize Schema
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Interactive UML diagram showing tables, relationships, and data types with visual indicators
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    ERD visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Relationship mapping
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Export diagrams
                  </li>
                </ul>
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

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setShowModeChoice(false);
                  setTempSchemaData(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
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
            className="absolute top-4 left-4 z-50 px-4 py-2 bg-gradient-to-r cursor-pointer text-white rounded-lg shadow-lg transition-all font-medium"
          >
             ◀️ Back to Modules
          </button>
          
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
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

      {/* Chat Mode */}
      {viewMode === 'chat' && (
        <ChatInterface
          schemaContent={schemaContent}
          moduleName={currentModule}
          onBack={handleBackToModules}
        />
      )}
    </>
  );
}

export default App;

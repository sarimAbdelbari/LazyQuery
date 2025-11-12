/**
 * VisualizerPage Component
 * Full-screen schema visualization without navigation bar
 */

import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../lib/contexts/theme';
import { SettingsProvider } from '../lib/contexts/settings';
import { ColorThemeKind } from '../lib/types/schema';
import { ReactFlowProvider } from '@xyflow/react';
import { SchemaVisualizer } from '../components/SchemaVisualizer';
import { useSchemaContext } from '../lib/hooks/useSchemaContext';
import { generatePath } from '../lib/types/routing';

export const VisualizerPage = () => {
  const navigate = useNavigate();
  const { models, enums, connections, currentModule, clearSchemaData } = useSchemaContext();

  const handleBackToModules = () => {
    clearSchemaData();
    navigate(generatePath.home());
  };

  // Redirect to home if no schema data
  if (models.length === 0 && enums.length === 0) {
    navigate(generatePath.home());
    return null;
  }

  return (
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

      <ThemeProvider theme={ColorThemeKind.Dark}>
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
  );
};


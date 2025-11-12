/**
 * App Component
 * Main application entry point with routing configuration
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SchemaProvider } from './lib/hooks/useSchemaContext';
import { HomePage } from './pages/HomePage';
import { ModeSelectionPage } from './pages/ModeSelectionPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { ROUTES } from './lib/types/routing';

function App() {
  return (
    <BrowserRouter>
      <SchemaProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.MODE_SELECTION} element={<ModeSelectionPage />} />
          <Route path={ROUTES.VISUALIZER} element={<VisualizerPage />} />
        </Routes>
      </SchemaProvider>
    </BrowserRouter>
  );
}

export default App;

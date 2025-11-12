/**
 * HomePage Component
 * Main landing page with demo database selection
 */

import { useNavigate } from 'react-router-dom';
import { SchemaUpload } from '../components/SchemaUpload';
import { NavigationBar } from '../layouts/NavigationBar';
import { generatePath, DEMO_IDS } from '../lib/types/routing';

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSchemaLoad = (schemaContent: string, moduleName: string) => {
    // Extract demo ID from module name
    let demoId = DEMO_IDS.CRM; // default
    
    if (moduleName.includes('CRM')) demoId = DEMO_IDS.CRM;
    else if (moduleName.includes('PMS')) demoId = DEMO_IDS.PMS;
    else if (moduleName.includes('DMS')) demoId = DEMO_IDS.DMS;
    else if (moduleName.includes('ERP')) demoId = DEMO_IDS.ERP;

    // Navigate to mode selection with demo ID and pass schema data
    navigate(generatePath.modeSelection(demoId), {
      state: { schemaContent, moduleName }
    });
  };

  return (
    <>
      <NavigationBar />
      <SchemaUpload onSchemaLoad={handleSchemaLoad} />
    </>
  );
};


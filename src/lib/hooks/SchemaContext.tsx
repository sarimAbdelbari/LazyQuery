/**
 * Schema Context Provider
 * Manages and shares schema state across all routes
 */

import { createContext, useState, type ReactNode } from 'react';
import type { Enum, Model, ModelConnection } from '../types/schema';

export interface SchemaContextType {
  models: Model[];
  enums: Enum[];
  connections: ModelConnection[];
  currentModule: string;
  setSchemaData: (models: Model[], enums: Enum[], connections: ModelConnection[], moduleName: string) => void;
  clearSchemaData: () => void;
}

export const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export function SchemaProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<Model[]>([]);
  const [enums, setEnums] = useState<Enum[]>([]);
  const [connections, setConnections] = useState<ModelConnection[]>([]);
  const [currentModule, setCurrentModule] = useState<string>('');

  const setSchemaData = (
    newModels: Model[],
    newEnums: Enum[],
    newConnections: ModelConnection[],
    moduleName: string
  ) => {
    setModels(newModels);
    setEnums(newEnums);
    setConnections(newConnections);
    setCurrentModule(moduleName);
  };

  const clearSchemaData = () => {
    setModels([]);
    setEnums([]);
    setConnections([]);
    setCurrentModule('');
  };

  return (
    <SchemaContext.Provider
      value={{
        models,
        enums,
        connections,
        currentModule,
        setSchemaData,
        clearSchemaData,
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
}


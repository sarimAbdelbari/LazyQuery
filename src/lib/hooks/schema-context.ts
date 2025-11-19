/**
 * Schema Context Definition
 * Context type and instance for schema state management
 */

import { createContext } from 'react';
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



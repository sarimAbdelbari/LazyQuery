/**
 * Schema Context Hook
 * Hook to access schema context
 */

import { useContext } from 'react';
import { SchemaContext } from './SchemaContext';

export function useSchemaContext() {
  const context = useContext(SchemaContext);
  if (context === undefined) {
    throw new Error('useSchemaContext must be used within a SchemaProvider');
  }
  return context;
}


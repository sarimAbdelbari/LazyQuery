/**
 * Route Constants and Types
 * Central location for all route paths and navigation types
 */

// Route Paths
export const ROUTES = {
  HOME: '/',
  MODE_SELECTION: '/mode-selection/:demoId',
  VISUALIZER: '/visualizer',
} as const;

// Helper to generate routes with params
export const generatePath = {
  home: () => '/',
  modeSelection: (demoId: string) => `/mode-selection/${demoId}`,
  visualizer: () => '/visualizer',
};

// Demo IDs (matches schema names)
export const DEMO_IDS = {
  CRM: 'crm',
  PMS: 'pms',
  DMS: 'dms',
  ERP: 'erp',
} as const;

export type DemoId = (typeof DEMO_IDS)[keyof typeof DEMO_IDS];

// Navigation types
export interface NavigationState {
  from?: string;
  demoName?: string;
}


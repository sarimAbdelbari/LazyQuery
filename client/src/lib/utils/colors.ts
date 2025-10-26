import type { MyNode } from '../types/schema';

export const nodeColor = (isDarkMode: boolean) => (node: MyNode) => {
  if (node.type === 'enum') {
    return isDarkMode ? '#10b981' : '#34d399';
  }
  return isDarkMode ? '#3b82f6' : '#60a5fa';
};

export const nodeStrokeColor = (isDarkMode: boolean) => () => {
  return isDarkMode ? '#1f2937' : '#e5e7eb';
};

export const maskColor = (isDarkMode: boolean) => {
  return isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
};


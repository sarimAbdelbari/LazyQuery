import { toPng } from 'html-to-image';
import type { Node as ReactFlowNode } from '@xyflow/react';

interface ScreenshotOptions {
  getNodes: () => ReactFlowNode[];
  backgroundColor?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const screenshot = ({
  getNodes,
  backgroundColor = '#1c1c1c',
  onStart,
  onComplete,
  onError,
}: ScreenshotOptions) => {
  const nodes = getNodes();
  
  if (nodes.length === 0) {
    console.warn('No nodes to screenshot');
    onError?.(new Error('No nodes to screenshot'));
    return;
  }

  onStart?.();

  // Find the ReactFlow container
  const reactFlowContainer = document.querySelector(
    '.react-flow',
  ) as HTMLElement;

  if (!reactFlowContainer) {
    const error = new Error('Could not find ReactFlow container');
    console.error(error);
    onError?.(error);
    return;
  }

  // Find the viewport (contains the actual diagram content)
  const viewport = reactFlowContainer.querySelector(
    '.react-flow__viewport',
  ) as HTMLElement;

  if (!viewport) {
    const error = new Error('Could not find ReactFlow viewport');
    console.error(error);
    onError?.(error);
    return;
  }

  // Filter function to exclude UI elements
  const filter = (domNode: HTMLElement) => {
    // Exclude ReactFlow controls (screenshot button) and minimap
    if (
      domNode.classList?.contains('react-flow__controls') ||
      domNode.classList?.contains('react-flow__minimap')
    ) {
      return false;
    }

    // Check parent elements using closest
    if (domNode.closest) {
      if (
        domNode.closest('.react-flow__controls') ||
        domNode.closest('.react-flow__minimap')
      ) {
        return false;
      }
    }

    return true;
  };

  // Use high pixel ratio (4x-5x) for maximum quality output
  // This creates images at 4x the resolution for crisp, high-DPI displays
  const pixelRatio = 5;

  // Capture the viewport at high resolution
  toPng(viewport, {
    backgroundColor: backgroundColor,
    pixelRatio: pixelRatio,
    filter: filter,
    quality: 1.0,
    cacheBust: true,
  })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'schema-diagram.png';
      link.href = dataUrl;
      link.click();
      onComplete?.();
    })
    .catch((err) => {
      const error = err instanceof Error ? err : new Error('Failed to generate screenshot');
      console.error('Failed to generate screenshot:', error, err);
      onError?.(error);
    });
};


import { toPng } from 'html-to-image';
import type { Node } from '@xyflow/react';

export const screenshot = (getNodes: () => Node[]) => {
  const nodes = getNodes();
  
  if (nodes.length === 0) {
    console.warn('No nodes to screenshot');
    return;
  }

  const nodesBoundingBox = nodes.reduce(
    (acc, node) => {
      const x = node.position.x;
      const y = node.position.y;
      const width = 250; // node width
      const height = 400; // node height

      return {
        minX: Math.min(acc.minX, x),
        minY: Math.min(acc.minY, y),
        maxX: Math.max(acc.maxX, x + width),
        maxY: Math.max(acc.maxY, y + height),
      };
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const width = nodesBoundingBox.maxX - nodesBoundingBox.minX + 100;
  const height = nodesBoundingBox.maxY - nodesBoundingBox.minY + 100;

  const viewport = document.querySelector(
    '.react-flow__viewport',
  ) as HTMLElement;

  if (!viewport) {
    console.error('Could not find viewport');
    return;
  }

  toPng(viewport, {
    backgroundColor: '#1c1c1c',
    width,
    height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
    },
  })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'schema-diagram.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Failed to generate screenshot:', err);
    });
};


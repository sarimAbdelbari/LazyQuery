import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ControlButton,
  Controls,
  ReactFlow,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import type { Edge } from '@xyflow/react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSettings } from '../lib/contexts/settings';
import { useTheme } from '../lib/contexts/theme';
import { useGraph } from '../lib/hooks/useGraph';
import type { Enum, Model, ModelConnection } from '../lib/types/schema';
import { maskColor, nodeColor, nodeStrokeColor } from '../lib/utils/colors';
import { screenshot } from '../lib/utils/screenshot';
import { EnumNode } from './EnumNode';
import { ModelNode } from './ModelNode';
import { SettingsPanel } from './SettingsPanel';
import { TableFieldSelector } from './TableFieldSelector';
import { RelationLegend } from './RelationLegend';
import { IDownload } from './icons/IDownload';

import '@xyflow/react/dist/style.css';

interface Props {
  models: Model[];
  connections: ModelConnection[];
  enums: Enum[];
}

// Component to handle centering on a field - must be inside ReactFlow context
const FieldCenterHandler = ({ 
  fieldToCenter, 
  onCentered 
}: { 
  fieldToCenter: { modelName: string } | null;
  onCentered: () => void;
}) => {
  const { getNodes, setCenter, getZoom } = useReactFlow();
  const NODE_WIDTH = 250;
  const NODE_HEIGHT = 400;

  useEffect(() => {
    if (!fieldToCenter) return;
    
    // Small delay to ensure node is rendered
    const timeoutId = setTimeout(() => {
      const allNodes = getNodes();
      const targetNode = allNodes.find(node => node.id === fieldToCenter.modelName);
      if (targetNode) {
        const currentZoom = getZoom();
        // Center on the node with a smooth transition
        setCenter(
          targetNode.position.x + NODE_WIDTH / 2,
          targetNode.position.y + NODE_HEIGHT / 2,
          {
            zoom: Math.max(currentZoom, 0.8), // Don't zoom out too much, maintain current zoom if it's higher
            duration: 500,
          }
        );
        onCentered();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [fieldToCenter, getNodes, setCenter, getZoom, onCentered]);

  return null;
};

// Component to handle screenshot - must be inside ReactFlow context
const ScreenshotButton = ({ isDarkMode, settings }: { isDarkMode: boolean; settings: { theme: { backgroundColor?: string } } }) => {
  const { getNodes, fitView } = useReactFlow();
  const [isCapturing, setIsCapturing] = useState(false);
  
  const handleScreenshot = async () => {
    setIsCapturing(true);
    
    // Fit view to show all nodes before capturing
    fitView({ padding: 0.2, duration: 0 });
    
    // Wait for the view to update and render
    await new Promise(resolve => setTimeout(resolve, 300));
    
    screenshot({
      getNodes,
      backgroundColor: settings.theme.backgroundColor || (isDarkMode ? '#1c1c1c' : '#ffffff'),
      onStart: () => setIsCapturing(true),
      onComplete: () => {
        setIsCapturing(false);
      },
      onError: (error) => {
        console.error('Screenshot error:', error);
        setIsCapturing(false);
      },
    });
  };
  
  return (
    <Controls>
      <ControlButton
        title={isCapturing ? "Capturing..." : "Download Screenshot"}
        onClick={handleScreenshot}
        disabled={isCapturing}
      >
        <IDownload color={isDarkMode ? 'white' : 'black'} />
      </ControlButton>
    </Controls>
  );
};

export const SchemaVisualizer = ({ connections, models, enums }: Props) => {
  const { isDarkMode } = useTheme();
  const { settings } = useSettings();
  
  // Table selection state
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  
  // Field highlighting state
  const [highlightedField, setHighlightedField] = useState<{
    modelName: string;
    fieldName: string;
  } | null>(null);
  
  // State to trigger centering on a field
  const [fieldToCenter, setFieldToCenter] = useState<{
    modelName: string;
  } | null>(null);
  
  // Table expansion state - tracks which tables are expanded
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  
  // Function to find related tables for a given table
  const getRelatedTables = useMemo(() => {
    return (tableName: string): string[] => {
      const relatedTables = new Set<string>();
      
      // Get all available table names
      const allTableNames = new Set([
        ...models.map(m => m.name),
        ...enums.map(e => e.name)
      ]);
      
      connections.forEach(connection => {
        const sourceTable = connection.source.split('-')[0];
        const targetTable = connection.target.split('-')[0];
        
        if (sourceTable === tableName && allTableNames.has(targetTable)) {
          relatedTables.add(targetTable);
        }
        if (targetTable === tableName && allTableNames.has(sourceTable)) {
          relatedTables.add(sourceTable);
        }
      });
      
      return Array.from(relatedTables);
    };
  }, [connections, models, enums]);
  
  // Function to handle table expansion
  const handleTableExpand = useCallback((tableName: string) => {
    setExpandedTables(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(tableName)) {
        // Collapse - remove from expanded set
        newExpanded.delete(tableName);
      } else {
        // Expand - add to expanded set and auto-select related tables
        newExpanded.add(tableName);
        const relatedTables = getRelatedTables(tableName);
        
        // Auto-select related tables that aren't already selected
        setSelectedTables(prevSelected => {
          const newSelected = [...prevSelected];
          relatedTables.forEach(relatedTable => {
            if (!newSelected.includes(relatedTable)) {
              newSelected.push(relatedTable);
            }
          });
          return newSelected;
        });
      }
      return newExpanded;
    });
  }, [getRelatedTables]);
  
  // Relation filter state
  const [enabledRelations, setEnabledRelations] = useState<{
    'one-to-many': boolean;
    'many-to-one': boolean;
    'many-to-many': boolean;
    'one-to-one': boolean;
  }>({
    'one-to-many': true,
    'many-to-one': true,
    'many-to-many': true,
    'one-to-one': true,
  });
  
  // Initialize with first 5 tables selected
  useMemo(() => {
    if (selectedTables.length === 0 && (models.length > 0 || enums.length > 0)) {
      const allTableNames = [
        ...models.map(m => m.name),
        ...enums.map(e => e.name)
      ].sort((a, b) => a.localeCompare(b)); // Sort alphabetically
      
      // Select first 5 tables
      const defaultSelection = allTableNames.slice(0, 5);
      setSelectedTables(defaultSelection);
    }
  }, [models, enums, selectedTables.length]);

  // Filter models and enums based on selection
  const filteredModels = useMemo(() => {
    return models.filter(model => selectedTables.includes(model.name));
  }, [models, selectedTables]);

  const filteredEnums = useMemo(() => {
    return enums.filter(enumItem => selectedTables.includes(enumItem.name));
  }, [enums, selectedTables]);

  // Filter connections based on selected tables and enabled relations
  const filteredConnections = useMemo(() => {
    return connections.filter(connection => {
      const sourceTable = connection.source.split('-')[0];
      const targetTable = connection.target.split('-')[0];
      const isTableSelected = selectedTables.includes(sourceTable) && selectedTables.includes(targetTable);
      const isRelationEnabled = connection.relationType ? enabledRelations[connection.relationType] : true;
      return isTableSelected && isRelationEnabled;
    });
  }, [connections, selectedTables, enabledRelations]);

  const modelNodes = useMemo(() => {
    return filteredModels.map((model) => ({
      id: model.name,
      data: {
        ...model,
        highlightedField: highlightedField?.modelName === model.name ? highlightedField.fieldName : null,
        isExpanded: expandedTables.has(model.name),
        relatedTables: getRelatedTables(model.name),
        onExpand: () => handleTableExpand(model.name),
      },
      type: 'model',
      position: { x: 0, y: 0 },
    }));
  }, [filteredModels, highlightedField, expandedTables, getRelatedTables, handleTableExpand]);

  const enumNodes = useMemo(() => {
    return filteredEnums.map((enumItem) => ({
      id: enumItem.name,
      data: enumItem,
      type: 'enum',
      position: { x: 0, y: 0 },
    }));
  }, [filteredEnums]);

  const edges: Edge[] = useMemo(() => {
    // Group connections by source-target pairs to handle multiple relationships
    const connectionGroups = new Map<string, ModelConnection[]>();
    
    filteredConnections.forEach((connection) => {
      const sourceTable = connection.source.split('-')[0];
      const targetTable = connection.target.split('-')[0];
      const groupKey = `${sourceTable}-${targetTable}`;
      
      if (!connectionGroups.has(groupKey)) {
        connectionGroups.set(groupKey, []);
      }
      connectionGroups.get(groupKey)!.push(connection);
    });

    const edges: Edge[] = [];
    
    connectionGroups.forEach((connections, groupKey) => {
      const [sourceTable, targetTable] = groupKey.split('-');
      
      connections.forEach((connection, index) => {
        // Determine edge color based on relation type
        let edgeColor = isDarkMode ? '#60a5fa' : '#3b82f6'; // Default blue
        if (connection.relationType === 'one-to-many') {
          edgeColor = isDarkMode ? '#10b981' : '#059669'; // Green for 1:N
        } else if (connection.relationType === 'many-to-one') {
          edgeColor = isDarkMode ? '#f59e0b' : '#d97706'; // Amber/Orange for N:1
        } else if (connection.relationType === 'one-to-one') {
          edgeColor = isDarkMode ? '#00527d' : '#004268'; // Blue for 1:1
        } else if (connection.relationType === 'many-to-many') {
          edgeColor = isDarkMode ? '#06b6d4' : '#0891b2'; // Cyan/Teal for M:N
        }
        
        // Special styling for M:N relationships
        const isManyToMany = connection.relationType === 'many-to-many';
        
        // Create unique edge ID
        const edgeId = `${connection.source}-${connection.target}-${index}`;
        
        // For multiple connections between same tables, use different label positions
        // const labelPosition = totalConnections > 1 ? 
        //   (index / (totalConnections - 1)) * 0.8 + 0.1 : 0.5; // Spread labels across the edge
        
        // Use specific field handles if available, otherwise fall back to main handles
        const sourceHandle = connection.source.includes('-') ? connection.source : `${sourceTable}-source`;
        const targetHandle = connection.target.includes('-') ? connection.target : `${targetTable}-target`;
        
        edges.push({
          id: edgeId,
          source: sourceTable,
          target: targetTable,
          sourceHandle: sourceHandle,
          targetHandle: targetHandle,
          animated: isManyToMany,
          label: connection.label || connection.name,
          labelStyle: {
            fill: '#fbbf24', // Gold color for all labels
            fontSize: 10, // Smaller font for better fit
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          labelBgStyle: {
            fill: isDarkMode ? '#1c1c1c' : '#ffffff',
            fillOpacity: 0.95,
          },
          labelBgPadding: [3, 5] as [number, number], // Smaller padding
          labelBgBorderRadius: 3,
          labelShowBg: true,
          style: {
            stroke: edgeColor,
            strokeWidth: isManyToMany ? 3 : 2,
            strokeOpacity: isManyToMany ? 0.9 : 0.8,
            strokeLinejoin: 'round',
            strokeLinecap: 'round',
            strokeDasharray: isManyToMany ? '8, 4' : undefined,
            fill: 'none',
          },
        });
      });
    });

    return edges;
  }, [filteredConnections, isDarkMode]);

  const {
    nodes,
    edges: edgesState,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useGraph([...modelNodes, ...enumNodes], edges, settings);

  const getBackgroundVariant = () => {
    switch (settings.backgroundVariant) {
      case 'dots':
        return BackgroundVariant.Dots;
      case 'cross':
        return BackgroundVariant.Cross;
      default:
        return BackgroundVariant.Lines;
    }
  };

  // Set CSS variables for dynamic theming
  const containerStyle = {
    '--background-color':
      settings.theme.backgroundColor || (isDarkMode ? '#1c1c1c' : '#e0e0e0'),
    '--primary-color': settings.theme.primaryColor,
    '--secondary-color': settings.theme.secondaryColor,
    '--title-color': settings.theme.titleColor,
  } as React.CSSProperties;

  return (
    <div
      className="w-full h-screen relative"
      style={containerStyle}
    >
      {/* Table & Field Selector */}
      <div className="absolute top-5 left-4 z-50">
        <TableFieldSelector
          models={models}
          enums={enums}
          selectedTables={selectedTables}
          onSelectionChange={setSelectedTables}
          onFieldSelect={(field) => {
            // Highlight the specific field
            setHighlightedField({
              modelName: field.modelName,
              fieldName: field.fieldName,
            });
            
            // Trigger centering on the node containing the field
            setFieldToCenter({ modelName: field.modelName });
            
            // Clear highlight after 3 seconds
            setTimeout(() => setHighlightedField(null), 3000);
          }}
        />
      </div>


      <ReactFlow
        onlyRenderVisibleElements
        colorMode={isDarkMode ? 'dark' : 'light'}
        nodes={nodes}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{ model: ModelNode, enum: EnumNode }}
        connectionLineType={ConnectionLineType.SmoothStep}
        minZoom={0.2}
      >
        <FieldCenterHandler 
          fieldToCenter={fieldToCenter}
          onCentered={() => setFieldToCenter(null)}
        />
        <ScreenshotButton isDarkMode={isDarkMode} settings={settings} />

        <Background
          color={isDarkMode ? '#222' : '#ccc'}
          variant={getBackgroundVariant()}
          style={{
            opacity: settings.showBackground ? 1 : 0,
            pointerEvents: settings.showBackground ? 'auto' : 'none',
          }}
        />
        
      </ReactFlow>
     
      <SettingsPanel />
      <RelationLegend 
        enabledRelations={enabledRelations}
        onRelationToggle={(relationType) => {
          setEnabledRelations(prev => ({
            ...prev,
            [relationType]: !prev[relationType]
          }));
        }}
      />
      <div className='absolute  left-[14%] z-50'>
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
          nodeColor={nodeColor(isDarkMode)}
          nodeStrokeColor={nodeStrokeColor(isDarkMode)}
          maskColor={maskColor(isDarkMode)}
          style={{
            backgroundColor: settings.theme.backgroundColor,
          }}
        />
      </div>
    </div>
  );
};


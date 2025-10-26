import type { Node } from '@xyflow/react';

export type Model = {
  name: string;
  fields: {
    name: string;
    type: string;
    hasConnections?: boolean;
    isForeignKey?: boolean;
    isRelation?: boolean;
    isPrimaryKey?: boolean;
  }[];
  isChild?: boolean;
  highlightedField?: string | null;
};

export type ModelConnection = {
  target: string;
  source: string;
  name: string;
  label?: string;
  foreignKey?: string;
  references?: string;
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
};

export type Enum = {
  name: string;
  values: string[];
};

export enum ColorThemeKind {
  Light = 1,
  Dark = 2,
  HighContrast = 3,
  HighContrastLight = 4,
}

export type EnumNodeType = Node<Enum>;
export type ModelNodeType = Node<Model>;

type NodeData = Model | Enum;
export type MyNode = Node<NodeData>;


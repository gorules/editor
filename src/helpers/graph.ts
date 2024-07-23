export type Position = {
  x: number;
  y: number;
};

export type DecisionNode = {
  id: string;

  name: string;
  description?: string;
  type?: string;
  content?: unknown;
  position: Position;
};

export type DecisionEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  type?: string;
  sourceHandle?: string;
};

export type DecisionContent = {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
};

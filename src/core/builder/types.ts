import { ComponentType, BuilderNode, BuilderDocument } from "./schemas";

export type { ComponentType, BuilderNode, BuilderDocument };

export type NodeProps = {
  className?: string;
  style?: React.CSSProperties;
  text?: string;
  src?: string;
  href?: string;
  variant?: string;
  [key: string]: any;
};

export type CmsListContract = {
  type: "cms-list";
  modelId: string;
  limit?: number;
};

export type DeviceMode = "desktop" | "tablet" | "mobile";

export type HistoryState = {
  past: BuilderNode[][];
  future: BuilderNode[][];
};

export type BuilderState = {
  // Tree state
  nodes: BuilderNode[];
  
  // Selection state
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // UI state
  deviceMode: DeviceMode;
  previewMode: boolean;
  
  // Save / Dirty state
  isDirty: boolean;
  isSaving: boolean;
  
  // History state
  past: BuilderNode[][];
  future: BuilderNode[][];

  // Actions
  setNodes: (nodes: BuilderNode[], saveHistory?: boolean) => void;
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  togglePreview: () => void;
  
  // Node Operations
  updateNodeProps: (id: string, props: Partial<NodeProps>) => void;
  updateNodeStyles: (id: string, styles: any, mode: DeviceMode) => void;
  addNode: (node: BuilderNode, parentId?: string, index?: number) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  moveNode: (id: string, targetParentId: string, index: number) => void;
  
  // History Operations
  undo: () => void;
  redo: () => void;
  
  // Save Operations
  setIsDirty: (isDirty: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  loadDocument: (doc: BuilderDocument) => void;
};

import { create } from "zustand";
import { BuilderState, BuilderNode, NodeProps } from "./types";
import { v4 as uuidv4 } from "uuid";
import { BuilderDocument } from "./schemas";

const MAX_HISTORY = 50;

const cloneNodes = (nodes: BuilderNode[]): BuilderNode[] => {
  return JSON.parse(JSON.stringify(nodes));
};

// Deep generation of new IDs for duplication
const deepCloneWithNewIds = (node: BuilderNode): BuilderNode => {
  return {
    ...node,
    id: uuidv4(),
    children: node.children ? node.children.map(deepCloneWithNewIds) : []
  };
};

const updateNodeInTree = (nodes: BuilderNode[], id: string, updater: (node: BuilderNode) => BuilderNode): BuilderNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return updater(node);
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: updateNodeInTree(node.children, id, updater) };
    }
    return node;
  });
};

const addNodeToTree = (nodes: BuilderNode[], newNode: BuilderNode, parentId?: string, index?: number): BuilderNode[] => {
  if (!parentId) {
    const newNodes = [...nodes];
    if (index !== undefined) newNodes.splice(index, 0, newNode);
    else newNodes.push(newNode);
    return newNodes;
  }
  
  return nodes.map(node => {
    if (node.id === parentId) {
      const newChildren = [...(node.children || [])];
      if (index !== undefined) newChildren.splice(index, 0, newNode);
      else newChildren.push(newNode);
      return { ...node, children: newChildren };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: addNodeToTree(node.children, newNode, parentId, index) };
    }
    return node;
  });
};

const removeNodeFromTree = (nodes: BuilderNode[], id: string): BuilderNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => {
      if (node.children && node.children.length > 0) {
        return { ...node, children: removeNodeFromTree(node.children, id) };
      }
      return node;
    });
};

export const findNodeAndParent = (nodes: BuilderNode[], id: string, parentId?: string): { node: BuilderNode | null, parentId?: string } => {
  for (const node of nodes) {
    if (node.id === id) return { node, parentId };
    if (node.children) {
      const found = findNodeAndParent(node.children, id, node.id);
      if (found.node) return found;
    }
  }
  return { node: null };
};

export const useBuilderStore = create<BuilderState>((set, get) => {
  const pushHistory = (state: BuilderState, newNodes: BuilderNode[]) => {
    const past = [...state.past, state.nodes].slice(-MAX_HISTORY);
    return {
      nodes: newNodes,
      past,
      future: [],
      isDirty: true,
    };
  };

  return {
    nodes: [],
    selectedNodeId: null,
    hoveredNodeId: null,
    deviceMode: "desktop",
    previewMode: false,
    
    isDirty: false,
    isSaving: false,
    
    past: [],
    future: [],

    setNodes: (nodes, saveHistory = true) => set((state) => {
      if (!saveHistory) return { nodes };
      return pushHistory(state, nodes);
    }),
    
    selectNode: (id) => set({ selectedNodeId: id }),
    hoverNode: (id) => set({ hoveredNodeId: id }),
    setDeviceMode: (mode) => set({ deviceMode: mode }),
    togglePreview: () => set((state) => {
      const newMode = !state.previewMode;
      return { previewMode: newMode, selectedNodeId: newMode ? null : state.selectedNodeId };
    }),

    setIsDirty: (isDirty) => set({ isDirty }),
    setIsSaving: (isSaving) => set({ isSaving }),

    loadDocument: (doc: BuilderDocument) => set({
      nodes: doc.root ? [doc.root] : [],
      past: [],
      future: [],
      isDirty: false,
      selectedNodeId: null
    }),

    updateNodeProps: (id, props) => set((state) => {
      const newNodes = updateNodeInTree(state.nodes, id, (node) => ({
        ...node,
        props: { ...node.props, ...props }
      }));
      return pushHistory(state, newNodes);
    }),

    updateNodeStyles: (id, styles, mode) => set((state) => {
      const newNodes = updateNodeInTree(state.nodes, id, (node) => ({
        ...node,
        styles: {
          ...node.styles,
          [mode]: { ...(node.styles?.[mode] || {}), ...styles }
        }
      }));
      return pushHistory(state, newNodes);
    }),

    addNode: (node, parentId, index) => set((state) => {
      const newNode = { ...node, id: node.id || uuidv4() };
      const newNodes = addNodeToTree(state.nodes, newNode, parentId, index);
      return pushHistory(state, newNodes);
    }),

    removeNode: (id) => set((state) => {
      const newNodes = removeNodeFromTree(state.nodes, id);
      const updates = pushHistory(state, newNodes);
      if (state.selectedNodeId === id) {
        Object.assign(updates, { selectedNodeId: null });
      }
      return updates;
    }),

    duplicateNode: (id) => set((state) => {
      const { node, parentId } = findNodeAndParent(state.nodes, id);
      if (!node) return state;
      
      const duplicated = deepCloneWithNewIds(node);
      const parentList = parentId ? findNodeAndParent(state.nodes, parentId).node?.children : state.nodes;
      
      if (!parentList) return state;
      const index = parentList.findIndex((n: BuilderNode) => n.id === id);
      const newNodes = addNodeToTree(state.nodes, duplicated, parentId, index + 1);
      
      return pushHistory(state, newNodes);
    }),

    moveNode: (id, targetParentId, index) => set((state) => {
      const { node } = findNodeAndParent(state.nodes, id);
      if (!node) return state;

      let newNodes = removeNodeFromTree(state.nodes, id);
      newNodes = addNodeToTree(newNodes, node, targetParentId === "root" ? undefined : targetParentId, index);
      
      return pushHistory(state, newNodes);
    }),

    undo: () => set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        nodes: previous,
        past: newPast,
        future: [state.nodes, ...state.future],
        isDirty: true
      };
    }),

    redo: () => set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        nodes: next,
        past: [...state.past, state.nodes],
        future: newFuture,
        isDirty: true
      };
    })
  };
});

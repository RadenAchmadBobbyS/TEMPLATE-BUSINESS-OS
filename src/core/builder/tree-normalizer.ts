import { BuilderDocument, BuilderNode } from '@/core/builder/schemas';

type UnknownTree = unknown;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function asNode(value: unknown): BuilderNode | null {
  if (!isRecord(value)) return null;
  if (typeof value.type !== 'string') return null;

  const rawChildren = Array.isArray(value.children) ? value.children : [];
  const children = rawChildren
    .map((child) => asNode(child))
    .filter((child): child is BuilderNode => child !== null);

  return {
    id: typeof value.id === 'string' && value.id.length > 0 ? value.id : 'node-root',
    type: value.type as BuilderNode['type'],
    props: isRecord(value.props) ? (value.props as Record<string, unknown>) : {},
    styles: isRecord(value.styles) ? (value.styles as BuilderNode['styles']) : undefined,
    children,
  } as BuilderNode;
}

function createEmptyRoot(): BuilderNode {
  return {
    id: 'root',
    type: 'Container',
    props: { className: 'min-h-screen' },
    styles: {},
    children: [],
  };
}

export function toBuilderDocument(tree: UnknownTree): BuilderDocument {
  if (isRecord(tree) && isRecord(tree.root)) {
    const root = asNode(tree.root);
    if (root) {
      return {
        version: typeof tree.version === 'number' ? tree.version : 1,
        root,
      };
    }
  }

  if (Array.isArray(tree)) {
    const children = tree
      .map((item) => asNode(item))
      .filter((item): item is BuilderNode => item !== null);

    return {
      version: 1,
      root: {
        id: 'root',
        type: 'Container',
        props: { className: 'min-h-screen' },
        styles: {},
        children,
      },
    };
  }

  const node = asNode(tree);
  if (node) {
    return {
      version: 1,
      root: node,
    };
  }

  return {
    version: 1,
    root: createEmptyRoot(),
  };
}

export function toRenderableRoot(tree: UnknownTree): BuilderNode | null {
  const doc = toBuilderDocument(tree);
  return doc.root || null;
}

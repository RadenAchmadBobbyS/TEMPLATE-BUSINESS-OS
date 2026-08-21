import { v4 as uuidv4 } from 'uuid';

export function generateId() {
  return uuidv4();
}

export function buildRoot(children: any[]) {
  return {
    version: 1,
    root: {
      id: 'root',
      type: 'Container',
      props: { className: 'w-full min-h-screen p-0 m-0 max-w-full font-sans' },
      children,
    },
  };
}

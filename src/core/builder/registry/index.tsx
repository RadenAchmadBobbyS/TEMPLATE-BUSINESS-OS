import React from 'react';
import { ComponentType } from '@/core/builder/schemas';

export interface ComponentMetadata {
  type: ComponentType;
  label: string;
  category: 'Layout' | 'Content' | 'Business' | 'Navigation';
  icon?: string;
  defaultProps: Record<string, any>;
  defaultStyles?: Record<string, any>;
  allowedParents?: ComponentType[];
  allowedChildren?: ComponentType[] | 'all' | 'none';
  render: React.FC<any>;
}

const getStyles = (styles: any, mode: 'desktop' | 'tablet' | 'mobile', previewMode: boolean) => {
  // Simplistic way to get responsive styles
  const base = styles?.desktop || {};
  // If we had more robust resolution we'd merge down desktop -> tablet -> mobile based on current mode
  const current = styles?.[mode] || base;
  return current;
};

// ==========================================
// Base Component Implementations
// ==========================================

const Container = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`mx-auto min-h-[50px] w-full max-w-7xl p-4 ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};

const Section = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <section
      className={`relative w-full px-4 py-12 ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {children}
    </section>
  );
};

const Stack = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div className={`flex flex-col gap-4 ${className || ''}`} style={inlineStyles} {...props}>
      {children}
    </div>
  );
};

const Grid = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};

const Columns = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`flex w-full flex-col gap-6 md:flex-row ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};

const Text = ({ text, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <p
      className={`text-foreground/80 text-base ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {text || 'Double click to edit text'}
    </p>
  );
};

const Heading = ({ text, level = 2, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  const Tag = `h${level}` as any;
  const sizeClass =
    level === 1 ? 'text-4xl' : level === 2 ? 'text-3xl' : level === 3 ? 'text-2xl' : 'text-xl';
  return (
    <Tag
      className={`text-foreground font-bold tracking-tight ${sizeClass} ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {text || 'Heading'}
    </Tag>
  );
};

const ButtonComponent = ({
  text,
  href,
  variant = 'default',
  className,
  styles,
  mode,
  previewMode,
  ...props
}: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2 h-9';
  const variantClasses =
    variant === 'default'
      ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';

  if (previewMode && href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${variantClasses} ${className || ''}`}
        style={inlineStyles}
        {...props}
      >
        {text || 'Click Me'}
      </a>
    );
  }
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {text || 'Click Me'}
    </button>
  );
};

const ImageComponent = ({
  src,
  alt,
  className,
  styles,
  mode,
  previewMode,
  children: _children,
  ...props
}: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        src ||
        'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop'
      }
      alt={alt || 'Builder image'}
      className={`h-auto max-w-full rounded-md object-cover ${className || ''}`}
      style={inlineStyles}
      {...props}
    />
  );
};

const Divider = ({ className, styles, mode, previewMode, children: _children, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <hr
      className={`border-border my-4 w-full border-t ${className || ''}`}
      style={inlineStyles}
      {...props}
    />
  );
};

const Spacer = ({ height = '2rem', className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div style={{ height, ...inlineStyles }} className={`w-full ${className || ''}`} {...props} />
  );
};

const Card = ({ children, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border p-6 shadow-sm ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};

const Feature = ({
  title,
  description,
  icon,
  className,
  styles,
  mode,
  previewMode,
  ...props
}: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div className={`flex flex-col gap-2 p-4 ${className || ''}`} style={inlineStyles} {...props}>
      <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-full font-bold">
        {icon || '★'}
      </div>
      <h3 className="text-lg font-semibold">{title || 'Feature Title'}</h3>
      <p className="text-muted-foreground text-sm">
        {description || 'Feature description goes here.'}
      </p>
    </div>
  );
};

const CTA = ({
  title,
  description,
  buttonText,
  className,
  styles,
  mode,
  previewMode,
  ...props
}: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`bg-primary/5 flex flex-col items-center justify-center rounded-xl p-12 text-center ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      <h2 className="mb-4 text-3xl font-bold">{title || 'Ready to get started?'}</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        {description || 'Join thousands of users today.'}
      </p>
      <ButtonComponent
        text={buttonText || 'Get Started'}
        variant="default"
        mode={mode}
        previewMode={previewMode}
      />
    </div>
  );
};

const Navbar = ({ logoText, links, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  const navLinks = links || [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ];
  return (
    <header
      className={`bg-background sticky top-0 z-10 w-full border-b ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="text-xl font-bold tracking-tight">{logoText || 'Brand'}</div>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navLinks.map((link: any, i: number) => (
            <a
              key={i}
              href={link.href}
              className="hover:text-foreground/80 text-foreground/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

const Footer = ({ text, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <footer
      className={`bg-muted/20 w-full border-t py-8 ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      <div className="text-muted-foreground mx-auto max-w-7xl px-4 text-center text-sm">
        {text || '© 2026 Your Company. All rights reserved.'}
      </div>
    </footer>
  );
};

const CmsListRender = ({ modelId, limit, className, styles, mode, previewMode, ...props }: any) => {
  const inlineStyles = getStyles(styles, mode, previewMode);
  return (
    <div
      className={`border-primary/30 bg-primary/5 rounded-lg border-2 border-dashed p-6 text-center ${className || ''}`}
      style={inlineStyles}
      {...props}
    >
      <h3 className="text-primary mb-2 font-semibold">Dynamic CMS Collection</h3>
      <p className="text-muted-foreground text-sm">
        {modelId ? `Bound to Model ID: ${modelId}` : 'Select a CMS Model to render entries here.'}
      </p>
      {limit && (
        <p className="text-muted-foreground mt-2 text-xs">Displaying up to {limit} items.</p>
      )}
    </div>
  );
};

// ==========================================
// Registry Array for Sidebar Generation
// ==========================================

export const componentsList: ComponentMetadata[] = [
  // Layout
  {
    type: 'Section',
    label: 'Section',
    category: 'Layout',
    defaultProps: {},
    allowedChildren: 'all',
    render: Section,
  },
  {
    type: 'Container',
    label: 'Container',
    category: 'Layout',
    defaultProps: {},
    allowedChildren: 'all',
    render: Container,
  },
  {
    type: 'Stack',
    label: 'Stack',
    category: 'Layout',
    defaultProps: {},
    allowedChildren: 'all',
    render: Stack,
  },
  {
    type: 'Grid',
    label: 'Grid',
    category: 'Layout',
    defaultProps: {},
    allowedChildren: 'all',
    render: Grid,
  },
  {
    type: 'Columns',
    label: 'Columns',
    category: 'Layout',
    defaultProps: {},
    allowedChildren: 'all',
    render: Columns,
  },

  // Content
  {
    type: 'Heading',
    label: 'Heading',
    category: 'Content',
    defaultProps: { text: 'New Heading', level: 2 },
    allowedChildren: 'none',
    render: Heading,
  },
  {
    type: 'Text',
    label: 'Text',
    category: 'Content',
    defaultProps: { text: 'Enter your text here.' },
    allowedChildren: 'none',
    render: Text,
  },
  {
    type: 'Button',
    label: 'Button',
    category: 'Content',
    defaultProps: { text: 'Click Me', variant: 'default', href: '' },
    allowedChildren: 'none',
    render: ButtonComponent,
  },
  {
    type: 'Image',
    label: 'Image',
    category: 'Content',
    defaultProps: { src: '', alt: 'Image' },
    allowedChildren: 'none',
    render: ImageComponent,
  },
  {
    type: 'Divider',
    label: 'Divider',
    category: 'Content',
    defaultProps: {},
    allowedChildren: 'none',
    render: Divider,
  },
  {
    type: 'Spacer',
    label: 'Spacer',
    category: 'Content',
    defaultProps: { height: '2rem' },
    allowedChildren: 'none',
    render: Spacer,
  },

  // Business
  {
    type: 'Card',
    label: 'Card',
    category: 'Business',
    defaultProps: {},
    allowedChildren: 'all',
    render: Card,
  },
  {
    type: 'Feature',
    label: 'Feature',
    category: 'Business',
    defaultProps: { title: 'Great Feature', description: 'This feature is amazing.', icon: '★' },
    allowedChildren: 'none',
    render: Feature,
  },
  {
    type: 'CTA',
    label: 'Call to Action',
    category: 'Business',
    defaultProps: {
      title: 'Ready to start?',
      description: 'Join us today.',
      buttonText: 'Get Started',
    },
    allowedChildren: 'none',
    render: CTA,
  },

  // Navigation
  {
    type: 'Navbar',
    label: 'Navbar',
    category: 'Navigation',
    defaultProps: { logoText: 'Brand' },
    allowedChildren: 'none',
    render: Navbar,
  },
  {
    type: 'Footer',
    label: 'Footer',
    category: 'Navigation',
    defaultProps: { text: '© 2026 Your Company.' },
    allowedChildren: 'none',
    render: Footer,
  },

  // Dynamic Content (CMS)
  {
    type: 'CmsList',
    label: 'CMS Collection',
    category: 'Content',
    defaultProps: { modelId: '', limit: 10 },
    allowedChildren: 'none',
    render: CmsListRender,
  },
];

export const componentRegistry: Record<ComponentType, ComponentMetadata> = componentsList.reduce(
  (acc, comp) => {
    acc[comp.type] = comp;
    return acc;
  },
  {} as Record<ComponentType, ComponentMetadata>,
);

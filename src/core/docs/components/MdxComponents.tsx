import React from "react";
import { cn } from "@/shared/utils";
import { AlertTriangle, Info, Lightbulb, Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/shared/ui/alert";
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import Link from "next/link";

// Headings with auto-generated IDs
const generateId = (children: React.ReactNode) => {
  if (typeof children === "string") {
    return children.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }
  return undefined;
};

const H2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id = generateId(children);
  return (
    <h2 id={id} className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b" {...props}>
      {children}
    </h2>
  );
};

const H3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id = generateId(children);
  return (
    <h3 id={id} className="text-xl font-semibold tracking-tight mt-8 mb-4" {...props}>
      {children}
    </h3>
  );
};

// Callout component
type CalloutProps = {
  type?: "default" | "info" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
};

export const Callout = ({ type = "default", title, children }: CalloutProps) => {
  const Icon = {
    default: Lightbulb,
    info: Info,
    warning: AlertTriangle,
    error: AlertTriangle,
  }[type];

  const variant = (type === "error" || type === "warning") ? "destructive" : "default";

  return (
    <Alert variant={variant} className="my-6">
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

// Card Component
export const Card = ({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) => {
  const content = (
    <UICard className="h-full hover:bg-muted/50 transition-colors">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {children}
      </CardContent>
    </UICard>
  );

  if (href) {
    return <Link href={href} className="block no-underline">{content}</Link>;
  }

  return content;
};

export const CardGrid = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">{children}</div>;
};

export const CodeBlock = ({ children, className }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <div className="relative my-6 rounded-lg border bg-[var(--paper)] overflow-hidden shadow-[4px_4px_0px_var(--ink)] border-[var(--ink)] border-2">
      <div className="flex items-center px-4 py-2 border-b-2 border-[var(--ink)] bg-muted text-[var(--ink)] text-xs font-semibold">
        <Terminal className="h-4 w-4 mr-2" />
        Terminal
      </div>
      <div className="p-4 overflow-x-auto text-sm text-[var(--ink)]">
        <code className={className}>{children}</code>
      </div>
    </div>
  );
};

export const MdxComponents = {
  h2: H2,
  h3: H3,
  Callout,
  Card,
  CardGrid,
  CodeBlock,
  pre: ({ children, ...props }: any) => <pre className="my-6 rounded-lg border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[4px_4px_0px_var(--ink)] p-4 overflow-x-auto text-sm text-[var(--ink)]" {...props}>{children}</pre>,
  code: ({ children, className, ...props }: any) => {
    if (!className) return <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono border border-[var(--ink)]" {...props}>{children}</code>;
    return <code className={className} {...props}>{children}</code>;
  },
  a: ({ href, children, ...props }: any) => (
    <Link href={href || "#"} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80" {...props}>
      {children}
    </Link>
  ),
  p: ({ children, ...props }: any) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground" {...props}>{children}</p>,
  ul: ({ children, ...props }: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground" {...props}>{children}</ul>,
  ol: ({ children, ...props }: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground" {...props}>{children}</ol>,
  li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
};

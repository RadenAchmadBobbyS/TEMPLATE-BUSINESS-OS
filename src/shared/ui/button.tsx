import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--signal)] text-white hover:-translate-y-0.5 shadow-[2px_2px_0px_var(--ink)] border-2 border-[var(--ink)]',
        outline: 'border-2 border-[var(--ink)] bg-transparent hover:bg-black/5 text-[var(--ink)]',
        secondary:
          'bg-[var(--paper)] border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-black/5',
        ghost: 'hover:bg-black/5 text-[var(--ink)] hover:text-[var(--ink)]',
        destructive:
          'bg-destructive/10 text-white border-2 border-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
        link: 'text-[var(--signal)] underline-offset-4 hover:underline',
      },

      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',

        xs: "h-6 gap-1 rounded-none px-2 text-xs in-data-[slot=button-group]:rounded-none has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

        sm: "h-7 gap-1 rounded-none px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-none has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",

        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',

        icon: 'size-8 rounded-none',

        'icon-xs':
          "size-6 rounded-none in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3",

        'icon-sm': 'size-7 rounded-none in-data-[slot=button-group]:rounded-none',

        'icon-lg': 'size-9',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  style,
  ...props
}: ButtonProps & { style?: React.CSSProperties }) {
  const mergedStyle = { fontFamily: 'Inter, sans-serif', ...style };

  const isCustomRender = asChild || props.render !== undefined;

  if (isCustomRender) {
    const { children, render, ...rest } = props;
    const renderElement = render || (React.isValidElement(children) ? children : undefined);

    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        nativeButton={false}
        render={renderElement}
        style={mergedStyle}
        {...rest}
      />
    );
  }

  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={true}
      style={mergedStyle}
      {...props}
    />
  );
}

export { Button, buttonVariants };

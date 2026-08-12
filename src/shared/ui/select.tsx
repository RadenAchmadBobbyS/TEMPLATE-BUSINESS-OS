"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentProps<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "font-data flex h-9 w-full items-center justify-between gap-2 rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-2 text-xs outline-none transition-colors",
      "focus-visible:ring-2 focus-visible:ring-[var(--signal)]",
      "data-[popup-open]:ring-2 data-[popup-open]:ring-[var(--signal)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDown className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--slate)" }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Popup>,
  React.ComponentProps<typeof SelectPrimitive.Popup> & { sideOffset?: number }
>(({ className, children, sideOffset = 6, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner sideOffset={sideOffset} className="z-50 outline-none">
      <SelectPrimitive.Popup
        ref={ref}
        data-slot="select-content"
        className={cn(
          "max-h-[300px] min-w-[var(--anchor-width)] overflow-y-auto rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] p-1",
          className
        )}
        style={{ boxShadow: "4px 4px 0px var(--ink)" }}
        {...props}
      >
        {children}
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("font-data px-2 py-1.5 text-[10px] uppercase tracking-wider", className)}
      style={{ color: "var(--slate)" }}
      {...props}
    />
  );
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "font-data relative flex w-full cursor-default select-none items-center gap-2 rounded-none py-1.5 pl-2 pr-8 text-xs outline-none",
      "data-[highlighted]:bg-[rgba(36,81,255,0.08)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    style={{ color: "var(--ink)" }}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
      <Check className="h-3.5 w-3.5" style={{ color: "var(--signal)" }} />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px", className)}
      style={{ backgroundColor: "var(--line)" }}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
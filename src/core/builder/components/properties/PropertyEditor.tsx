import React from "react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { BuilderNode, DeviceMode } from "@/core/builder/types";
import { useBuilderStore } from "@/core/builder/store";

export const SectionProps = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-data">
      {title}
    </h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

export const PropInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    <Input className="h-8 text-xs" placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)} />
  </div>
);

export const PropTextarea = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    <Textarea className="text-xs min-h-[60px]" placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)} />
  </div>
);

export const PropSelect = ({ label, value, onChange, options }: any) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs">
        <SelectValue placeholder="Default" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Default</SelectItem>
        {options.map((opt: any) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export function ContentProps({ node }: { node: BuilderNode }) {
  const { updateNodeProps } = useBuilderStore();
  const update = (key: string, value: string) => updateNodeProps(node.id, { [key]: value });
  
  if (!["Heading", "Text", "Button", "Image", "Feature", "CTA", "Navbar", "Footer"].includes(node.type)) return null;

  return (
    <SectionProps title="Content">
      {(node.type === "Heading" || node.type === "Text") && (
        <PropTextarea label="Text Content" value={node.props.text} onChange={(val: string) => update("text", val)} />
      )}
      {(node.type === "Button") && (
        <>
          <PropInput label="Label" value={node.props.text} onChange={(val: string) => update("text", val)} />
          <PropInput label="Link (href)" value={node.props.href} onChange={(val: string) => update("href", val)} />
          <PropSelect label="Variant" value={node.props.variant} onChange={(val: string) => update("variant", val)} options={[
            { value: "default", label: "Default" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" }
          ]} />
        </>
      )}
      {(node.type === "Image") && (
        <>
          <PropInput label="Image Source (URL)" value={node.props.src} onChange={(val: string) => update("src", val)} />
          <PropInput label="Alt Text" value={node.props.alt} onChange={(val: string) => update("alt", val)} />
        </>
      )}
      {(node.type === "Feature") && (
        <>
          <PropInput label="Title" value={node.props.title} onChange={(val: string) => update("title", val)} />
          <PropTextarea label="Description" value={node.props.description} onChange={(val: string) => update("description", val)} />
        </>
      )}
    </SectionProps>
  );
}

export function LayoutProps({ node, deviceMode }: { node: BuilderNode, deviceMode: DeviceMode }) {
  const { updateNodeStyles } = useBuilderStore();
  const styles = node.styles?.[deviceMode] || {};
  const update = (key: string, value: string) => updateNodeStyles(node.id, { [key]: value }, deviceMode);
  
  return (
    <SectionProps title="Layout">
      <div className="grid grid-cols-2 gap-2">
        <PropSelect label="Display" value={styles.display} onChange={(val: string) => update("display", val)} options={[
          { value: "block", label: "Block" },
          { value: "flex", label: "Flex" },
          { value: "grid", label: "Grid" },
          { value: "inline-block", label: "Inline Block" },
          { value: "none", label: "None" }
        ]} />
        <PropSelect label="Direction" value={styles.flexDirection} onChange={(val: string) => update("flexDirection", val)} options={[
          { value: "row", label: "Row" },
          { value: "column", label: "Column" }
        ]} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropSelect label="Align" value={styles.alignItems} onChange={(val: string) => update("alignItems", val)} options={[
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "stretch", label: "Stretch" }
        ]} />
        <PropSelect label="Justify" value={styles.justifyContent} onChange={(val: string) => update("justifyContent", val)} options={[
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "space-between", label: "Space Between" }
        ]} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropInput label="Width" value={styles.width} placeholder="e.g. 100%, 300px" onChange={(val: string) => update("width", val)} />
        <PropInput label="Height" value={styles.height} placeholder="e.g. auto, 100vh" onChange={(val: string) => update("height", val)} />
      </div>
    </SectionProps>
  );
}

export function SpacingProps({ node, deviceMode }: { node: BuilderNode, deviceMode: DeviceMode }) {
  const { updateNodeStyles } = useBuilderStore();
  const styles = node.styles?.[deviceMode] || {};
  const update = (key: string, value: string) => updateNodeStyles(node.id, { [key]: value }, deviceMode);

  return (
    <SectionProps title="Spacing">
      <div className="grid grid-cols-2 gap-2">
        <PropInput label="Padding" value={styles.padding} placeholder="1rem" onChange={(val: string) => update("padding", val)} />
        <PropInput label="Margin" value={styles.margin} placeholder="0 auto" onChange={(val: string) => update("margin", val)} />
        <PropInput label="Gap" value={styles.gap} placeholder="16px" onChange={(val: string) => update("gap", val)} />
      </div>
    </SectionProps>
  );
}

export function TypographyProps({ node, deviceMode }: { node: BuilderNode, deviceMode: DeviceMode }) {
  const { updateNodeStyles, updateNodeProps } = useBuilderStore();
  const styles = node.styles?.[deviceMode] || {};
  const update = (key: string, value: string) => updateNodeStyles(node.id, { [key]: value }, deviceMode);

  if (!["Heading", "Text", "Button"].includes(node.type)) return null;

  return (
    <SectionProps title="Typography">
      {node.type === "Heading" && (
        <PropSelect 
          label="Heading Level" 
          value={String(node.props.level || 2)} 
          onChange={(val: string) => updateNodeProps(node.id, { level: parseInt(val, 10) })} 
          options={[
            { value: "1", label: "H1" },
            { value: "2", label: "H2" },
            { value: "3", label: "H3" },
            { value: "4", label: "H4" },
            { value: "5", label: "H5" },
            { value: "6", label: "H6" }
          ]} 
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <PropInput label="Font Size" value={styles.fontSize} placeholder="16px, 1.2rem" onChange={(val: string) => update("fontSize", val)} />
        <PropSelect label="Font Weight" value={styles.fontWeight} onChange={(val: string) => update("fontWeight", val)} options={[
          { value: "normal", label: "Normal" },
          { value: "500", label: "Medium" },
          { value: "bold", label: "Bold" }
        ]} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropSelect label="Text Align" value={styles.textAlign} onChange={(val: string) => update("textAlign", val)} options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" }
        ]} />
        <PropInput label="Line Height" value={styles.lineHeight} placeholder="1.5" onChange={(val: string) => update("lineHeight", val)} />
      </div>
    </SectionProps>
  );
}

export function ColorsProps({ node, deviceMode }: { node: BuilderNode, deviceMode: DeviceMode }) {
  const { updateNodeStyles } = useBuilderStore();
  const styles = node.styles?.[deviceMode] || {};
  const update = (key: string, value: string) => updateNodeStyles(node.id, { [key]: value }, deviceMode);

  return (
    <SectionProps title="Colors">
      <div className="grid grid-cols-2 gap-2">
        <PropInput label="Text Color" value={styles.color} placeholder="var(--color-primary)" onChange={(val: string) => update("color", val)} />
        <PropInput label="Background" value={styles.backgroundColor} placeholder="#ffffff" onChange={(val: string) => update("backgroundColor", val)} />
      </div>
    </SectionProps>
  );
}

export function BorderProps({ node, deviceMode }: { node: BuilderNode, deviceMode: DeviceMode }) {
  const { updateNodeStyles } = useBuilderStore();
  const styles = node.styles?.[deviceMode] || {};
  const update = (key: string, value: string) => updateNodeStyles(node.id, { [key]: value }, deviceMode);

  return (
    <SectionProps title="Border & Effects">
      <div className="grid grid-cols-2 gap-2">
        <PropInput label="Border Radius" value={styles.borderRadius} placeholder="8px" onChange={(val: string) => update("borderRadius", val)} />
        <PropInput label="Border" value={styles.border} placeholder="1px solid #ccc" onChange={(val: string) => update("border", val)} />
        <PropInput label="Opacity" value={styles.opacity} placeholder="1" onChange={(val: string) => update("opacity", val)} />
        <PropInput label="Box Shadow" value={styles.boxShadow} placeholder="0 4px 6px rgba..." onChange={(val: string) => update("boxShadow", val)} />
      </div>
    </SectionProps>
  );
}

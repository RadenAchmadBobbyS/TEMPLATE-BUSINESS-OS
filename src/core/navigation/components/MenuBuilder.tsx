"use client";

import { useState } from "react";
import { MenuItemInput } from "@/core/websites/schemas";
import { saveNavigation } from "@/core/navigation/actions";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, Save, Loader2, Link as LinkIcon, Hash, FileText, AlertCircle } from "lucide-react";

export function MenuBuilder({ website, initialNav, pages }: { website: any, initialNav: any, pages: any[] }) {
  const [navbar, setNavbar] = useState<MenuItemInput[]>(initialNav?.navbar || []);
  const [footer, setFooter] = useState<MenuItemInput[]>(initialNav?.footer || []);
  const [activeTab, setActiveTab] = useState<"navbar" | "footer">("navbar");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentMenu = activeTab === "navbar" ? navbar : footer;
  const setCurrentMenu = activeTab === "navbar" ? setNavbar : setFooter;

  const handleAddItem = (parentId?: string) => {
    const newItem: MenuItemInput = {
      id: uuidv4(),
      label: "New Link",
      type: "page",
      target: "",
      pageId: pages.length > 0 ? pages[0].id : undefined,
      children: [],
    };

    if (!parentId) {
      setCurrentMenu([...currentMenu, newItem]);
      return;
    }

    const addChild = (items: MenuItemInput[]): MenuItemInput[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...(item.children || []), newItem] };
        }
        if (item.children) {
          return { ...item, children: addChild(item.children) };
        }
        return item;
      });
    };

    setCurrentMenu(addChild(currentMenu));
  };

  const handleUpdateItem = (id: string, updates: Partial<MenuItemInput>) => {
    const updateNode = (items: MenuItemInput[]): MenuItemInput[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return { ...item, children: updateNode(item.children) };
        }
        return item;
      });
    };
    setCurrentMenu(updateNode(currentMenu));
  };

  const handleRemoveItem = (id: string) => {
    const removeNode = (items: MenuItemInput[]): MenuItemInput[] => {
      return items.filter(item => item.id !== id).map(item => {
        if (item.children) {
          return { ...item, children: removeNode(item.children) };
        }
        return item;
      });
    };
    setCurrentMenu(removeNode(currentMenu));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveNavigation(website.id, { navbar, footer });
      toast({ title: "Navigation saved successfully" });
    } catch (error: any) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTree = (items: MenuItemInput[], level: number = 0) => {
    return (
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="relative">
            <div 
              className="flex items-start gap-4 p-4 bg-background border rounded-lg hover:border-primary/50 transition-colors"
              style={{ marginLeft: `${level * 2}rem` }}
            >
              <div className="mt-2 text-muted-foreground cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input 
                    value={item.label} 
                    onChange={e => handleUpdateItem(item.id, { label: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link Type</Label>
                  <Select 
                    value={item.type} 
                    onValueChange={(val: any) => handleUpdateItem(item.id, { type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page"><div className="flex items-center"><FileText className="h-4 w-4 mr-2"/> Internal Page</div></SelectItem>
                      <SelectItem value="external"><div className="flex items-center"><LinkIcon className="h-4 w-4 mr-2"/> External URL</div></SelectItem>
                      <SelectItem value="anchor"><div className="flex items-center"><Hash className="h-4 w-4 mr-2"/> Anchor Tag</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target / URL</Label>
                  {item.type === "page" ? (
                    <Select 
                      value={item.pageId || ""} 
                      onValueChange={(val: any) => handleUpdateItem(item.id, { pageId: val, target: undefined })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title} <span className="text-muted-foreground ml-2">({p.slug})</span>
                          </SelectItem>
                        ))}
                        {pages.length === 0 && (
                          <div className="py-1.5 pl-8 pr-2 text-sm text-muted-foreground">No pages found</div>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={item.target || ""} 
                      onChange={e => handleUpdateItem(item.id, { target: e.target.value, pageId: undefined })} 
                      placeholder={item.type === 'anchor' ? '#contact' : 'https://...'}
                    />
                  )}
                  {item.type === "external" && item.target && !item.target.startsWith("http") && (
                    <p className="text-xs text-destructive flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" /> Must start with http:// or https://
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
                {level < 2 && ( // Restrict to 3 levels deep max
                  <Button variant="ghost" size="icon" onClick={() => handleAddItem(item.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {item.children && item.children.length > 0 && (
              <div className="mt-2 border-l-2 border-muted ml-6 pl-2 space-y-2">
                {renderTree(item.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant={activeTab === "navbar" ? "default" : "ghost"} 
            onClick={() => setActiveTab("navbar")}
            className="w-32"
          >
            Main Navbar
          </Button>
          <Button 
            variant={activeTab === "footer" ? "default" : "ghost"} 
            onClick={() => setActiveTab("footer")}
            className="w-32"
          >
            Footer Links
          </Button>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Navigation
        </Button>
      </div>

      <div className="bg-muted/20 border rounded-lg p-6 min-h-[400px]">
        {currentMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>No links configured yet.</p>
            <Button variant="link" onClick={() => handleAddItem()}>Add your first link</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {renderTree(currentMenu)}
            <Button variant="outline" className="w-full mt-4 border-dashed" onClick={() => handleAddItem()}>
              <Plus className="mr-2 h-4 w-4" /> Add Top-Level Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

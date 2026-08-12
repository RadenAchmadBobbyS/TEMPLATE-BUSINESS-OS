import { MenuItemInput } from "@/core/websites/schemas";

/**
 * Deep clones a node tree (JSON) and replaces any occurrences of a specific key
 * (like `pageId`) with a new mapped value.
 * @param obj The JSON object to clone (nodeTree)
 * @param idMap A mapping from templatePageId to websitePageId
 */
export function deepCloneAndRemapIds(obj: any, idMap: Record<string, string>): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCloneAndRemapIds(item, idMap));
  }

  const cloned: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === "pageId" && typeof obj[key] === "string" && idMap[obj[key]]) {
        cloned[key] = idMap[obj[key]];
      } else {
        cloned[key] = deepCloneAndRemapIds(obj[key], idMap);
      }
    }
  }

  return cloned;
}

/**
 * Recursively remaps pageIds in a navigation tree.
 */
export function remapNavigationItems(items: MenuItemInput[] | undefined, idMap: Record<string, string>): MenuItemInput[] {
  if (!items) return [];
  
  return items.map((item) => {
    const newItem = { ...item };
    if (newItem.pageId && idMap[newItem.pageId]) {
      newItem.pageId = idMap[newItem.pageId];
    }
    if (newItem.children) {
      newItem.children = remapNavigationItems(newItem.children, idMap);
    }
    return newItem;
  });
}

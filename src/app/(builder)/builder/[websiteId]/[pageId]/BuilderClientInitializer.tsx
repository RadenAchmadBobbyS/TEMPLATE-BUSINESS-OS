"use client";

import { useEffect, useRef } from "react";
import { useBuilderStore } from "@/core/builder/store";
import { BuilderDocument } from "@/core/builder/schemas";

export function BuilderClientInitializer({ 
  document, 
  isReadOnly,
  children 
}: { 
  document: BuilderDocument, 
  isReadOnly?: boolean,
  children: React.ReactNode 
}) {
  const { loadDocument } = useBuilderStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      loadDocument(document, isReadOnly);
      initialized.current = true;
    }
  }, [document, loadDocument, isReadOnly]);

  return <>{children}</>;
}

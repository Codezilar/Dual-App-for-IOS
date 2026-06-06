"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";

export function WorkspaceDataLoader() {
  const loaded = useWorkspaceStore((state) => state.loaded);
  const loadInstances = useWorkspaceStore((state) => state.loadInstances);

  useEffect(() => {
    if (!loaded) void loadInstances();
  }, [loadInstances, loaded]);

  return null;
}

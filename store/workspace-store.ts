"use client";

import { create } from "zustand";
import { getAppByType } from "@/lib/app-catalog";
import { createProfileNamespace } from "@/lib/utils";
import { initialInstances } from "@/lib/mock-data";
import type { AppType, InstanceStatus, WorkspaceInstance } from "@/lib/types";

type ViewMode = "grid" | "list";

type WorkspaceState = {
  instances: WorkspaceInstance[];
  search: string;
  viewMode: ViewMode;
  selectedFolder: string | "all";
  setSearch: (search: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSelectedFolder: (folder: string | "all") => void;
  createInstance: (appType: AppType) => void;
  duplicateInstance: (id: string) => void;
  renameInstance: (id: string, name: string) => void;
  deleteInstance: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateStatus: (id: string, status: InstanceStatus) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  instances: initialInstances,
  search: "",
  viewMode: "grid",
  selectedFolder: "all",
  setSearch: (search) => set({ search }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
  createInstance: (appType) => {
    const app = getAppByType(appType);
    const existing = get().instances.filter((instance) => instance.appType === appType).length;
    const profile = createProfileNamespace();
    const id = `${appType}-${crypto.randomUUID()}`;
    set((state) => ({
      instances: [
        {
          id,
          name: `${app.name} #${existing + 1}`,
          appType,
          launchUrl: app.url,
          logoUrl: app.logo,
          profileId: profile.profileId,
          cookieStore: profile.cookieStore,
          status: "OFFLINE",
          favorite: false,
          createdAt: new Date().toISOString()
        },
        ...state.instances
      ]
    }));
  },
  duplicateInstance: (id) => {
    const source = get().instances.find((instance) => instance.id === id);
    if (!source) return;
    const profile = createProfileNamespace();
    set((state) => ({
      instances: [
        {
          ...source,
          id: `${source.appType}-${crypto.randomUUID()}`,
          name: `${source.name} Copy`,
          profileId: profile.profileId,
          cookieStore: profile.cookieStore,
          status: "OFFLINE",
          favorite: false,
          createdAt: new Date().toISOString(),
          lastActivity: undefined
        },
        ...state.instances
      ]
    }));
  },
  renameInstance: (id, name) =>
    set((state) => ({
      instances: state.instances.map((instance) => (instance.id === id ? { ...instance, name } : instance))
    })),
  deleteInstance: (id) => set((state) => ({ instances: state.instances.filter((instance) => instance.id !== id) })),
  toggleFavorite: (id) =>
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, favorite: !instance.favorite } : instance
      )
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, status, lastActivity: new Date().toISOString() } : instance
      )
    }))
}));

"use client";

import { create } from "zustand";
import { getAppByType } from "@/lib/app-catalog";
import type { AppType, InstanceStatus, WorkspaceInstance } from "@/lib/types";

type ViewMode = "grid" | "list";

type WorkspaceState = {
  instances: WorkspaceInstance[];
  loaded: boolean;
  loading: boolean;
  search: string;
  viewMode: ViewMode;
  selectedFolder: string | "all";
  loadInstances: () => Promise<void>;
  setSearch: (search: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSelectedFolder: (folder: string | "all") => void;
  createInstance: (appType: AppType) => Promise<void>;
  duplicateInstance: (id: string) => Promise<void>;
  renameInstance: (id: string, name: string) => Promise<void>;
  deleteInstance: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateStatus: (id: string, status: InstanceStatus) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  instances: [],
  loaded: false,
  loading: false,
  search: "",
  viewMode: "grid",
  selectedFolder: "all",
  loadInstances: async () => {
    if (get().loading) return;
    set({ loading: true });
    const response = await fetch("/api/instances");
    if (!response.ok) {
      set({ loading: false, loaded: true, instances: [] });
      return;
    }
    const payload = (await response.json()) as { instances: ApiInstance[] };
    set({ instances: payload.instances.map(toWorkspaceInstance), loading: false, loaded: true });
  },
  setSearch: (search) => set({ search }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
  createInstance: async (appType) => {
    const app = getAppByType(appType);
    const existing = get().instances.filter((instance) => instance.appType === appType).length;
    const response = await fetch("/api/instances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appType, name: `${app.name} #${existing + 1}` })
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { instance: ApiInstance };
    set((state) => ({ instances: [toWorkspaceInstance(payload.instance), ...state.instances] }));
  },
  duplicateInstance: async (id) => {
    const response = await fetch(`/api/instances/${id}/duplicate`, { method: "POST" });
    if (!response.ok) return;
    const payload = (await response.json()) as { instance: ApiInstance };
    set((state) => ({ instances: [toWorkspaceInstance(payload.instance), ...state.instances] }));
  },
  renameInstance: async (id, name) => {
    const response = await fetch(`/api/instances/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) return;
    set((state) => ({
      instances: state.instances.map((instance) => (instance.id === id ? { ...instance, name } : instance))
    }));
  },
  deleteInstance: async (id) => {
    const response = await fetch(`/api/instances/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    set((state) => ({ instances: state.instances.filter((instance) => instance.id !== id) }));
  },
  toggleFavorite: async (id) => {
    const current = get().instances.find((instance) => instance.id === id);
    if (!current) return;
    const response = await fetch(`/api/instances/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !current.favorite })
    });
    if (!response.ok) return;
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, favorite: !instance.favorite } : instance
      )
    }));
  },
  updateStatus: async (id, status) => {
    const response = await fetch(`/api/instances/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) return;
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, status, lastActivity: new Date().toISOString() } : instance
      )
    }));
  }
}));

type ApiInstance = {
  _id?: string;
  id?: string;
  name: string;
  appType: AppType;
  launchUrl: string;
  logoUrl?: string;
  profileId?: string | { _id?: string; profileKey?: string; cookieStore?: string };
  cookieStore?: string;
  status?: InstanceStatus;
  favorite?: boolean;
  folderId?: string;
  lastActivity?: string;
  createdAt?: string;
};

function toWorkspaceInstance(instance: ApiInstance): WorkspaceInstance {
  const app = getAppByType(instance.appType);
  const profile = typeof instance.profileId === "object" ? instance.profileId : undefined;

  return {
    id: instance._id ?? instance.id ?? crypto.randomUUID(),
    name: instance.name,
    appType: instance.appType,
    launchUrl: instance.launchUrl,
    logoUrl: instance.logoUrl ?? app.logo,
    profileId: profile?.profileKey ?? String(instance.profileId ?? ""),
    cookieStore: instance.cookieStore ?? profile?.cookieStore ?? "",
    status: instance.status ?? "OFFLINE",
    favorite: instance.favorite ?? false,
    folder: instance.folderId,
    lastActivity: instance.lastActivity,
    createdAt: instance.createdAt ?? new Date().toISOString()
  };
}

"use client";

import { motion } from "framer-motion";
import { Activity, AppWindow, Bell, Folder, Gauge, LayoutDashboard, Plus, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { folders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Instances", icon: AppWindow },
  { label: "Monitoring", icon: Activity },
  { label: "Security", icon: ShieldCheck },
  { label: "Users", icon: Users },
  { label: "Analytics", icon: Gauge }
];

export function Sidebar() {
  const selectedFolder = useWorkspaceStore((state) => state.selectedFolder);
  const setSelectedFolder = useWorkspaceStore((state) => state.setSelectedFolder);

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r bg-background/70 p-4 backdrop-blur-xl lg:block">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <AppWindow className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Dual Workspace</p>
          <p className="text-xs text-muted-foreground">Container profiles</p>
        </div>
      </div>

      <Button className="mt-4 w-full justify-start" size="sm">
        <Plus className="h-4 w-4" />
        New instance
      </Button>

      <nav className="mt-6 space-y-1">
        {nav.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <Separator className="my-5" />

      <div className="px-3 text-xs font-medium uppercase text-muted-foreground">Folders</div>
      <div className="mt-3 space-y-1">
        <button
          onClick={() => setSelectedFolder("all")}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-accent",
            selectedFolder === "all" && "bg-accent text-foreground"
          )}
        >
          <Folder className="h-4 w-4" />
          All instances
        </button>
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-accent",
              selectedFolder === folder.id && "bg-accent text-foreground"
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: folder.color }} />
            {folder.name}
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 hidden w-64 rounded-lg border bg-card p-4 lg:block">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-4 w-4 text-primary" />
          Session health
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          7 profiles isolated, 3 active, no cross-profile leakage detected.
        </p>
      </div>
    </aside>
  );
}

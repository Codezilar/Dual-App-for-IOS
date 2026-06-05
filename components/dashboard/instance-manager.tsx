"use client";

import { AnimatePresence } from "framer-motion";
import { InstanceCard } from "@/components/dashboard/instance-card";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

export function InstanceManager() {
  const { instances, search, viewMode, selectedFolder } = useWorkspaceStore();

  const filtered = instances.filter((instance) => {
    const matchesSearch = [instance.name, instance.appType, instance.profileId, instance.cookieStore]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFolder = selectedFolder === "all" || instance.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Instance Manager</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} isolated app instances visible</p>
        </div>
        <div className="hidden text-xs text-muted-foreground md:block">Shortcut: Cmd K launch, Cmd D duplicate, / search</div>
      </div>
      {filtered.length ? (
        <div className={cn(viewMode === "grid" ? "grid gap-4 md:grid-cols-2 2xl:grid-cols-3" : "space-y-3")}>
          <AnimatePresence>
            {filtered.map((instance) => (
              <InstanceCard key={instance.id} instance={instance} compact={viewMode === "list"} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed bg-card/60 text-center">
          <div>
            <p className="text-sm font-medium">No matching instances</p>
            <p className="mt-1 text-sm text-muted-foreground">Create a new profile or adjust the current search.</p>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLaunchers } from "@/lib/mock-data";
import { useWorkspaceStore } from "@/store/workspace-store";

export function AppLauncher() {
  const createInstance = useWorkspaceStore((state) => state.createInstance);

  return (
    <section className="rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Quick Launch</h2>
          <p className="text-xs text-muted-foreground">Create a clean profile-backed app instance.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {appLaunchers.map((app, index) => (
          <motion.button
            key={app.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => createInstance(app.type)}
            className="group flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg border bg-background/70 p-3 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              <Image src={app.logo} alt="" fill className="p-2" />
            </span>
            <span className="text-xs font-medium">{app.name}</span>
            <Button type="button" variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

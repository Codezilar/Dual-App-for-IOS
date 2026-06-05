"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Play, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { WorkspaceInstance } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";

const statusColor = {
  ONLINE: "bg-emerald-500",
  OFFLINE: "bg-slate-400",
  SUSPENDED: "bg-amber-500",
  ERROR: "bg-rose-500"
};

export function InstanceCard({ instance, compact = false }: { instance: WorkspaceInstance; compact?: boolean }) {
  const duplicateInstance = useWorkspaceStore((state) => state.duplicateInstance);
  const renameInstance = useWorkspaceStore((state) => state.renameInstance);
  const deleteInstance = useWorkspaceStore((state) => state.deleteInstance);
  const toggleFavorite = useWorkspaceStore((state) => state.toggleFavorite);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className={cn("group overflow-hidden bg-card/82 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-soft", compact && "rounded-md")}>
        <CardContent className={cn("p-4", compact && "flex items-center gap-4")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                {instance.logoUrl ? <Image src={instance.logoUrl} alt="" fill className="p-2.5" /> : null}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{instance.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{instance.profileId}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(instance.id)} aria-label="Toggle favorite">
                <Star className={cn("h-4 w-4", instance.favorite && "fill-amber-400 text-amber-400")} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Instance actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => duplicateInstance(instance.id)}>
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const name = window.prompt("Rename instance", instance.name);
                      if (name) renameInstance(instance.id, name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => deleteInstance(instance.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={cn("mt-5 grid gap-3 text-xs", compact && "ml-auto mt-0 min-w-72 grid-cols-3")}>
            <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
              <span className="text-muted-foreground">Status</span>
              <Badge className="gap-1.5 border-transparent bg-background">
                <span className={cn("h-2 w-2 rounded-full", statusColor[instance.status])} />
                {instance.status.toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
              <span className="text-muted-foreground">Activity</span>
              <span>{formatRelativeTime(instance.lastActivity)}</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
              <span className="text-muted-foreground">Cookie store</span>
              <span className="max-w-28 truncate">{instance.cookieStore}</span>
            </div>
          </div>

          <div className={cn("mt-4 flex items-center gap-2", compact && "mt-0")}>
            <Button asChild className="flex-1">
              <Link href={`/browser/${instance.id}`}>
                <Play className="h-4 w-4" />
                Open
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => duplicateInstance(instance.id)} aria-label="Duplicate instance">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace-store";
import { formatRelativeTime } from "@/lib/utils";

export function RecentFavorites() {
  const instances = useWorkspaceStore((state) => state.instances);
  const favorites = instances.filter((instance) => instance.favorite).slice(0, 4);
  const recent = [...instances]
    .filter((instance) => instance.lastActivity)
    .sort((a, b) => new Date(b.lastActivity ?? 0).getTime() - new Date(a.lastActivity ?? 0).getTime())
    .slice(0, 4);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <MiniList title="Favorites" icon={Star} items={favorites} />
      <MiniList title="Recent Apps" icon={Clock} items={recent} />
    </div>
  );
}

function MiniList({
  title,
  icon: Icon,
  items
}: {
  title: string;
  icon: typeof Star;
  items: ReturnType<typeof useWorkspaceStore.getState>["instances"];
}) {
  return (
    <Card className="bg-card/80 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((instance) => (
            <div key={instance.id} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm">
              <span className="font-medium">{instance.name}</span>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(instance.lastActivity)}</span>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

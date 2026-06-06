"use client";

import { BarChart3, Gauge, PieChart, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appLaunchers } from "@/lib/mock-data";
import { useWorkspaceStore } from "@/store/workspace-store";

export function AnalyticsPage() {
  const instances = useWorkspaceStore((state) => state.instances);
  const opened = instances.filter((instance) => instance.lastActivity).length;
  const active = instances.filter((instance) => instance.status === "ONLINE").length;
  const favorites = instances.filter((instance) => instance.favorite).length;
  const byApp = appLaunchers
    .map((app) => ({
      ...app,
      count: instances.filter((instance) => instance.appType === app.type).length
    }))
    .filter((app) => app.count > 0);
  const total = Math.max(instances.length, 1);

  return (
    <DashboardShell title="Analytics" description="Measure app mix, workspace utilization, and session trends.">
      <div className="grid gap-3 md:grid-cols-3">
        <AnalyticMetric label="Total instances" value={instances.length.toString()} icon={TrendingUp} />
        <AnalyticMetric label="Active now" value={active.toString()} icon={Gauge} />
        <AnalyticMetric label="App coverage" value={byApp.length.toString()} icon={PieChart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              App Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byApp.length ? (
              byApp.map((app) => (
                <div key={app.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{app.name}</span>
                    <Badge className="border-transparent bg-background">{app.count}</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(app.count / total) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
                Create an instance to see app distribution.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm">Session Funnel</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { stage: "Created", value: instances.length },
              { stage: "Opened", value: opened },
              { stage: "Active", value: active },
              { stage: "Favorited", value: favorites }
            ].map((item) => (
              <div key={item.stage} className="rounded-md bg-muted/60 p-4">
                <p className="text-xs text-muted-foreground">{item.stage}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function AnalyticMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof TrendingUp }) {
  return (
    <Card className="bg-card/80 backdrop-blur-xl">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

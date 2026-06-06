"use client";

import { KeyRound, LockKeyhole, ShieldCheck, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace-store";

const controls = [
  { label: "Encrypted profile metadata", state: "enabled" },
  { label: "Cross-profile cookie guard", state: "enabled" },
  { label: "Gateway origin allowlist", state: "enabled" },
  { label: "Session replay exports", state: "disabled" }
];

export function SecurityPage() {
  const instances = useWorkspaceStore((state) => state.instances);
  const risk = instances.filter((instance) => instance.status === "SUSPENDED" || instance.status === "ERROR");

  return (
    <DashboardShell title="Security" description="Review isolation controls, policy status, and risky containers.">
      <div className="grid gap-3 md:grid-cols-3">
        <SecurityMetric label="Isolated profiles" value={instances.length} icon={ShieldCheck} />
        <SecurityMetric label="Risk items" value={risk.length} icon={ShieldAlert} />
        <SecurityMetric label="Key rotations" value={2} icon={KeyRound} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <LockKeyhole className="h-4 w-4 text-primary" />
              Policy Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {controls.map((control) => (
              <div key={control.label} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm">
                <span>{control.label}</span>
                <Badge className="border-transparent bg-background">{control.state}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Risk Queue</CardTitle>
            <Button size="sm" variant="outline">Export</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(risk.length ? risk : instances.slice(0, 3)).map((instance) => (
              <div key={instance.id} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{instance.name}</p>
                  <p className="text-xs text-muted-foreground">{instance.profileId}</p>
                </div>
                <Badge className="border-transparent bg-background">{instance.status.toLowerCase()}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function SecurityMetric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof ShieldCheck }) {
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

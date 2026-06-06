"use client";

import { useEffect, useState } from "react";
import { MailPlus, MoreHorizontal, Shield, UserRound, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkspaceUser = {
  _id: string;
  name?: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
};

export function UsersPage() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch("/api/users");
      if (!response.ok) return;
      const payload = (await response.json()) as { users: WorkspaceUser[] };
      setUsers(payload.users);
    }

    void loadUsers();
  }, []);

  const admins = users.filter((user) => ["OWNER", "ADMIN"].includes(user.role)).length;

  return (
    <DashboardShell title="Users" description="Manage workspace members, roles, invitations, and access boundaries.">
      <div className="grid gap-3 md:grid-cols-3">
        <UserMetric label="Members" value={users.length} icon={Users} />
        <UserMetric label="Admins" value={admins} icon={Shield} />
        <UserMetric label="Invites" value={0} icon={MailPlus} />
      </div>

      <Card className="bg-card/80 backdrop-blur-xl">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Workspace Members</CardTitle>
          <Button size="sm">
            <MailPlus className="h-4 w-4" />
            Invite
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.length ? (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name || user.email}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="border-transparent bg-background">{user.role.toLowerCase()}</Badge>
                  <Badge className="border-transparent bg-background">active</Badge>
                  <Button size="icon" variant="ghost" aria-label="User actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
              No users loaded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function UserMetric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
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

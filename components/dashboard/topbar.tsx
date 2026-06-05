"use client";

import { Bell, Grid2X2, List, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications } from "@/lib/mock-data";
import { useWorkspaceStore } from "@/store/workspace-store";

export function Topbar() {
  const search = useWorkspaceStore((state) => state.search);
  const setSearch = useWorkspaceStore((state) => state.setSearch);
  const viewMode = useWorkspaceStore((state) => state.viewMode);
  const setViewMode = useWorkspaceStore((state) => state.setViewMode);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/75 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-normal">Workspace Dashboard</h1>
          <p className="text-sm text-muted-foreground">Launch independent accounts without cookie or storage conflicts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-64 flex-1 xl:w-80 xl:flex-none">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search instances, profiles, apps..."
              className="pl-9"
            />
          </div>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid" aria-label="Grid view">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute -mt-6 ml-6 h-2 w-2 rounded-full bg-rose-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {notifications.map((item) => (
          <div key={item.id} className="shrink-0 rounded-md border bg-card px-3 py-2 text-xs">
            <span className="font-medium">{item.title}</span>
            <span className="ml-2 text-muted-foreground">{item.description}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

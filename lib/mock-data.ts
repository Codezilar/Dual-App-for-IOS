import { appCatalog, getAppByType } from "@/lib/app-catalog";
import type { NotificationItem, WorkspaceFolder, WorkspaceInstance } from "@/lib/types";

export const folders: WorkspaceFolder[] = [
  { id: "growth", name: "Growth Team", color: "#14b8a6" },
  { id: "support", name: "Support Ops", color: "#f59e0b" },
  { id: "personal", name: "Personal", color: "#8b5cf6" }
];

export const initialInstances: WorkspaceInstance[] = [
  makeInstance("Facebook #1", "facebook", "ONLINE", true, "growth", "2026-06-04T05:45:00.000Z"),
  makeInstance("Facebook #2", "facebook", "OFFLINE", false, "support", "2026-06-03T20:15:00.000Z"),
  makeInstance("Instagram #1", "instagram", "ONLINE", true, "growth", "2026-06-04T05:20:00.000Z"),
  makeInstance("WhatsApp #1", "whatsapp", "ONLINE", false, "support", "2026-06-04T04:38:00.000Z"),
  makeInstance("Telegram #1", "telegram", "OFFLINE", false, "personal", "2026-06-02T14:30:00.000Z"),
  makeInstance("LinkedIn #1", "linkedin", "ONLINE", true, "growth", "2026-06-04T03:10:00.000Z"),
  makeInstance("Gmail #1", "gmail", "OFFLINE", false, "personal", "2026-06-01T09:30:00.000Z"),
  makeInstance("X #1", "x", "SUSPENDED", false, "support", "2026-05-30T18:10:00.000Z")
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Storage threshold",
    description: "Support Ops profiles are using 74% of allocated storage.",
    createdAt: "2026-06-04T04:40:00.000Z",
    read: false
  },
  {
    id: "n2",
    title: "Instance online",
    description: "Instagram #1 restored its isolated session successfully.",
    createdAt: "2026-06-04T03:51:00.000Z",
    read: false
  }
];

export const appLaunchers = appCatalog;

function makeInstance(
  name: string,
  appType: WorkspaceInstance["appType"],
  status: WorkspaceInstance["status"],
  favorite: boolean,
  folder: string,
  lastActivity: string
): WorkspaceInstance {
  const app = getAppByType(appType);
  const suffix = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    id: `${appType}-${suffix}`,
    name,
    appType,
    launchUrl: app.url,
    logoUrl: app.logo,
    profileId: `prof_${suffix}`,
    cookieStore: `cookie_${suffix}`,
    status,
    favorite,
    folder,
    lastActivity,
    createdAt: "2026-05-26T10:00:00.000Z"
  };
}

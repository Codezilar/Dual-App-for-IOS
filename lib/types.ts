export type AppType =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "telegram"
  | "x"
  | "linkedin"
  | "gmail"
  | "custom";

export type InstanceStatus = "ONLINE" | "OFFLINE" | "SUSPENDED" | "ERROR";

export type AppCatalogItem = {
  type: AppType;
  name: string;
  url: string;
  logo: string;
  color: string;
  category: "Social" | "Messaging" | "Work" | "Custom";
};

export type WorkspaceInstance = {
  id: string;
  name: string;
  appType: AppType;
  launchUrl: string;
  logoUrl?: string;
  profileId: string;
  cookieStore: string;
  status: InstanceStatus;
  favorite: boolean;
  folder?: string;
  lastActivity?: string;
  createdAt: string;
};

export type WorkspaceFolder = {
  id: string;
  name: string;
  color: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
};

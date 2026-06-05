import type { AppCatalogItem } from "@/lib/types";

export const appCatalog: AppCatalogItem[] = [
  {
    type: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com",
    logo: "/icons/facebook.svg",
    color: "#1877f2",
    category: "Social"
  },
  {
    type: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com",
    logo: "/icons/instagram.svg",
    color: "#e1306c",
    category: "Social"
  },
  {
    type: "whatsapp",
    name: "WhatsApp",
    url: "https://web.whatsapp.com",
    logo: "/icons/whatsapp.svg",
    color: "#25d366",
    category: "Messaging"
  },
  {
    type: "telegram",
    name: "Telegram",
    url: "https://web.telegram.org",
    logo: "/icons/telegram.svg",
    color: "#229ed9",
    category: "Messaging"
  },
  {
    type: "x",
    name: "X",
    url: "https://x.com",
    logo: "/icons/x.svg",
    color: "#111827",
    category: "Social"
  },
  {
    type: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    logo: "/icons/linkedin.svg",
    color: "#0a66c2",
    category: "Work"
  },
  {
    type: "gmail",
    name: "Gmail",
    url: "https://mail.google.com",
    logo: "/icons/gmail.svg",
    color: "#ea4335",
    category: "Work"
  }
];

export function getAppByType(type: string) {
  return appCatalog.find((app) => app.type === type) ?? appCatalog[0];
}

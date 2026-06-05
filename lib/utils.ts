import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(value?: string | Date | null) {
  if (!value) return "Never opened";
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function createProfileNamespace(seed = crypto.randomUUID()) {
  const short = seed.replace(/-/g, "").slice(0, 16);
  return {
    profileId: `prof_${short}`,
    cookieStore: `cookie_${short}`,
    storageBucket: `storage_${short}`,
    cacheNamespace: `cache_${short}`
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { getAppByType } from "@/lib/app-catalog";
import { ActivityLog, AppInstance, SessionProfile } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";
import type { AppType } from "@/lib/types";

export async function createAppInstance(input: {
  workspaceId: string;
  appType: AppType;
  name?: string;
  folderId?: string;
}) {
  await connectToDatabase();
  const app = getAppByType(input.appType);
  const profile = createProfileNamespace();

  const sessionProfile = await SessionProfile.create({
    profileKey: profile.profileId,
    cookieStore: profile.cookieStore,
    storageBucket: profile.storageBucket,
    cacheNamespace: profile.cacheNamespace
  });

  const instance = await AppInstance.create({
    name: input.name ?? app.name,
    appType: app.type,
    launchUrl: app.url,
    logoUrl: app.logo,
    workspaceId: input.workspaceId,
    folderId: input.folderId,
    profileId: sessionProfile._id,
    cookieStore: profile.cookieStore
  });

  await ActivityLog.create({
    type: "INSTANCE_CREATED",
    message: `${instance.name} was created with isolated profile ${profile.profileId}.`,
    instanceId: instance._id
  });

  revalidatePath("/");
  return instance;
}

export async function renameAppInstance(id: string, name: string) {
  await connectToDatabase();
  const instance = await AppInstance.findByIdAndUpdate(id, { name }, { new: true });
  if (!instance) throw new Error("Instance not found.");

  await ActivityLog.create({
    type: "INSTANCE_RENAMED",
    message: `${instance._id.toString()} renamed to ${name}.`,
    instanceId: instance._id
  });
  revalidatePath("/");
  return instance;
}

export async function deleteAppInstance(id: string) {
  await connectToDatabase();
  const instance = await AppInstance.findByIdAndDelete(id);
  if (!instance) throw new Error("Instance not found.");

  await ActivityLog.create({
    type: "INSTANCE_DELETED",
    message: `${instance.name} was deleted.`,
    metadata: { appType: instance.appType, profileId: instance.profileId }
  });
  revalidatePath("/");
  return instance;
}

"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { getAppByType } from "@/lib/app-catalog";
import { requireUser } from "@/lib/auth";
import { ActivityLog, AppInstance, SessionProfile, Workspace } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";
import type { AppType } from "@/lib/types";

export async function createAppInstance(input: {
  workspaceId: string;
  appType: AppType;
  name?: string;
  folderId?: string;
}) {
  const user = await requireUser();
  await connectToDatabase();
  const app = getAppByType(input.appType);
  const profile = createProfileNamespace();
  const workspace = await Workspace.findOne({ _id: input.workspaceId, ownerId: user.id }).lean();
  if (!workspace) throw new Error("Workspace not found for the current user.");

  const sessionProfile = await SessionProfile.create({
    userId: user.id,
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
    userId: user.id,
    workspaceId: workspace._id,
    folderId: input.folderId,
    profileId: sessionProfile._id,
    cookieStore: profile.cookieStore
  });

  await ActivityLog.create({
    type: "INSTANCE_CREATED",
    message: `${instance.name} was created with isolated profile ${profile.profileId}.`,
    userId: user.id,
    instanceId: instance._id
  });

  revalidatePath("/");
  return instance;
}

export async function renameAppInstance(id: string, name: string) {
  const user = await requireUser();
  await connectToDatabase();
  const instance = await AppInstance.findOneAndUpdate({ _id: id, userId: user.id }, { name }, { new: true });
  if (!instance) throw new Error("Instance not found.");

  await ActivityLog.create({
    type: "INSTANCE_RENAMED",
    message: `${instance._id.toString()} renamed to ${name}.`,
    userId: user.id,
    instanceId: instance._id
  });
  revalidatePath("/");
  return instance;
}

export async function deleteAppInstance(id: string) {
  const user = await requireUser();
  await connectToDatabase();
  const instance = await AppInstance.findOneAndDelete({ _id: id, userId: user.id });
  if (!instance) throw new Error("Instance not found.");

  await ActivityLog.create({
    type: "INSTANCE_DELETED",
    message: `${instance.name} was deleted.`,
    userId: user.id,
    metadata: { appType: instance.appType, profileId: instance.profileId }
  });
  revalidatePath("/");
  return instance;
}

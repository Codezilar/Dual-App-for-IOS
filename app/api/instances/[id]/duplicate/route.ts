import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ActivityLog, AppInstance, SessionProfile } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();

  const source = await AppInstance.findOne({ _id: id, userId: user.id }).lean();
  if (!source) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const profile = createProfileNamespace();
  const sessionProfile = await SessionProfile.create({
    userId: user.id,
    profileKey: profile.profileId,
    cookieStore: profile.cookieStore,
    storageBucket: profile.storageBucket,
    cacheNamespace: profile.cacheNamespace
  });

  const instance = await AppInstance.create({
    name: `${source.name} Copy`,
    appType: source.appType,
    launchUrl: source.launchUrl,
    logoUrl: source.logoUrl,
    userId: user.id,
    workspaceId: source.workspaceId,
    folderId: source.folderId,
    profileId: sessionProfile._id,
    cookieStore: profile.cookieStore,
    favorite: false,
    status: "OFFLINE"
  });

  await ActivityLog.create({
    type: "INSTANCE_DUPLICATED",
    message: `${source.name} was duplicated into ${instance.name}.`,
    userId: user.id,
    instanceId: instance._id,
    metadata: { sourceInstanceId: source._id }
  });

  return NextResponse.json({ instance }, { status: 201 });
}

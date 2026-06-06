import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ActivityLog, AppInstance, SessionProfile } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  const source = await AppInstance.findById(id).lean();
  if (!source) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const profile = createProfileNamespace();
  const sessionProfile = await SessionProfile.create({
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
    instanceId: instance._id,
    metadata: { sourceInstanceId: source._id }
  });

  return NextResponse.json({ instance }, { status: 201 });
}

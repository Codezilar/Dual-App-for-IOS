import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAppByType } from "@/lib/app-catalog";
import { ActivityLog, AppInstance, SessionProfile } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";

export async function GET() {
  await connectToDatabase();
  const instances = await AppInstance.find()
    .sort({ favorite: -1, updatedAt: -1 })
    .populate("profileId")
    .lean();

  return NextResponse.json({ instances });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    workspaceId: string;
    appType: string;
    name?: string;
    launchUrl?: string;
    folderId?: string;
  };
  const app = getAppByType(body.appType);
  const profile = createProfileNamespace();
  await connectToDatabase();

  const sessionProfile = await SessionProfile.create({
    profileKey: profile.profileId,
    cookieStore: profile.cookieStore,
    storageBucket: profile.storageBucket,
    cacheNamespace: profile.cacheNamespace
  });

  const instance = await AppInstance.create({
    name: body.name ?? app.name,
    appType: body.appType,
    launchUrl: body.launchUrl ?? app.url,
    logoUrl: app.logo,
    workspaceId: body.workspaceId,
    folderId: body.folderId,
    cookieStore: profile.cookieStore,
    profileId: sessionProfile._id
  });

  await ActivityLog.create({
    type: "INSTANCE_CREATED",
    message: `Created ${body.name ?? app.name} with ${profile.cookieStore}.`,
    instanceId: instance._id
  });

  return NextResponse.json({ instance }, { status: 201 });
}

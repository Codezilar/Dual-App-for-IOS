import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAppByType } from "@/lib/app-catalog";
import { getCurrentUser } from "@/lib/auth";
import { ActivityLog, AppInstance, SessionProfile, Workspace } from "@/lib/models";
import { createProfileNamespace } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const instances = await AppInstance.find({ userId: user.id })
    .sort({ favorite: -1, updatedAt: -1 })
    .populate("profileId")
    .lean();

  return NextResponse.json({ instances });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    workspaceId?: string;
    appType: string;
    name?: string;
    launchUrl?: string;
    folderId?: string;
  };
  const app = getAppByType(body.appType);
  const profile = createProfileNamespace();
  await connectToDatabase();
  const workspace = body.workspaceId
    ? await Workspace.findOne({ _id: body.workspaceId, ownerId: user.id }).lean()
    : await Workspace.findOne({ ownerId: user.id }).lean();

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found for the current user." }, { status: 404 });
  }

  const sessionProfile = await SessionProfile.create({
    userId: user.id,
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
    userId: user.id,
    workspaceId: workspace._id,
    folderId: body.folderId,
    cookieStore: profile.cookieStore,
    profileId: sessionProfile._id
  });

  await ActivityLog.create({
    type: "INSTANCE_CREATED",
    message: `Created ${body.name ?? app.name} with ${profile.cookieStore}.`,
    userId: user.id,
    instanceId: instance._id
  });

  return NextResponse.json({ instance }, { status: 201 });
}

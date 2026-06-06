import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ActivityLog, SessionProfile } from "@/lib/models";

type SessionSnapshot = {
  cookies?: unknown[];
  localStorage?: Record<string, unknown>;
  sessionStorage?: Record<string, unknown>;
  indexedDb?: Record<string, unknown>;
  userAgent?: string;
  proxyConfig?: unknown;
  storageBytes?: number;
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const profile = await SessionProfile.findOne({ _id: id, userId: user.id }).lean();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    profileId: profile._id,
    profileKey: profile.profileKey,
    cookieStore: profile.cookieStore,
    storageBucket: profile.storageBucket,
    cacheNamespace: profile.cacheNamespace,
    session: profile.encryptedMeta ?? {},
    userAgent: profile.userAgent,
    proxyConfig: profile.proxyConfig,
    lastSyncedAt: profile.lastSyncedAt
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as SessionSnapshot;
  await connectToDatabase();

  const profile = await SessionProfile.findOneAndUpdate(
    { _id: id, userId: user.id },
    {
      encryptedMeta: {
        cookies: body.cookies ?? [],
        localStorage: body.localStorage ?? {},
        sessionStorage: body.sessionStorage ?? {},
        indexedDb: body.indexedDb ?? {}
      },
      ...(body.userAgent !== undefined ? { userAgent: body.userAgent } : {}),
      ...(body.proxyConfig !== undefined ? { proxyConfig: body.proxyConfig } : {}),
      ...(body.storageBytes !== undefined ? { storageBytes: body.storageBytes } : {}),
      lastSyncedAt: new Date()
    },
    { new: true }
  );

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await ActivityLog.create({
    type: "PROFILE_CREATED",
    message: `${profile.profileKey} session snapshot synced.`,
    userId: user.id,
    metadata: { profileId: profile._id, cookieStore: profile.cookieStore }
  });

  return NextResponse.json({ profile });
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SessionProfile } from "@/lib/models";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const profiles = await SessionProfile.find({ userId: user.id }).sort({ updatedAt: -1 }).limit(250).lean();
  const storageBytes = profiles.reduce((total, profile) => total + (profile.storageBytes ?? 0), 0);

  return NextResponse.json({
    profiles,
    summary: {
      count: profiles.length,
      storageBytes
    }
  });
}

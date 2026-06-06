import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { SessionProfile } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const profiles = await SessionProfile.find().sort({ updatedAt: -1 }).limit(250).lean();
  const storageBytes = profiles.reduce((total, profile) => total + (profile.storageBytes ?? 0), 0);

  return NextResponse.json({
    profiles,
    summary: {
      count: profiles.length,
      storageBytes
    }
  });
}

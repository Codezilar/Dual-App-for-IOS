import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ActivityLog } from "@/lib/models";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const activity = await ActivityLog.find({ userId: user.id }).sort({ createdAt: -1 }).limit(100).populate("userId").populate("instanceId").lean();

  return NextResponse.json({ activity });
}

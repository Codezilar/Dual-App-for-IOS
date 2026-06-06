import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ActivityLog } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const activity = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).populate("userId").populate("instanceId").lean();

  return NextResponse.json({ activity });
}

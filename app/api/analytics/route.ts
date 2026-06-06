import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ActivityLog, AppInstance, SessionProfile, User, Workspace } from "@/lib/models";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const userId = new Types.ObjectId(user.id);

  const [instances, profiles, users, workspaces, activityByType, appsByType, statuses] = await Promise.all([
    AppInstance.countDocuments({ userId: user.id }),
    SessionProfile.countDocuments({ userId: user.id }),
    User.countDocuments({ _id: user.id }),
    Workspace.countDocuments({ ownerId: user.id }),
    ActivityLog.aggregate([{ $match: { userId } }, { $group: { _id: "$type", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    AppInstance.aggregate([{ $match: { userId } }, { $group: { _id: "$appType", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    AppInstance.aggregate([{ $match: { userId } }, { $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);

  return NextResponse.json({
    totals: { instances, profiles, users, workspaces },
    activityByType,
    appsByType,
    statuses
  });
}

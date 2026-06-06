import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ActivityLog, AppInstance, SessionProfile, User, Workspace } from "@/lib/models";

export async function GET() {
  await connectToDatabase();

  const [instances, profiles, users, workspaces, activityByType, appsByType, statuses] = await Promise.all([
    AppInstance.countDocuments(),
    SessionProfile.countDocuments(),
    User.countDocuments(),
    Workspace.countDocuments(),
    ActivityLog.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    AppInstance.aggregate([{ $group: { _id: "$appType", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    AppInstance.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);

  return NextResponse.json({
    totals: { instances, profiles, users, workspaces },
    activityByType,
    appsByType,
    statuses
  });
}

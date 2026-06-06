import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AppInstance, SessionProfile } from "@/lib/models";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const userId = new Types.ObjectId(user.id);

  const [riskyInstances, duplicateCookieStores, profiles] = await Promise.all([
    AppInstance.find({ userId: user.id, status: { $in: ["SUSPENDED", "ERROR"] } }).sort({ updatedAt: -1 }).lean(),
    SessionProfile.aggregate([
      { $match: { userId } },
      { $group: { _id: "$cookieStore", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]),
    SessionProfile.countDocuments({ userId: user.id })
  ]);

  return NextResponse.json({
    controls: [
      { key: "profileMetadataEncryption", enabled: true },
      { key: "cookieIsolation", enabled: duplicateCookieStores.length === 0 },
      { key: "cacheNamespaceIsolation", enabled: true },
      { key: "gatewayOriginAllowlist", enabled: true }
    ],
    summary: {
      profiles,
      riskyInstances: riskyInstances.length,
      duplicateCookieStores: duplicateCookieStores.length
    },
    riskyInstances,
    duplicateCookieStores
  });
}

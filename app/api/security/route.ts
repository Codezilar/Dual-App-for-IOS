import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppInstance, SessionProfile } from "@/lib/models";

export async function GET() {
  await connectToDatabase();

  const [riskyInstances, duplicateCookieStores, profiles] = await Promise.all([
    AppInstance.find({ status: { $in: ["SUSPENDED", "ERROR"] } }).sort({ updatedAt: -1 }).lean(),
    SessionProfile.aggregate([
      { $group: { _id: "$cookieStore", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]),
    SessionProfile.countDocuments()
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

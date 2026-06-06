import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AppInstance, Workspace } from "@/lib/models";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const workspaces = await Workspace.find({ ownerId: user.id }).populate("ownerId").populate("members.userId").lean();
  const workspaceIds = workspaces.map((workspace) => workspace._id);
  const instances = await AppInstance.find({ userId: user.id, workspaceId: { $in: workspaceIds } }).lean();

  const instanceGroups = instances.reduce<Record<string, typeof instances>>((groups, instance) => {
    const key = instance.workspaceId.toString();
    groups[key] ??= [];
    groups[key].push(instance);
    return groups;
  }, {});

  const payload = workspaces.map((workspace) => ({
    ...workspace,
    instances: instanceGroups[workspace._id.toString()] ?? []
  }));

  return NextResponse.json({ workspaces: payload });
}

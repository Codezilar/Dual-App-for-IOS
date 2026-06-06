import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AppInstance } from "@/lib/models";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const instance = await AppInstance.findOne({ _id: id, userId: user.id }).populate("profileId").lean();

  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  return NextResponse.json({ instance });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const body = (await request.json()) as {
    name?: string;
    favorite?: boolean;
    status?: "ONLINE" | "OFFLINE" | "SUSPENDED" | "ERROR";
    folderId?: string | null;
  };

  const instance = await AppInstance.findOneAndUpdate(
    { _id: id, userId: user.id },
    {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.favorite !== undefined ? { favorite: body.favorite } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.folderId !== undefined ? { folderId: body.folderId } : {}),
      ...(body.status === "ONLINE" ? { lastActivity: new Date() } : {})
    },
    { new: true }
  );

  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  return NextResponse.json({ instance });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const instance = await AppInstance.findOneAndDelete({ _id: id, userId: user.id });

  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

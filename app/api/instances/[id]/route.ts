import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AppInstance } from "@/lib/models";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const body = (await request.json()) as {
    name?: string;
    favorite?: boolean;
    status?: "ONLINE" | "OFFLINE" | "SUSPENDED" | "ERROR";
    folderId?: string | null;
  };

  const instance = await AppInstance.findByIdAndUpdate(
    id,
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
  const { id } = await params;
  await connectToDatabase();
  const instance = await AppInstance.findByIdAndDelete(id);

  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

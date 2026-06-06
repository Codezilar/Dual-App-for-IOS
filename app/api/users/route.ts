import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { ActivityLog, User } from "@/lib/models";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const users = await User.find({ _id: currentUser.id }).sort({ role: 1, name: 1, email: 1 }).lean();

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["OWNER", "ADMIN"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Only owners and admins can invite users." }, { status: 403 });
  }

  const body = (await request.json()) as {
    email?: string;
    name?: string;
    role?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    image?: string;
    password?: string;
  };

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.create({
    email: body.email,
    name: body.name,
    role: body.role ?? "MEMBER",
    image: body.image,
    passwordHash: hashPassword(body.password ?? randomUUID())
  });

  await ActivityLog.create({
    type: "USER_INVITED",
    message: `${body.email} was added as ${body.role ?? "MEMBER"}.`,
    userId: currentUser.id,
    metadata: { invitedUserId: user._id }
  });

  return NextResponse.json({ user }, { status: 201 });
}

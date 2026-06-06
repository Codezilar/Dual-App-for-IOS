import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { ActivityLog, User, Workspace } from "@/lib/models";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const email = body.email?.toLowerCase().trim();

  if (!email || !body.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await connectToDatabase();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const user = await User.create({
    email,
    name: body.name?.trim(),
    passwordHash: hashPassword(body.password),
    role: "OWNER"
  });

  const workspace = await Workspace.create({
    name: `${body.name?.trim() || "My"} Workspace`,
    slug: `${email.split("@")[0].replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${user._id.toString().slice(-6)}`,
    ownerId: user._id,
    members: [{ userId: user._id, role: "OWNER" }],
    folders: [
      { name: "Growth Team", color: "#14b8a6" },
      { name: "Support Ops", color: "#f59e0b" },
      { name: "Personal", color: "#8b5cf6" }
    ]
  });

  await ActivityLog.create({
    type: "WORKSPACE_UPDATED",
    message: `${workspace.name} was created for ${email}.`,
    userId: user._id
  });

  await setAuthCookie(user);
  return NextResponse.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } }, { status: 201 });
}

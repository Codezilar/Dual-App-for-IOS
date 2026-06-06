import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ActivityLog, User } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const users = await User.find().sort({ role: 1, name: 1, email: 1 }).lean();

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    name?: string;
    role?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    image?: string;
  };

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.create({
    email: body.email,
    name: body.name,
    role: body.role ?? "MEMBER",
    image: body.image
  });

  await ActivityLog.create({
    type: "USER_INVITED",
    message: `${body.email} was added as ${body.role ?? "MEMBER"}.`,
    userId: user._id
  });

  return NextResponse.json({ user }, { status: 201 });
}

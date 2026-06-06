import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { setAuthCookie, verifyPassword } from "@/lib/auth";
import { User } from "@/lib/models";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.toLowerCase().trim();

  if (!email || !body.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setAuthCookie(user);
  return NextResponse.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}

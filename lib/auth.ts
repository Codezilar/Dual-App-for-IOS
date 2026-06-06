import { createHmac, randomBytes, timingSafeEqual, pbkdf2Sync } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models";

const SESSION_COOKIE = "dual_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  userId: string;
  email: string;
  exp: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
};

function getSecret() {
  const secret = process.env.SESSION_ENCRYPTION_KEY;
  if (!secret || secret === "replace-with-32-byte-secret") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_ENCRYPTION_KEY must be set to a strong secret in production.");
    }
    return "dev-only-dual-workspace-session-secret-change-me";
  }
  return secret;
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function createSessionToken(payload: SessionPayload) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function readSessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.userId || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("base64url");
  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterations, salt, hash] = storedHash.split("$");
  if (scheme !== "pbkdf2_sha256" || !iterations || !salt || !hash) return false;

  const derived = pbkdf2Sync(password, salt, Number(iterations), 32, "sha256").toString("base64url");
  const derivedBuffer = Buffer.from(derived);
  const hashBuffer = Buffer.from(hash);
  return derivedBuffer.length === hashBuffer.length && timingSafeEqual(derivedBuffer, hashBuffer);
}

export async function setAuthCookie(user: { _id: unknown; email: string }) {
  const cookieStore = await cookies();
  const token = createSessionToken({
    userId: String(user._id),
    email: user.email,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? undefined,
    role: user.role
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

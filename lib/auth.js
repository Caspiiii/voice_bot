import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "voice_bot_admin";

function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  return password;
}

function sessionToken() {
  return crypto
    .createHmac("sha256", adminPassword())
    .update("voice-bot-admin-session")
    .digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function verifyPassword(password) {
  return safeEqual(password || "", adminPassword());
}

export async function isAdminRequest(request) {
  const headerPassword = request.headers.get("x-admin-password");

  if (headerPassword && verifyPassword(headerPassword)) {
    return true;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value;

  return Boolean(cookieValue && safeEqual(cookieValue, sessionToken()));
}

export async function requireAdmin(request) {
  if (await isAdminRequest(request)) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function setAdminCookie(response) {
  response.cookies.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}

export function clearAdminCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}


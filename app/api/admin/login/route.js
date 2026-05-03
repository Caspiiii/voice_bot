import { NextResponse } from "next/server";
import { readJson } from "@/lib/validation";
import { setAdminCookie, verifyPassword } from "@/lib/auth";

export async function POST(request) {
  const body = await readJson(request);

  if (!verifyPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return setAdminCookie(NextResponse.json({ ok: true }));
}


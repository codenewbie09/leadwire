import { db } from "@/db";
import { authUsers, authSessions } from "@/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function POST() {
  const suffix = Math.random().toString(36).slice(2, 8);
  const userId = crypto.randomUUID();
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(authUsers).values({
    id: userId,
    name: `Guest-${suffix}`,
    email: `guest-${suffix}@pitchperfect.local`,
    emailVerified: new Date(),
  });

  await db.insert(authSessions).values({
    sessionToken,
    userId,
    expires,
  });

  // Set session cookie matching Auth.js format
  const cookieStore = await cookies();
  cookieStore.set("__Secure-authjs.session-token", sessionToken, {
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const USER_ID_COOKIE = "todo_user_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUserId(value: string | undefined): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(USER_ID_COOKIE)?.value;
  return isValidUserId(value) ? value : null;
}

/** Returns existing cookie user id or creates a new anonymous one. */
export async function getOrCreateUserId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(USER_ID_COOKIE)?.value;

  if (isValidUserId(existing)) {
    return existing;
  }

  const userId = randomUUID();
  cookieStore.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return userId;
}

import "server-only";
import { cookies } from "next/headers";

const COOKIE = "admin_session";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return !!token && token === adminPassword();
}

export async function setSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, adminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(input: string): boolean {
  return input === adminPassword();
}

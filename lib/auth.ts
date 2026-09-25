import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ctc_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 ชั่วโมง

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

// โทเค็นแบบ stateless: HMAC ของชื่อคุกกี้โดยใช้รหัสผ่านแอดมินเป็นคีย์
// ตรวจสอบได้โดยไม่ต้องเก็บ session ไว้ในเซิร์ฟเวอร์ ใครไม่รู้รหัสผ่านจะสร้างโทเค็นที่ถูกต้องไม่ได้
function computeToken(password: string): string {
  return createHmac("sha256", password).update(SESSION_COOKIE).digest("hex");
}

export function checkPassword(password: string): boolean {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const adminPassword = getAdminPassword();
  if (!adminPassword) throw new Error("ADMIN_PASSWORD not configured");
  const store = await cookies();
  store.set(SESSION_COOKIE, computeToken(adminPassword), {
    httpOnly: true,
    sameSite: "lax",
    // เปิด COOKIE_SECURE=true เฉพาะตอนเว็บรันอยู่หลัง HTTPS จริง (เช่น deploy ขึ้น Vercel)
    // ถ้าใช้ NODE_ENV==="production" เฉย ๆ คุกกี้จะถูกทำเครื่องหมาย Secure และเบราว์เซอร์จะไม่ส่งกลับมา
    // เวลารันผ่าน HTTP ธรรมดา (เช่น Docker บน localhost) ทำให้ล็อกอินแล้วเด้งออกทันที
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = computeToken(adminPassword);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

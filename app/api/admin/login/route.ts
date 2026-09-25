import { checkPassword, createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "คำขอไม่ถูกต้อง" }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  if (typeof password !== "string" || !checkPassword(password)) {
    return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  await createSession();
  return Response.json({ ok: true });
}

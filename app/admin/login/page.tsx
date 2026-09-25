"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { college } from "@/lib/college-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 sm:px-6">
      <Image
        src="/college-logo.png"
        alt={`ตราสัญลักษณ์ ${college.name}`}
        width={64}
        height={64}
        className="h-16 w-16"
      />
      <h1 className="mt-4 text-xl font-bold text-brand-dark">🔒 ระบบแอดมิน</h1>
      <p className="mt-1 text-center text-sm text-foreground/70">
        สำหรับเจ้าหน้าที่งานทะเบียนดูรายชื่อผู้สมัครเรียน
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-foreground/70">รหัสผ่าน</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">⚠️ {error}</p>}

        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "⏳ กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}

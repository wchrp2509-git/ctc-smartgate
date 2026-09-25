import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { isAuthenticated } from "@/lib/auth";
import { college } from "@/lib/college-data";
import { listApplications } from "@/lib/db";

export const metadata: Metadata = {
  title: `ระบบแอดมิน - รายชื่อผู้สมัคร | ${college.name}`,
};

// หน้านี้ต้องเช็ก cookie ทุกครั้ง ห้าม cache/prerender ไว้ตอน build
// ไม่งั้นทุกคนจะเห็นผลลัพธ์เดียวกับตอน build (ตอนนั้นยังไม่มีใคร login) ตลอดไป
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const applications = await listApplications();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">📋 รายชื่อผู้สมัครเรียน</h1>
          <p className="mt-1 text-sm text-foreground/60">ทั้งหมด {applications.length} รายการ</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/api/admin/export"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            ⬇️ ส่งออกเป็น CSV
          </a>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border-subtle bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-surface text-xs font-semibold text-foreground/70">
            <tr>
              <th className="px-4 py-3">วันที่สมัคร</th>
              <th className="px-4 py-3">ระดับ</th>
              <th className="px-4 py-3">ชื่อ-สกุล</th>
              <th className="px-4 py-3">เลขบัตรประชาชน</th>
              <th className="px-4 py-3">โทรศัพท์</th>
              <th className="px-4 py-3">สาขาลำดับ 1</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/50">
                  ยังไม่มีข้อมูลผู้สมัคร
                </td>
              </tr>
            )}
            {applications.map((a) => (
              <tr key={a.id} className="border-t border-border-subtle">
                <td className="px-4 py-3 whitespace-nowrap text-foreground/70">{a.createdAt}</td>
                <td className="px-4 py-3">{a.level}</td>
                <td className="px-4 py-3 font-medium text-brand-dark">
                  {a.prefix} {a.firstName} {a.lastName}
                </td>
                <td className="px-4 py-3">{a.idCard}</td>
                <td className="px-4 py-3">{a.phone}</td>
                <td className="px-4 py-3">{a.program1}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${a.id}`} className="font-semibold text-brand hover:underline">
                    ดูรายละเอียด →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

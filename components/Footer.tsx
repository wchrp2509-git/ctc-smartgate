import Image from "next/image";
import Link from "next/link";
import { college } from "@/lib/college-data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-brand-dark text-white print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/college-logo.png"
              alt={`ตราสัญลักษณ์ ${college.name}`}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0"
            />
            <h3 className="text-lg font-semibold">{college.name}</h3>
          </div>
          <p className="mt-1 text-sm text-white/70">{college.englishName}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">📍 {college.address}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            🔗 ลิงก์ด่วน
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/programs" className="text-white/80 hover:text-accent">
                สาขาวิชาที่เปิดสอน
              </Link>
            </li>
            <li>
              <Link href="/admission" className="text-white/80 hover:text-accent">
                การรับสมัคร
              </Link>
            </li>
            <li>
              <Link href="/news" className="text-white/80 hover:text-accent">
                ข่าวประชาสัมพันธ์
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white/80 hover:text-accent">
                ติดต่อเรา
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            📞 ติดต่อวิทยาลัย
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>📞 {college.phone}</li>
            <li>✉️ {college.email}</li>
            <li>📘 {college.facebook}</li>
            <li>💬 Line OA: {college.lineOA}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6">
        © {new Date().getFullYear()} {college.name} · เว็บไซต์นี้เป็นต้นแบบสำหรับส่งประกวดสิ่งประดิษฐ์ของคนรุ่นใหม่ 🏆
      </div>
    </footer>
  );
}

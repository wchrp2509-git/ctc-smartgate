import type { Metadata } from "next";
import Link from "next/link";
import { college, programs } from "@/lib/college-data";

export const metadata: Metadata = {
  title: `สาขาวิชาที่เปิดสอน | ${college.name}`,
};

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-dark">🛠️ สาขาวิชาที่เปิดสอน</h1>
      <p className="mt-2 max-w-2xl text-foreground/70">
        {college.name} เปิดสอนหลักสูตรประกาศนียบัตรวิชาชีพ (ปวช.) และประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)
        ครอบคลุมสายช่างอุตสาหกรรมและสายบริหารธุรกิจ
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {programs.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm shadow-brand/5 transition-shadow hover:shadow-md hover:shadow-brand/10"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-brand-dark">
              <span className="text-2xl">{p.emoji}</span> {p.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.levels.map((lv) => (
                <span key={lv} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand">
                  {lv}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-foreground/50">{p.department}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{p.description}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                💼 แนวทางประกอบอาชีพ
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.careers.map((c) => (
                  <li key={c} className="rounded-full bg-surface px-3 py-1 text-xs text-brand-dark">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand to-brand-light p-6 text-center text-white shadow-lg">
        <p className="font-semibold">🚀 สนใจสาขาไหน สมัครได้เลยวันนี้</p>
        <Link
          href="/admission"
          className="mt-3 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-md transition-transform hover:scale-105"
        >
          📝 ดูขั้นตอนการรับสมัคร
        </Link>
      </div>
    </div>
  );
}

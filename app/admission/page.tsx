import type { Metadata } from "next";
import { admission, college } from "@/lib/college-data";

export const metadata: Metadata = {
  title: `การรับสมัคร | ${college.name}`,
};

export default function AdmissionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-dark">
        📝 การรับสมัครนักเรียน นักศึกษา ปีการศึกษา {admission.academicYear}
      </h1>
      <p className="mt-2 text-foreground/70">
        ตรวจสอบรอบรับสมัคร คุณสมบัติ เอกสาร และขั้นตอนการสมัครเรียนที่ {college.name}
      </p>

      <div className="mt-6 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-brand-dark">
        <span className="shrink-0">ℹ️</span>
        <p>{admission.note}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand-dark">📅 {admission.quotaRound.name}</h2>
          <p className="mt-1 text-sm text-foreground/70">{admission.quotaRound.period}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand-dark">📅 {admission.generalRound.name}</h2>
          <p className="mt-1 text-sm text-foreground/70">{admission.generalRound.period}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-brand-dark">✅ คุณสมบัติผู้สมัคร</h2>
        <ul className="mt-3 space-y-2">
          {admission.qualifications.map((q) => (
            <li key={q} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-0.5 shrink-0">✅</span>
              {q}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-brand-dark">📄 เอกสารที่ต้องใช้ในการสมัคร</h2>
        <ul className="mt-3 space-y-2">
          {admission.documents.map((d) => (
            <li key={d} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-0.5 shrink-0">📄</span>
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-brand-dark">🚀 ขั้นตอนการสมัคร</h2>
        <ol className="mt-3 space-y-3">
          {admission.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm text-foreground/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 rounded-2xl bg-surface p-6">
        <p className="font-semibold text-brand-dark">☎️ สอบถามเพิ่มเติม</p>
        <p className="mt-1 text-sm text-foreground/75">{admission.contactForAdmission}</p>
        <p className="mt-1 text-sm text-foreground/75">
          หรือถาม &ldquo;น้องเทคนิค&rdquo; 🤖 ผู้ช่วย AI ของวิทยาลัยได้ทันทีที่ไอคอนแชทมุมขวาล่างของหน้าจอ
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import ImageSlideshow from "@/components/ImageSlideshow";
import { admission, college, news, programs, promoSlides } from "@/lib/college-data";

const HIGHLIGHTS = [
  {
    emoji: "🎓",
    title: "หลักสูตรทันสมัย",
    desc: "ปรับปรุงหลักสูตรให้ทันเทคโนโลยี ทั้งด้าน AI สมองกลฝังตัว และอุตสาหกรรม 4.0",
  },
  {
    emoji: "🤝",
    title: "ฝึกงานกับสถานประกอบการจริง",
    desc: "ร่วมมือกับสถานประกอบการชั้นนำ เปิดโอกาสฝึกงานและมีงานทำหลังจบการศึกษา",
  },
  {
    emoji: "🤖",
    title: "ผู้ช่วย AI ตอบคำถามตลอด 24 ชม.",
    desc: 'แชทถาม "น้องเทคนิค" มุมขวาล่างของเว็บไซต์ได้ทุกเรื่องเกี่ยวกับการสมัครเรียน',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur">
              🎉 รับสมัครนักเรียน นักศึกษา ปีการศึกษา {admission.academicYear}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {college.name}
            </h1>
            <p className="mt-4 text-lg text-white/90">✨ {college.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{college.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admission"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg shadow-black/10 transition-transform hover:scale-105"
              >
                📝 สมัครเรียนเลย
              </Link>
              <Link
                href="/programs"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                🔍 ดูสาขาวิชาที่เปิดสอน
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold text-white">💬 มีคำถามเกี่ยวกับการสมัคร?</p>
            <p className="mt-2 text-sm text-white/85">
              คลิกไอคอนแชทมุมขวาล่างของหน้าจอ แล้วพิมพ์คำถามได้เลย ผู้ช่วย AI 🤖 ของวิทยาลัยพร้อมตอบคำถามเรื่องสาขาวิชา
              คุณสมบัติผู้สมัคร เอกสาร และขั้นตอนการสมัครตลอด 24 ชั่วโมง
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-white py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 text-center sm:px-6 md:grid-cols-4">
          <div>
            <p className="text-2xl">🏛️</p>
            <p className="mt-1 text-sm font-semibold text-brand-dark">ก่อตั้งปี 2481</p>
            <p className="text-xs text-foreground/60">ยกฐานะเป็นวิทยาลัยปี 2524</p>
          </div>
          <div>
            <p className="text-2xl">🛠️</p>
            <p className="mt-1 text-sm font-semibold text-brand-dark">{programs.length}+ สาขาวิชา</p>
            <p className="text-xs text-foreground/60">ปวช. / ปวส. / ปริญญาตรี</p>
          </div>
          <div>
            <p className="text-2xl">🧑‍💼</p>
            <p className="mt-1 text-sm font-semibold text-brand-dark">{college.director}</p>
            <p className="text-xs text-foreground/60">ผู้บริหารวิทยาลัย</p>
          </div>
          <div>
            <p className="text-2xl">🔵⚪</p>
            <p className="mt-1 text-sm font-semibold text-brand-dark">น้ำเงิน-ขาว</p>
            <p className="text-xs text-foreground/60">อดทน ขยัน มีระเบียบวินัย คุณธรรม</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-dark">📸 ภาพประชาสัมพันธ์</h2>
        <div className="mt-6">
          <ImageSlideshow slides={promoSlides} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-dark">⭐ ทำไมต้องเรียนที่นี่</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm shadow-brand/5 transition-shadow hover:shadow-md hover:shadow-brand/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-2xl">
                {h.emoji}
              </span>
              <h3 className="mt-3 font-semibold text-brand-dark">{h.title}</h3>
              <p className="mt-2 text-sm text-foreground/75">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-dark">🛠️ สาขาวิชาที่เปิดสอน</h2>
            <Link href="/programs" className="text-sm font-semibold text-brand hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {programs.slice(0, 4).map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-2xl">{p.emoji}</span>
                <p className="mt-1 text-xs font-semibold text-accent">{p.levels.join(" / ")}</p>
                <h3 className="mt-1 font-semibold text-brand-dark">{p.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-dark">📰 ข่าวประชาสัมพันธ์</h2>
          <Link href="/news" className="text-sm font-semibold text-brand hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {news.map((n) => (
            <article
              key={n.slug}
              className="rounded-2xl border border-border-subtle p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs text-foreground/50">📅 {n.date}</p>
              <h3 className="mt-1 font-semibold text-brand-dark">{n.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{n.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { college } from "@/lib/college-data";

export const metadata: Metadata = {
  title: `ติดต่อเรา | ${college.name}`,
};

const CONTACT_ITEMS = [
  { emoji: "📍", label: "ที่อยู่", value: college.address },
  { emoji: "📞", label: "โทรศัพท์", value: college.phone },
  { emoji: "📠", label: "โทรสาร", value: college.fax },
  { emoji: "✉️", label: "อีเมล", value: college.email },
  { emoji: "📘", label: "Facebook", value: college.facebook },
  { emoji: "💬", label: "Line OA", value: college.lineOA },
  { emoji: "▶️", label: "YouTube", value: college.youtube },
  { emoji: "🎵", label: "TikTok", value: college.tiktok },
  { emoji: "🌐", label: "เว็บไซต์ทางการ", value: college.officialWebsite },
  { emoji: "🕒", label: "เวลาทำการ", value: college.officeHours },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-dark">📮 ติดต่อเรา</h1>
      <p className="mt-2 text-foreground/70">
        สอบถามข้อมูลเพิ่มเติมเกี่ยวกับ {college.name} ผ่านช่องทางด้านล่าง หรือสอบถามผู้ช่วย AI 🤖 ที่ไอคอนแชทมุมขวาล่าง
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {CONTACT_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 ${
              i !== CONTACT_ITEMS.length - 1 ? "border-b border-border-subtle" : ""
            }`}
          >
            <span className="flex w-28 shrink-0 items-center gap-2 text-sm font-semibold text-brand-dark">
              <span>{item.emoji}</span> {item.label}
            </span>
            {item.value.startsWith("http") ? (
              <a
                href={item.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand hover:underline"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-sm text-foreground/75">{item.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
        <a
          href={college.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full items-center justify-center text-sm font-medium text-brand hover:underline"
        >
          🗺️ เปิดแผนที่ Google Maps ไปยังวิทยาลัย ↗
        </a>
      </div>
    </div>
  );
}

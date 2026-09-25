import type { Metadata } from "next";
import { college, news } from "@/lib/college-data";

export const metadata: Metadata = {
  title: `ข่าวประชาสัมพันธ์ | ${college.name}`,
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-dark">📰 ข่าวประชาสัมพันธ์</h1>
      <p className="mt-2 text-foreground/70">ติดตามข่าวสารและกิจกรรมล่าสุดของ {college.name}</p>

      <div className="mt-8 space-y-5">
        {news.map((n) => (
          <article
            key={n.slug}
            className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs text-foreground/50">📅 {n.date}</p>
            <h2 className="mt-1 text-lg font-bold text-brand-dark">{n.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">{n.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

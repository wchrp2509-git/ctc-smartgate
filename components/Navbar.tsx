"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { college } from "@/lib/college-data";

const NAV_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/programs", label: "สาขาวิชาที่เปิดสอน" },
  { href: "/admission", label: "การรับสมัคร" },
  { href: "/news", label: "ข่าวประชาสัมพันธ์" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/90 shadow-sm backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/college-logo.png"
            alt={`ตราสัญลักษณ์ ${college.name}`}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 drop-shadow-sm"
            priority
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-brand-dark sm:text-base">
              {college.name}
            </span>
            <span className="block text-[11px] text-foreground/60 sm:text-xs">
              {college.englishName}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admission"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/30 transition-transform hover:scale-105 hover:bg-brand-light"
          >
            ✨ สมัครเรียนเลย
          </Link>
        </nav>

        <button
          type="button"
          aria-label="เปิดเมนู"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border-subtle text-brand-dark md:hidden"
        >
          <span className="sr-only">เมนู</span>
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border-subtle bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admission"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md bg-brand px-3 py-2 text-center text-sm font-semibold text-white"
              >
                ✨ สมัครเรียนเลย
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

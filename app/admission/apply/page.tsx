import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import { college } from "@/lib/college-data";

export const metadata: Metadata = {
  title: `ใบสมัครเข้าศึกษาต่อ ประเภทโควตา | ${college.name}`,
};

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-dark">📝 ใบสมัครเข้าศึกษาต่อระดับ ปวช./ปวส.</h1>
      <p className="mt-2 text-foreground/70">
        ประเภทโควตา ประจำปีการศึกษา 2569 — กรอกข้อมูลด้านล่าง แล้วกดตรวจสอบและพิมพ์ใบสมัคร
        เพื่อนำไปลงลายมือชื่อและยื่นพร้อมเอกสารหลักฐานที่งานทะเบียนวิทยาลัย
      </p>

      <div className="mt-8">
        <ApplicationForm />
      </div>
    </div>
  );
}

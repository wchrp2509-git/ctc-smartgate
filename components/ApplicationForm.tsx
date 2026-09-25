"use client";

import Image from "next/image";
import { useState } from "react";
import { college, programs } from "@/lib/college-data";

type FormData = {
  level: "ปวช." | "ปวส.";
  prefix: "นาย" | "นางสาว";
  firstName: string;
  lastName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  idCard: string;
  age: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  houseNo: string;
  moo: string;
  soi: string;
  road: string;
  tambon: string;
  amphoe: string;
  province: string;
  zip: string;
  phone: string;
  school: string;
  grade: string;
  oldProgram: string;
  schoolAmphoe: string;
  schoolProvince: string;
  schoolZip: string;
  schoolPhone: string;
  gpa: string;
  talent: string;
  hasHouseRegCopy: boolean;
  hasIdCardCopy: boolean;
  program1: string;
  program2: string;
  teacherName: string;
  teacherPhone: string;
  consent: boolean;
};

const EMPTY_FORM: FormData = {
  level: "ปวช.",
  prefix: "นาย",
  firstName: "",
  lastName: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  idCard: "",
  age: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  houseNo: "",
  moo: "",
  soi: "",
  road: "",
  tambon: "",
  amphoe: "",
  province: "",
  zip: "",
  phone: "",
  school: "",
  grade: "",
  oldProgram: "",
  schoolAmphoe: "",
  schoolProvince: "",
  schoolZip: "",
  schoolPhone: "",
  gpa: "",
  talent: "",
  hasHouseRegCopy: false,
  hasIdCardCopy: false,
  program1: "",
  program2: "",
  teacherName: "",
  teacherPhone: "",
  consent: false,
};

const inputClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand";
const labelClass = "mb-1 block text-xs font-semibold text-foreground/70";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="whitespace-nowrap">{label}</span>
      <span className="min-w-[3rem] flex-1 border-b border-dotted border-foreground/50 px-1">
        {value || " "}
      </span>
    </span>
  );
}

export default function ApplicationForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.idCard.trim() ||
      !form.phone.trim() ||
      !form.program1
    ) {
      setError("กรุณากรอกข้อมูลให้ครบ อย่างน้อย ชื่อ-สกุล เลขบัตรประชาชน เบอร์โทรศัพท์ และสาขาวิชาลำดับ 1");
      return;
    }
    if (!form.consent) {
      setError("กรุณายืนยันว่าข้อมูลเป็นความจริง และยอมรับเงื่อนไขการสมัคร");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
      setApplicationId(data.id);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-brand-dark print:hidden">
          ✅ <strong>บันทึกข้อมูลเรียบร้อยแล้ว</strong> รหัสอ้างอิงใบสมัคร #{applicationId}
          <br />
          ข้อมูลนี้ถูกบันทึกไว้ในระบบของวิทยาลัยแล้ว แต่ยังต้อง <strong>พิมพ์เอกสารนี้ ลงลายมือชื่อ แนบเอกสารหลักฐาน
          แล้วยื่นด้วยตนเองที่งานทะเบียนวิทยาลัย</strong> เพื่อให้การสมัครสมบูรณ์ตามขั้นตอนจริง
          หรือสอบถามเพิ่มเติมได้ที่ {college.phone}
        </div>

        <div className="mb-4 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            🖨️ พิมพ์ใบสมัคร
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-full border border-border-subtle px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-surface"
          >
            ✏️ แก้ไขข้อมูล
          </button>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 text-sm leading-relaxed text-foreground shadow-sm sm:p-8 print:rounded-none print:border-black print:shadow-none">
          <div className="flex items-start justify-between gap-4">
            <div className="w-20 print:w-16" />
            <div className="flex-1 text-center">
              <Image
                src="/college-logo.png"
                alt={`ตราสัญลักษณ์ ${college.name}`}
                width={72}
                height={72}
                className="mx-auto h-16 w-16"
              />
              <h1 className="mt-2 text-base font-bold">
                ใบสมัครเข้าศึกษาต่อระดับ {form.level === "ปวช." ? "☑" : "☐"} ปวช.{" "}
                {form.level === "ปวส." ? "☑" : "☐"} ปวส. ประเภทโควตา
              </h1>
              <p className="font-semibold">ประจำปีการศึกษา 2569</p>
              <p className="font-semibold">{college.name}</p>
            </div>
            <div className="w-20 shrink-0 text-right text-xs print:w-16">
              <p>เอกสารหมายเลข 3</p>
              <div className="mt-2 ml-auto flex h-24 w-20 items-center justify-center border border-dashed border-foreground/40 text-center text-[10px] leading-tight">
                รูปถ่ายขนาด
                <br />1 นิ้ว
              </div>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          <h2 className="mb-2 font-bold underline">ประวัติผู้สมัคร</h2>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="ชื่อ-สกุล" value={`${form.prefix} ${form.firstName} ${form.lastName}`} />
              <Line label="เกิดวันที่" value={form.birthDay} />
              <Line label="เดือน" value={form.birthMonth} />
              <Line label="พ.ศ." value={form.birthYear} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="เลขบัตรประชาชน" value={form.idCard} />
              <Line label="อายุ" value={form.age ? `${form.age} ปี` : ""} />
              <Line label="ชื่อ-สกุล บิดา" value={form.fatherName} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="อาชีพ" value={form.fatherOccupation} />
              <Line label="ชื่อ-สกุล มารดา" value={form.motherName} />
              <Line label="อาชีพ" value={form.motherOccupation} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="ภูมิลำเนา บ้านเลขที่" value={form.houseNo} />
              <Line label="หมู่ที่" value={form.moo} />
              <Line label="ตรอก/ซอย" value={form.soi} />
              <Line label="ถนน" value={form.road} />
              <Line label="ตำบล" value={form.tambon} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="อำเภอ" value={form.amphoe} />
              <Line label="จังหวัด" value={form.province} />
              <Line label="รหัสไปรษณีย์" value={form.zip} />
              <Line label="โทรศัพท์" value={form.phone} />
            </div>
          </div>

          <h2 className="mt-5 mb-2 font-bold underline">ประวัติการศึกษา</h2>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="กำลังศึกษาอยู่โรงเรียน/วิทยาลัย" value={form.school} />
              <Line label="ชั้น/ระดับ" value={form.grade} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="โปรแกรม/สาขาวิชา" value={form.oldProgram} />
              <Line label="อำเภอ" value={form.schoolAmphoe} />
              <Line label="จังหวัด" value={form.schoolProvince} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="รหัสไปรษณีย์" value={form.schoolZip} />
              <Line label="โทรศัพท์" value={form.schoolPhone} />
              <Line label="ผลการเรียน (เกรดเฉลี่ยสะสม) 5 ภาคเรียน" value={form.gpa} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              <Line label="ความสามารถพิเศษ" value={form.talent} />
            </div>
          </div>

          <h2 className="mt-5 mb-2 font-bold underline">เอกสารหลักฐานที่ส่งมาพร้อมใบสมัคร</h2>
          <p>
            {form.hasHouseRegCopy ? "☑" : "☐"} สำเนาทะเบียนบ้าน ของตนเอง จำนวน 1 ฉบับ
            <br />
            {form.hasIdCardCopy ? "☑" : "☐"} สำเนาบัตรประชาชน ของตนเอง จำนวน 1 ฉบับ
          </p>
          <p className="mt-1 text-xs text-foreground/60">
            ***เอกสารหลักฐานต้องรับรองสำเนาถูกต้อง และลายมือชื่อ-นามสกุล***
          </p>

          <h2 className="mt-5 mb-2 font-bold underline">สมัครเข้าศึกษาต่อ</h2>
          <div className="space-y-1">
            <Line label="สาขาวิชา 1)" value={form.program1} />
            <div>
              <Line label="สาขาวิชา 2)" value={form.program2} />
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed">
            หากผลการพิจารณาคัดเลือกแล้วไม่ได้รับการคัดเลือกตามสาขาที่สมัครไว้ ผู้สมัครยินยอมที่จะให้{" "}
            {college.name} จัดสาขาวิชาลำดับที่ 2 ให้ผู้สมัครแทน
            <br />
            ขอรับรองว่าข้อความนี้เป็นความจริงทุกประการ
          </p>

          <div className="mt-8 flex flex-col items-end gap-6 text-sm">
            <div className="text-center">
              <p>ลงชื่อ.......................................................ผู้สมัคร</p>
              <p>({form.prefix} {form.firstName} {form.lastName})</p>
            </div>
            <div className="text-center">
              <p>ลงชื่อ.......................................................ครูประจำชั้น/ครูที่รับรอง</p>
              <p>({form.teacherName || " "})</p>
              <p>เบอร์ติดต่อ {form.teacherPhone}</p>
            </div>
          </div>

          <p className="mt-6 border-t border-dashed pt-3 text-xs text-foreground/50">
            รหัสอ้างอิงใบสมัคร #{applicationId} — บันทึกข้อมูลในระบบแล้ว แต่ยังต้องพิมพ์เอกสารนี้ ลงลายมือชื่อ
            แนบเอกสารหลักฐาน แล้วยื่นที่งานทะเบียน {college.name} ({college.phone}) เพื่อให้การสมัครสมบูรณ์
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">🎯 ระดับที่สมัคร</h2>
        <div className="flex gap-3">
          {(["ปวช.", "ปวส."] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => update("level", lv)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                form.level === lv
                  ? "border-brand bg-brand text-white"
                  : "border-border-subtle text-foreground/70 hover:bg-surface"
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">🧑 ประวัติผู้สมัคร</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Field label="คำนำหน้า">
            <select
              className={inputClass}
              value={form.prefix}
              onChange={(e) => update("prefix", e.target.value as FormData["prefix"])}
            >
              <option value="นาย">นาย</option>
              <option value="นางสาว">นางสาว</option>
            </select>
          </Field>
          <Field label="ชื่อ *">
            <input className={inputClass} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          </Field>
          <Field label="นามสกุล *">
            <input className={inputClass} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
          </Field>
          <Field label="เกิดวันที่">
            <input className={inputClass} placeholder="เช่น 15" value={form.birthDay} onChange={(e) => update("birthDay", e.target.value)} />
          </Field>
          <Field label="เดือน">
            <input className={inputClass} placeholder="เช่น มกราคม" value={form.birthMonth} onChange={(e) => update("birthMonth", e.target.value)} />
          </Field>
          <Field label="พ.ศ. เกิด">
            <input className={inputClass} placeholder="เช่น 2552" value={form.birthYear} onChange={(e) => update("birthYear", e.target.value)} />
          </Field>
          <Field label="เลขบัตรประชาชน *">
            <input className={inputClass} maxLength={13} value={form.idCard} onChange={(e) => update("idCard", e.target.value)} required />
          </Field>
          <Field label="อายุ (ปี)">
            <input className={inputClass} value={form.age} onChange={(e) => update("age", e.target.value)} />
          </Field>
          <Field label="เบอร์โทรศัพท์ *">
            <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          </Field>
          <Field label="ชื่อ-สกุล บิดา">
            <input className={inputClass} value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
          </Field>
          <Field label="อาชีพบิดา">
            <input className={inputClass} value={form.fatherOccupation} onChange={(e) => update("fatherOccupation", e.target.value)} />
          </Field>
          <Field label="ชื่อ-สกุล มารดา">
            <input className={inputClass} value={form.motherName} onChange={(e) => update("motherName", e.target.value)} />
          </Field>
          <Field label="อาชีพมารดา">
            <input className={inputClass} value={form.motherOccupation} onChange={(e) => update("motherOccupation", e.target.value)} />
          </Field>
        </div>

        <h3 className="mt-6 mb-3 text-sm font-semibold text-foreground/70">📍 ภูมิลำเนา</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Field label="บ้านเลขที่"><input className={inputClass} value={form.houseNo} onChange={(e) => update("houseNo", e.target.value)} /></Field>
          <Field label="หมู่ที่"><input className={inputClass} value={form.moo} onChange={(e) => update("moo", e.target.value)} /></Field>
          <Field label="ตรอก/ซอย"><input className={inputClass} value={form.soi} onChange={(e) => update("soi", e.target.value)} /></Field>
          <Field label="ถนน"><input className={inputClass} value={form.road} onChange={(e) => update("road", e.target.value)} /></Field>
          <Field label="ตำบล"><input className={inputClass} value={form.tambon} onChange={(e) => update("tambon", e.target.value)} /></Field>
          <Field label="อำเภอ"><input className={inputClass} value={form.amphoe} onChange={(e) => update("amphoe", e.target.value)} /></Field>
          <Field label="จังหวัด"><input className={inputClass} value={form.province} onChange={(e) => update("province", e.target.value)} /></Field>
          <Field label="รหัสไปรษณีย์"><input className={inputClass} value={form.zip} onChange={(e) => update("zip", e.target.value)} /></Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">🏫 ประวัติการศึกษา</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Field label="กำลังศึกษาอยู่โรงเรียน/วิทยาลัย">
            <input className={inputClass} value={form.school} onChange={(e) => update("school", e.target.value)} />
          </Field>
          <Field label="ชั้น/ระดับ">
            <input className={inputClass} placeholder="เช่น ม.3" value={form.grade} onChange={(e) => update("grade", e.target.value)} />
          </Field>
          <Field label="โปรแกรม/สาขาวิชา (ถ้ามี)">
            <input className={inputClass} value={form.oldProgram} onChange={(e) => update("oldProgram", e.target.value)} />
          </Field>
          <Field label="อำเภอ (ของโรงเรียน)">
            <input className={inputClass} value={form.schoolAmphoe} onChange={(e) => update("schoolAmphoe", e.target.value)} />
          </Field>
          <Field label="จังหวัด (ของโรงเรียน)">
            <input className={inputClass} value={form.schoolProvince} onChange={(e) => update("schoolProvince", e.target.value)} />
          </Field>
          <Field label="รหัสไปรษณีย์ (ของโรงเรียน)">
            <input className={inputClass} value={form.schoolZip} onChange={(e) => update("schoolZip", e.target.value)} />
          </Field>
          <Field label="โทรศัพท์โรงเรียน">
            <input className={inputClass} value={form.schoolPhone} onChange={(e) => update("schoolPhone", e.target.value)} />
          </Field>
          <Field label="เกรดเฉลี่ยสะสม 5 ภาคเรียน">
            <input className={inputClass} placeholder="เช่น 2.75" value={form.gpa} onChange={(e) => update("gpa", e.target.value)} />
          </Field>
          <Field label="ความสามารถพิเศษ">
            <input className={inputClass} value={form.talent} onChange={(e) => update("talent", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">📄 เอกสารหลักฐานที่จะเตรียมมา</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.hasHouseRegCopy} onChange={(e) => update("hasHouseRegCopy", e.target.checked)} />
          สำเนาทะเบียนบ้านของตนเอง จำนวน 1 ฉบับ
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.hasIdCardCopy} onChange={(e) => update("hasIdCardCopy", e.target.checked)} />
          สำเนาบัตรประชาชนของตนเอง จำนวน 1 ฉบับ
        </label>
        <p className="mt-2 text-xs text-foreground/60">
          ***เอกสารหลักฐานต้องรับรองสำเนาถูกต้อง และลงลายมือชื่อ-นามสกุลด้วยตนเอง***
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">🛠️ สมัครเข้าศึกษาต่อ สาขาวิชา</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="สาขาวิชาลำดับที่ 1 (สาขาที่ต้องการมากที่สุด) *">
            <select className={inputClass} value={form.program1} onChange={(e) => update("program1", e.target.value)} required>
              <option value="">— เลือกสาขาวิชา —</option>
              {programs.map((p) => (
                <option key={p.slug} value={p.name}>
                  {p.name} ({p.levels.join("/")})
                </option>
              ))}
            </select>
          </Field>
          <Field label="สาขาวิชาลำดับที่ 2 (สำรอง)">
            <select className={inputClass} value={form.program2} onChange={(e) => update("program2", e.target.value)}>
              <option value="">— เลือกสาขาวิชา (ถ้ามี) —</option>
              {programs.map((p) => (
                <option key={p.slug} value={p.name}>
                  {p.name} ({p.levels.join("/")})
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-foreground/70">
          หากผลการพิจารณาคัดเลือกแล้วไม่ได้รับการคัดเลือกตามสาขาที่สมัครไว้ ผู้สมัครยินยอมที่จะให้{college.name}
          จัดสาขาวิชาลำดับที่ 2 ให้ผู้สมัครแทน
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-brand-dark">✍️ ผู้รับรอง (ถ้ามี)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อครูประจำชั้น/ครูที่รับรอง">
            <input className={inputClass} value={form.teacherName} onChange={(e) => update("teacherName", e.target.value)} />
          </Field>
          <Field label="เบอร์ติดต่อครู">
            <input className={inputClass} value={form.teacherPhone} onChange={(e) => update("teacherPhone", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
          />
          <span>
            ข้าพเจ้าขอรับรองว่าข้อความในใบสมัครนี้เป็นความจริงทุกประการ และยินยอมว่าหากไม่ได้รับการคัดเลือกในสาขาวิชาลำดับที่ 1
            ยินดีให้{college.name}จัดสาขาวิชาลำดับที่ 2 ให้แทน
          </span>
        </label>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">⚠️ {error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
        >
          {submitting ? "⏳ กำลังบันทึกข้อมูล..." : "📝 บันทึกและพิมพ์ใบสมัคร"}
        </button>
        <p className="mt-2 text-xs text-foreground/60">
          * เมื่อกดบันทึก ข้อมูลจะถูกส่งไปเก็บไว้ในระบบของวิทยาลัย (ฐานข้อมูล) และสร้างเอกสารสำหรับพิมพ์
        </p>
      </div>
    </form>
  );
}

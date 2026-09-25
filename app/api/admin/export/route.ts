import { isAuthenticated } from "@/lib/auth";
import { listApplications, type ApplicationRow } from "@/lib/db";

export const runtime = "nodejs";

const COLUMNS: { key: keyof ApplicationRow; label: string }[] = [
  { key: "id", label: "ลำดับ" },
  { key: "createdAt", label: "วันที่สมัคร" },
  { key: "level", label: "ระดับ" },
  { key: "prefix", label: "คำนำหน้า" },
  { key: "firstName", label: "ชื่อ" },
  { key: "lastName", label: "นามสกุล" },
  { key: "birthDay", label: "เกิดวันที่" },
  { key: "birthMonth", label: "เดือนเกิด" },
  { key: "birthYear", label: "ปีเกิด (พ.ศ.)" },
  { key: "idCard", label: "เลขบัตรประชาชน" },
  { key: "age", label: "อายุ" },
  { key: "fatherName", label: "ชื่อบิดา" },
  { key: "fatherOccupation", label: "อาชีพบิดา" },
  { key: "motherName", label: "ชื่อมารดา" },
  { key: "motherOccupation", label: "อาชีพมารดา" },
  { key: "houseNo", label: "บ้านเลขที่" },
  { key: "moo", label: "หมู่ที่" },
  { key: "soi", label: "ตรอก/ซอย" },
  { key: "road", label: "ถนน" },
  { key: "tambon", label: "ตำบล" },
  { key: "amphoe", label: "อำเภอ" },
  { key: "province", label: "จังหวัด" },
  { key: "zip", label: "รหัสไปรษณีย์" },
  { key: "phone", label: "โทรศัพท์" },
  { key: "school", label: "โรงเรียนเดิม" },
  { key: "grade", label: "ชั้น/ระดับ" },
  { key: "oldProgram", label: "โปรแกรม/สาขาเดิม" },
  { key: "gpa", label: "เกรดเฉลี่ยสะสม" },
  { key: "talent", label: "ความสามารถพิเศษ" },
  { key: "hasHouseRegCopy", label: "มีสำเนาทะเบียนบ้าน" },
  { key: "hasIdCardCopy", label: "มีสำเนาบัตรประชาชน" },
  { key: "program1", label: "สาขาลำดับ 1" },
  { key: "program2", label: "สาขาลำดับ 2" },
  { key: "teacherName", label: "ครูผู้รับรอง" },
  { key: "teacherPhone", label: "เบอร์ครูผู้รับรอง" },
];

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await listApplications();
  const header = COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const body = rows
    .map((row) => COLUMNS.map((c) => csvEscape(row[c.key])).join(","))
    .join("\n");

  // ใส่ BOM (﻿) นำหน้า เพื่อให้ Excel เปิดไฟล์แล้วอ่านภาษาไทย (UTF-8) ถูกต้อง
  const csv = "﻿" + [header, body].filter(Boolean).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${Date.now()}.csv"`,
    },
  });
}

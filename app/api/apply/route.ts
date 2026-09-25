import { saveApplication, type ApplicationRecord } from "@/lib/db";

export const runtime = "nodejs";

const REQUIRED_FIELDS: (keyof ApplicationRecord)[] = [
  "firstName",
  "lastName",
  "idCard",
  "phone",
  "program1",
];

function toStringField(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 500) : "";
}

function sanitize(body: unknown): ApplicationRecord | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const record: ApplicationRecord = {
    level: b.level === "ปวส." ? "ปวส." : "ปวช.",
    prefix: b.prefix === "นางสาว" ? "นางสาว" : "นาย",
    firstName: toStringField(b.firstName),
    lastName: toStringField(b.lastName),
    birthDay: toStringField(b.birthDay),
    birthMonth: toStringField(b.birthMonth),
    birthYear: toStringField(b.birthYear),
    idCard: toStringField(b.idCard),
    age: toStringField(b.age),
    fatherName: toStringField(b.fatherName),
    fatherOccupation: toStringField(b.fatherOccupation),
    motherName: toStringField(b.motherName),
    motherOccupation: toStringField(b.motherOccupation),
    houseNo: toStringField(b.houseNo),
    moo: toStringField(b.moo),
    soi: toStringField(b.soi),
    road: toStringField(b.road),
    tambon: toStringField(b.tambon),
    amphoe: toStringField(b.amphoe),
    province: toStringField(b.province),
    zip: toStringField(b.zip),
    phone: toStringField(b.phone),
    school: toStringField(b.school),
    grade: toStringField(b.grade),
    oldProgram: toStringField(b.oldProgram),
    schoolAmphoe: toStringField(b.schoolAmphoe),
    schoolProvince: toStringField(b.schoolProvince),
    schoolZip: toStringField(b.schoolZip),
    schoolPhone: toStringField(b.schoolPhone),
    gpa: toStringField(b.gpa),
    talent: toStringField(b.talent),
    hasHouseRegCopy: Boolean(b.hasHouseRegCopy),
    hasIdCardCopy: Boolean(b.hasIdCardCopy),
    program1: toStringField(b.program1),
    program2: toStringField(b.program2),
    teacherName: toStringField(b.teacherName),
    teacherPhone: toStringField(b.teacherPhone),
  };

  for (const field of REQUIRED_FIELDS) {
    if (!record[field]) return null;
  }
  return record;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "คำขอไม่ถูกต้อง" }, { status: 400 });
  }

  const record = sanitize(body);
  if (!record) {
    return Response.json(
      { error: "กรุณากรอกข้อมูลให้ครบ อย่างน้อย ชื่อ-สกุล เลขบัตรประชาชน เบอร์โทรศัพท์ และสาขาวิชาลำดับ 1" },
      { status: 400 },
    );
  }

  try {
    const id = await saveApplication(record);
    return Response.json({ id });
  } catch (err) {
    console.error("Save application error:", err);
    return Response.json({ error: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}

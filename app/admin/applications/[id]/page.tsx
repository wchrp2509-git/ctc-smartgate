import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { isAuthenticated } from "@/lib/auth";
import { getApplicationById } from "@/lib/db";

// ห้าม cache/prerender — ต้องเช็ก cookie และดึงข้อมูลล่าสุดทุกครั้ง
export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-border-subtle py-2 text-sm last:border-0">
      <span className="text-foreground/60">{label}</span>
      <span className="col-span-2 font-medium text-brand-dark">{value || "—"}</span>
    </div>
  );
}

export default async function AdminApplicationDetailPage(
  props: PageProps<"/admin/applications/[id]">,
) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await props.params;
  const application = await getApplicationById(Number(id));
  if (!application) notFound();

  const a = application;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">
          ← กลับไปรายชื่อผู้สมัคร
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-brand-dark">
          ใบสมัคร #{a.id} — {a.prefix} {a.firstName} {a.lastName}
        </h1>
        <p className="mt-1 text-xs text-foreground/50">ส่งเมื่อ {a.createdAt}</p>

        <h2 className="mt-6 mb-1 font-bold underline">ประวัติผู้สมัคร</h2>
        <Row label="ระดับที่สมัคร" value={a.level} />
        <Row label="ชื่อ-สกุล" value={`${a.prefix} ${a.firstName} ${a.lastName}`} />
        <Row label="เกิดวันที่" value={`${a.birthDay} ${a.birthMonth} พ.ศ. ${a.birthYear}`} />
        <Row label="เลขบัตรประชาชน" value={a.idCard} />
        <Row label="อายุ" value={a.age ? `${a.age} ปี` : ""} />
        <Row label="โทรศัพท์" value={a.phone} />
        <Row label="ชื่อ-สกุล บิดา" value={a.fatherName} />
        <Row label="อาชีพบิดา" value={a.fatherOccupation} />
        <Row label="ชื่อ-สกุล มารดา" value={a.motherName} />
        <Row label="อาชีพมารดา" value={a.motherOccupation} />
        <Row
          label="ภูมิลำเนา"
          value={`${a.houseNo} หมู่ ${a.moo} ${a.soi} ${a.road} ต.${a.tambon} อ.${a.amphoe} จ.${a.province} ${a.zip}`}
        />

        <h2 className="mt-6 mb-1 font-bold underline">ประวัติการศึกษา</h2>
        <Row label="โรงเรียน/วิทยาลัยเดิม" value={a.school} />
        <Row label="ชั้น/ระดับ" value={a.grade} />
        <Row label="โปรแกรม/สาขาวิชาเดิม" value={a.oldProgram} />
        <Row
          label="ที่อยู่โรงเรียน"
          value={[a.schoolAmphoe, a.schoolProvince, a.schoolZip].filter(Boolean).join(" ")}
        />
        <Row label="โทรศัพท์โรงเรียน" value={a.schoolPhone} />
        <Row label="เกรดเฉลี่ยสะสม 5 ภาคเรียน" value={a.gpa} />
        <Row label="ความสามารถพิเศษ" value={a.talent} />

        <h2 className="mt-6 mb-1 font-bold underline">เอกสารหลักฐาน</h2>
        <Row label="สำเนาทะเบียนบ้าน" value={a.hasHouseRegCopy ? "✅ มี" : "❌ ไม่มี"} />
        <Row label="สำเนาบัตรประชาชน" value={a.hasIdCardCopy ? "✅ มี" : "❌ ไม่มี"} />

        <h2 className="mt-6 mb-1 font-bold underline">สาขาวิชาที่สมัคร</h2>
        <Row label="ลำดับ 1" value={a.program1} />
        <Row label="ลำดับ 2 (สำรอง)" value={a.program2} />

        <h2 className="mt-6 mb-1 font-bold underline">ผู้รับรอง</h2>
        <Row label="ชื่อครูประจำชั้น/ผู้รับรอง" value={a.teacherName} />
        <Row label="เบอร์ติดต่อ" value={a.teacherPhone} />
      </div>
    </div>
  );
}

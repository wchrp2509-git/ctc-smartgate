import mysql from "mysql2/promise";
import type { ResultSetHeader } from "mysql2/promise";

// เชื่อมต่อฐานข้อมูล MariaDB — ตั้งค่าผ่าน environment variables
// (DB_HOST/DB_PORT ชี้เซิร์ฟเวอร์ ส่วน MARIADB_* ใช้ชื่อเดียวกับที่ container mariadb ใช้สร้างผู้ใช้/ฐานข้อมูล
// เพื่อไม่ต้องตั้งชื่อตัวแปรซ้ำสองชุด)
const globalForDb = globalThis as unknown as { __pool?: mysql.Pool };

export const pool =
  globalForDb.__pool ??
  mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    charset: "utf8mb4",
    namedPlaceholders: true,
    waitForConnections: true,
    connectionLimit: 10,
  });
globalForDb.__pool = pool;

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level TEXT,
    prefix TEXT,
    first_name TEXT,
    last_name TEXT,
    birth_day TEXT,
    birth_month TEXT,
    birth_year TEXT,
    id_card TEXT,
    age TEXT,
    father_name TEXT,
    father_occupation TEXT,
    mother_name TEXT,
    mother_occupation TEXT,
    house_no TEXT,
    moo TEXT,
    soi TEXT,
    road TEXT,
    tambon TEXT,
    amphoe TEXT,
    province TEXT,
    zip TEXT,
    phone TEXT,
    school TEXT,
    grade TEXT,
    old_program TEXT,
    school_amphoe TEXT,
    school_province TEXT,
    school_zip TEXT,
    school_phone TEXT,
    gpa TEXT,
    talent TEXT,
    has_house_reg_copy TINYINT(1),
    has_id_card_copy TINYINT(1),
    program1 TEXT,
    program2 TEXT,
    teacher_name TEXT,
    teacher_phone TEXT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

// สร้างตารางครั้งแรกที่ใช้งาน — ลองใหม่สักพักถ้า MariaDB ยังเริ่มระบบไม่เสร็จ
// (ถึงจะมี healthcheck ใน docker-compose แล้ว ก็กันพลาดไว้อีกชั้น)
let schemaReady: Promise<void> | null = null;
async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const maxAttempts = 10;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await pool.query(CREATE_TABLE_SQL);
          return;
        } catch (err) {
          if (attempt === maxAttempts) throw err;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    })();
  }
  return schemaReady;
}

export type ApplicationRecord = {
  level: string;
  prefix: string;
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
};

const INSERT_SQL = `
  INSERT INTO applications (
    level, prefix, first_name, last_name, birth_day, birth_month, birth_year,
    id_card, age, father_name, father_occupation, mother_name, mother_occupation,
    house_no, moo, soi, road, tambon, amphoe, province, zip, phone,
    school, grade, old_program, school_amphoe, school_province, school_zip, school_phone, gpa, talent,
    has_house_reg_copy, has_id_card_copy, program1, program2, teacher_name, teacher_phone
  ) VALUES (
    :level, :prefix, :firstName, :lastName, :birthDay, :birthMonth, :birthYear,
    :idCard, :age, :fatherName, :fatherOccupation, :motherName, :motherOccupation,
    :houseNo, :moo, :soi, :road, :tambon, :amphoe, :province, :zip, :phone,
    :school, :grade, :oldProgram, :schoolAmphoe, :schoolProvince, :schoolZip, :schoolPhone, :gpa, :talent,
    :hasHouseRegCopy, :hasIdCardCopy, :program1, :program2, :teacherName, :teacherPhone
  )
`;

export async function saveApplication(record: ApplicationRecord): Promise<number> {
  await ensureSchema();
  const [result] = await pool.execute<ResultSetHeader>(INSERT_SQL, {
    ...record,
    hasHouseRegCopy: record.hasHouseRegCopy ? 1 : 0,
    hasIdCardCopy: record.hasIdCardCopy ? 1 : 0,
  });
  return result.insertId;
}

export type ApplicationRow = ApplicationRecord & {
  id: number;
  createdAt: string;
};

function mapRow(row: Record<string, unknown>): ApplicationRow {
  return {
    id: row.id as number,
    createdAt: String(row.created_at),
    level: row.level as string,
    prefix: row.prefix as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    birthDay: row.birth_day as string,
    birthMonth: row.birth_month as string,
    birthYear: row.birth_year as string,
    idCard: row.id_card as string,
    age: row.age as string,
    fatherName: row.father_name as string,
    fatherOccupation: row.father_occupation as string,
    motherName: row.mother_name as string,
    motherOccupation: row.mother_occupation as string,
    houseNo: row.house_no as string,
    moo: row.moo as string,
    soi: row.soi as string,
    road: row.road as string,
    tambon: row.tambon as string,
    amphoe: row.amphoe as string,
    province: row.province as string,
    zip: row.zip as string,
    phone: row.phone as string,
    school: row.school as string,
    grade: row.grade as string,
    oldProgram: row.old_program as string,
    schoolAmphoe: row.school_amphoe as string,
    schoolProvince: row.school_province as string,
    schoolZip: row.school_zip as string,
    schoolPhone: row.school_phone as string,
    gpa: row.gpa as string,
    talent: row.talent as string,
    hasHouseRegCopy: Boolean(row.has_house_reg_copy),
    hasIdCardCopy: Boolean(row.has_id_card_copy),
    program1: row.program1 as string,
    program2: row.program2 as string,
    teacherName: row.teacher_name as string,
    teacherPhone: row.teacher_phone as string,
  };
}

export async function listApplications(): Promise<ApplicationRow[]> {
  await ensureSchema();
  const [rows] = await pool.query("SELECT * FROM applications ORDER BY id DESC");
  return (rows as Record<string, unknown>[]).map(mapRow);
}

export async function getApplicationById(id: number): Promise<ApplicationRow | null> {
  await ensureSchema();
  const [rows] = await pool.execute("SELECT * FROM applications WHERE id = ?", [id]);
  const row = (rows as Record<string, unknown>[])[0];
  return row ? mapRow(row) : null;
}

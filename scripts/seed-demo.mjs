/**
 * Demo-data seeder for the ICSR admissions database.
 * Usage:  DATABASE_URL=... node scripts/seed-demo.mjs
 *
 * - Removes local test rows (arun@example.com)
 * - Inserts a realistic demo cohort of students (public directory consent ON)
 * - Inserts one demo application so the Staff Console has content
 *
 * Safe to re-run: demo rows are keyed by email and de-duplicated.
 */
const postgres = (await import("postgres")).default;

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });

// 0) Ensure the schema exists (idempotent — mirrors src/server/db.ts).
import { readFileSync } from "node:fs";
const schemaPath = new URL("../db/schema.sql", import.meta.url);
await sql.unsafe(readFileSync(schemaPath, "utf8"));

// 1) Clean earlier smoke-test rows.
await sql`DELETE FROM students WHERE email = 'arun@example.com'`;
await sql`DELETE FROM applications WHERE email = 'arun@example.com'`;
await sql`DELETE FROM application_leads WHERE email = 'arun@example.com'`;

// 2) Demo students (all consent to appear in the public directory).
const students = [
  [
    "David Raju P.",
    "david.raju@example.com",
    "9849210001",
    "bth",
    "English",
    "Vijayawada",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Mary Suhasini G.",
    "mary.suhasini@example.com",
    "9701120002",
    "mdiv",
    "English",
    "Guntur",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Samuel Yesuratnam K.",
    "samuel.y@example.com",
    "9959330003",
    "bth",
    "Telugu",
    "Ongole",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Esther Rani M.",
    "esther.rani@example.com",
    "9963440004",
    "cth",
    "Telugu",
    "Nellore",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Paul Prashanth T.",
    "paul.prashanth@example.com",
    "9705550005",
    "mth",
    "English",
    "Hyderabad",
    "Telangana",
    "alumni",
  ],
  [
    "John Wesley D.",
    "john.wesley@example.com",
    "9866660006",
    "dipth",
    "Telugu",
    "Eluru",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Grace Jyothi V.",
    "grace.jyothi@example.com",
    "9912770007",
    "cth",
    "English",
    "Kakinada",
    "Andhra Pradesh",
    "active",
  ],
  [
    "Immanuel Benhur S.",
    "immanuel.b@example.com",
    "9948880008",
    "phd",
    "English",
    "Visakhapatnam",
    "Andhra Pradesh",
    "active",
  ],
];

for (const [name, email, mobile, courseId, medium, city, state, status] of students) {
  await sql`
    INSERT INTO students (full_name, email, mobile, course_id, medium, city, state, status, public_directory, notes)
    VALUES (${name}, ${email}, ${mobile}, ${courseId}, ${medium}, ${city}, ${state}, ${status}, true, 'Demo record — remove via Staff Console.')
    ON CONFLICT DO NOTHING`;
  const existing = await sql`SELECT id FROM students WHERE email = ${email} LIMIT 1`;
  if (existing.length > 1) {
    await sql`DELETE FROM students WHERE email = ${email} AND id <> ${existing[0].id}`;
  }
}

// 3) One demo application in review.
const demoEmail = "demo.applicant@example.com";
await sql`DELETE FROM students WHERE email = ${demoEmail}`;
await sql`DELETE FROM applications WHERE email = ${demoEmail}`;
await sql`
  INSERT INTO applications (
    reference_code, full_name, mobile, email, course_id, medium,
    date_of_birth, fathers_or_husbands_name, address_line, city, state, pin_code,
    baptism_date, denomination_church, ministry_experience,
    academic_qualifications, theological_qualifications, status, admin_notes
  ) VALUES (
    'ICS-2026-DEMO01', 'Ravi Teja A.', '9000011111', ${demoEmail}, 'bth', 'Telugu',
    '1998-03-12', 'Pr. Anand Rao A.', 'Plot 7, Bhavanipuram', 'Vijayawada', 'Andhra Pradesh', '520012',
    '2012-07-15', 'Baptist', 'Sunday school teacher for 5 years',
    '[{"course":"B.Com","board":"Andhra University","institution":"AV College","year":"2019","grade":"68%"}]'::jsonb,
    '[]'::jsonb,
    'under_review', 'Demo record — delete via Staff Console.'
  )`;

const counts = await sql`
  SELECT
    (SELECT count(*) FROM students) AS students,
    (SELECT count(*) FROM applications) AS applications,
    (SELECT count(*) FROM application_leads) AS leads`;
console.log("Seed complete:", counts[0]);
await sql.end();

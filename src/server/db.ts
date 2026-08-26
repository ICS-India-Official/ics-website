import postgres from "postgres";
import {
  type AdminApplicationRow,
  type AdminStats,
  type AdminStudentRow,
  type ApplicationStatus,
  type PublicStudentRow,
  type StudentStatus,
} from "../lib/admin-types";

export {
  APPLICATION_STATUSES,
  STUDENT_STATUSES,
  type AdminApplicationRow,
  type AdminStats,
  type AdminStudentRow,
  type ApplicationStatus,
  type PublicStudentRow,
  type StudentStatus,
} from "../lib/admin-types";

/**
 * PostgreSQL access layer (server-only).
 *
 * Every export is called exclusively from inside TanStack Start server-function
 * handlers, and `postgres` is imported lazily so it can never be bundled for
 * the client.
 *
 * Configuration: set DATABASE_URL (e.g. a Neon / Supabase / RDS pooled
 * connection string). If the database is unreachable the helpers degrade
 * gracefully â€” callers receive stored:false and the payload is logged so no
 * applicant is ever lost.
 */

type Sql = ReturnType<typeof postgres>;

let sqlPromise: Promise<Sql | null> | undefined;

function getDatabaseUrl(): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.["DATABASE_URL"] : undefined;
  return fromProcess || undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

async function getSql(): Promise<Sql | null> {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const url = getDatabaseUrl();
      if (!url) {
        console.warn("[db] DATABASE_URL is not set â€” applications will not be persisted.");
        return null;
      }
      try {
        const postgres = (await import("postgres")).default;
        return postgres(url, {
          ssl: url.includes("sslmode=disable") ? false : "prefer",
          max: 5,
          idle_timeout: 20,
          connect_timeout: 10,
          prepare: false,
        });
      } catch (err) {
        console.error("[db] failed to initialise PostgreSQL driver:", err);
        return null;
      }
    })();
  }
  return sqlPromise;
}

/* â”€â”€ Schema bootstrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

let schemaReady: Promise<boolean> | undefined;

async function ensureSchema(): Promise<boolean> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = await getSql();
      if (!sql) return false;
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS application_leads (
            id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name      TEXT        NOT NULL,
            mobile         TEXT        NOT NULL,
            email          TEXT        NOT NULL,
            source         TEXT,
            status         TEXT        NOT NULL DEFAULT 'started',
            created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
          )`;
        await sql`
          CREATE TABLE IF NOT EXISTS applications (
            id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            lead_id                     UUID REFERENCES application_leads(id),
            reference_code              TEXT UNIQUE NOT NULL,
            full_name                   TEXT NOT NULL,
            mobile                      TEXT NOT NULL,
            email                       TEXT NOT NULL,
            course_id                   TEXT NOT NULL,
            medium                      TEXT NOT NULL,
            date_of_birth               DATE,
            fathers_or_husbands_name    TEXT,
            address_line                TEXT,
            city                        TEXT,
            state                       TEXT,
            pin_code                    TEXT,
            baptism_date                DATE,
            denomination_church         TEXT,
            ministry_experience         TEXT,
            academic_qualifications     JSONB   NOT NULL DEFAULT '[]'::jsonb,
            theological_qualifications  JSONB   NOT NULL DEFAULT '[]'::jsonb,
            status                      TEXT    NOT NULL DEFAULT 'submitted',
            admin_notes                 TEXT,
            submitted_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
          )`;
        // Migrations for databases created before lifecycle management existed.
        await sql`
          ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'submitted'`;
        await sql`
          ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_notes TEXT`;
        await sql`
          ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`;
        await sql`
          CREATE TABLE IF NOT EXISTS students (
            id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            application_id   UUID REFERENCES applications(id),
            full_name        TEXT        NOT NULL,
            email            TEXT        NOT NULL,
            mobile           TEXT        NOT NULL,
            course_id        TEXT        NOT NULL,
            medium           TEXT        NOT NULL DEFAULT 'English',
            city             TEXT,
            state            TEXT,
            status           TEXT        NOT NULL DEFAULT 'active',
            public_directory BOOLEAN     NOT NULL DEFAULT false,
            notes            TEXT,
            enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT now()
          )`;
        await sql`
          CREATE INDEX IF NOT EXISTS applications_email_idx ON applications (email)`;
        await sql`
          CREATE INDEX IF NOT EXISTS applications_submitted_at_idx ON applications (submitted_at DESC)`;
        await sql`
          CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status)`;
        await sql`
          CREATE INDEX IF NOT EXISTS students_course_idx ON students (course_id)`;
        await sql`
          CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)`;
        return true;
      } catch (err) {
        console.error("[db] schema bootstrap failed:", err);
        return false;
      }
    })();
  }
  return schemaReady;
}

/* â”€â”€ Reference codes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function makeReferenceCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `ICS-${year}-${rand}${stamp}`;
}

/* â”€â”€ Writes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export interface LeadRecord {
  fullName: string;
  mobile: string;
  email: string;
  source?: string | undefined;
}

export async function insertLead(
  lead: LeadRecord,
): Promise<{ stored: boolean; leadId?: string | undefined }> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) {
    console.warn(
      `[db] lead not persisted (no DB): ${lead.fullName} <${lead.email}> ${lead.mobile}`,
    );
    return { stored: false };
  }
  try {
    const rows = await sql<Array<{ id: string }>>`
      INSERT INTO application_leads (full_name, mobile, email, source)
      VALUES (${lead.fullName}, ${lead.mobile}, ${lead.email}, ${lead.source ?? null})
      RETURNING id`;
    return { stored: true, leadId: rows[0]?.id };
  } catch (err) {
    console.error("[db] insertLead failed:", err);
    return { stored: false };
  }
}

export interface ApplicationRecord extends LeadRecord {
  courseId: string;
  medium: string;
  dateOfBirth?: string | undefined;
  fathersOrHusbandsName?: string | undefined;
  addressLine?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pinCode?: string | undefined;
  baptismDate?: string | undefined;
  denominationChurch?: string | undefined;
  ministryExperience?: string | undefined;
  academicQualifications: Record<string, unknown>[];
  theologicalQualifications: Record<string, unknown>[];
  leadId?: string | undefined;
}

const emptyToNull = (v: string | undefined): string | null => (v && v.length > 0 ? v : null);

/** Looks up the most recent lead for an email so full applications link back. */
export async function findLeadIdByEmail(email: string): Promise<string | undefined> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return undefined;
  try {
    const rows = await sql<Array<{ id: string }>>`
      SELECT id FROM application_leads
       WHERE email = ${email.toLowerCase()}
       ORDER BY created_at DESC
       LIMIT 1`;
    return rows[0]?.id;
  } catch {
    return undefined;
  }
}

export async function insertApplication(
  app: ApplicationRecord,
): Promise<{ stored: boolean; reference: string }> {
  const reference = makeReferenceCode();
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;

  if (!sql) {
    console.warn(
      `[db] application not persisted (no DB): ${app.fullName} <${app.email}> ref=${reference}`,
    );
    return { stored: false, reference };
  }

  try {
    const rows = await sql<Array<{ id: string; reference_code: string }>>`
      INSERT INTO applications (
        lead_id, reference_code, full_name, mobile, email,
        course_id, medium, date_of_birth, fathers_or_husbands_name,
        address_line, city, state, pin_code,
        baptism_date, denomination_church, ministry_experience,
        academic_qualifications, theological_qualifications
      ) VALUES (
        ${app.leadId ?? null}, ${reference}, ${app.fullName}, ${app.mobile}, ${app.email},
        ${app.courseId}, ${app.medium},
        ${emptyToNull(app.dateOfBirth)}::date,
        ${emptyToNull(app.fathersOrHusbandsName)},
        ${emptyToNull(app.addressLine)}, ${emptyToNull(app.city)},
        ${emptyToNull(app.state)}, ${emptyToNull(app.pinCode)},
        ${emptyToNull(app.baptismDate)}::date,
        ${emptyToNull(app.denominationChurch)},
        ${emptyToNull(app.ministryExperience)},
        ${JSON.stringify(app.academicQualifications ?? [])}::jsonb,
        ${JSON.stringify(app.theologicalQualifications ?? [])}::jsonb
      )
      RETURNING id, reference_code`;

    if (app.leadId) {
      await sql`
        UPDATE application_leads
           SET status = 'completed', updated_at = now()
         WHERE id = ${app.leadId}`;
    }
    return { stored: true, reference: rows[0]?.reference_code ?? reference };
  } catch (err) {
    console.error("[db] insertApplication failed:", err);
    return { stored: false, reference };
  }
}

/* â”€â”€ Admin: applications & students â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export async function listApplications(): Promise<AdminApplicationRow[]> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return [];
  try {
    const rows = await sql<
      Array<{
        id: string;
        reference_code: string;
        full_name: string;
        email: string;
        mobile: string;
        course_id: string;
        medium: string;
        city: string | null;
        status: ApplicationStatus;
        admin_notes: string | null;
        submitted_at: Date;
      }>
    >`
      SELECT id, reference_code, full_name, email, mobile, course_id, medium,
             city, status, admin_notes, submitted_at
        FROM applications
       ORDER BY submitted_at DESC
       LIMIT 500`;
    return rows.map((r) => ({
      id: r.id,
      referenceCode: r.reference_code,
      fullName: r.full_name,
      email: r.email,
      mobile: r.mobile,
      courseId: r.course_id,
      medium: r.medium,
      city: r.city,
      status: r.status,
      adminNotes: r.admin_notes,
      submittedAt: new Date(r.submitted_at).toISOString(),
    }));
  } catch (err) {
    console.error("[db] listApplications failed:", err);
    return [];
  }
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus | undefined; adminNotes?: string | null | undefined },
): Promise<boolean> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return false;
  try {
    if (patch.status !== undefined && patch.adminNotes !== undefined) {
      await sql`UPDATE applications SET status = ${patch.status},
        admin_notes = ${patch.adminNotes}, updated_at = now() WHERE id = ${id}`;
    } else if (patch.status !== undefined) {
      await sql`UPDATE applications SET status = ${patch.status},
        updated_at = now() WHERE id = ${id}`;
    } else if (patch.adminNotes !== undefined) {
      await sql`UPDATE applications SET admin_notes = ${patch.adminNotes},
        updated_at = now() WHERE id = ${id}`;
    } else {
      return true;
    }
    return true;
  } catch (err) {
    console.error("[db] updateApplication failed:", err);
    return false;
  }
}

export async function listStudents(): Promise<AdminStudentRow[]> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return [];
  try {
    const rows = await sql<
      Array<{
        id: string;
        full_name: string;
        email: string;
        mobile: string;
        course_id: string;
        medium: string;
        city: string | null;
        status: StudentStatus;
        public_directory: boolean;
        notes: string | null;
        enrolled_at: Date;
      }>
    >`
      SELECT id, full_name, email, mobile, course_id, medium, city, status,
             public_directory, notes, enrolled_at
        FROM students
       ORDER BY enrolled_at DESC
       LIMIT 1000`;
    return rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      mobile: r.mobile,
      courseId: r.course_id,
      medium: r.medium,
      city: r.city,
      status: r.status,
      publicDirectory: r.public_directory,
      notes: r.notes,
      enrolledAt: new Date(r.enrolled_at).toISOString(),
    }));
  } catch (err) {
    console.error("[db] listStudents failed:", err);
    return [];
  }
}

export async function listPublicStudents(): Promise<PublicStudentRow[]> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return [];
  try {
    const rows = await sql<
      Array<{
        full_name: string;
        course_id: string;
        city: string | null;
        status: StudentStatus;
        enrolled_at: Date;
      }>
    >`
      SELECT full_name, course_id, city, status, enrolled_at
        FROM students
       WHERE public_directory = true AND status IN ('active', 'alumni')
       ORDER BY course_id, enrolled_at DESC
       LIMIT 500`;
    return rows.map((r) => ({
      fullName: r.full_name,
      courseId: r.course_id,
      city: r.city,
      status: r.status,
      enrolledAt: new Date(r.enrolled_at).toISOString(),
    }));
  } catch (err) {
    console.error("[db] listPublicStudents failed:", err);
    return [];
  }
}

function toNull(v: string | undefined | null): string | null {
  return v && String(v).trim().length > 0 ? String(v).trim() : null;
}

/** Creates a student from an accepted application (idempotent per application). */
export async function admitStudent(
  applicationId: string,
  publicDirectory: boolean,
): Promise<{
  ok: boolean;
  alreadyEnrolled?: boolean | undefined;
  studentId?: string | undefined;
}> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return { ok: false };
  try {
    const existing = await sql<Array<{ id: string }>>`
      SELECT id FROM students WHERE application_id = ${applicationId} LIMIT 1`;
    if (existing[0]) return { ok: true, alreadyEnrolled: true, studentId: existing[0].id };

    const apps = await sql<
      Array<{
        id: string;
        full_name: string;
        email: string;
        mobile: string;
        course_id: string;
        medium: string;
        city: string | null;
        state: string | null;
      }>
    >`SELECT id, full_name, email, mobile, course_id, medium, city, state
        FROM applications WHERE id = ${applicationId} LIMIT 1`;
    const app = apps[0];
    if (!app) return { ok: false };

    const inserted = await sql<Array<{ id: string }>>`
      INSERT INTO students (application_id, full_name, email, mobile, course_id, medium, city, state, status, public_directory)
      VALUES (${app.id}, ${app.full_name}, ${app.email}, ${app.mobile}, ${app.course_id}, ${app.medium}, ${app.city}, ${app.state}, 'active', ${publicDirectory})
      RETURNING id`;
    await sql`UPDATE applications SET status = 'enrolled', updated_at = now() WHERE id = ${app.id}`;
    return { ok: true, studentId: inserted[0]?.id };
  } catch (err) {
    console.error("[db] admitStudent failed:", err);
    return { ok: false };
  }
}

export async function createStudent(input: {
  fullName: string;
  email: string;
  mobile: string;
  courseId: string;
  medium: string;
  city?: string | null;
  state?: string | null;
  publicDirectory: boolean;
  notes?: string | null;
}): Promise<{ ok: boolean; studentId?: string | undefined }> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return { ok: false };
  try {
    const rows = await sql<Array<{ id: string }>>`
      INSERT INTO students (full_name, email, mobile, course_id, medium, city, state, status, public_directory, notes)
      VALUES (${input.fullName}, ${input.email}, ${input.mobile}, ${input.courseId}, ${input.medium},
              ${toNull(input.city)}, ${toNull(input.state)}, 'active', ${input.publicDirectory}, ${toNull(input.notes)})
      RETURNING id`;
    return { ok: true, studentId: rows[0]?.id };
  } catch (err) {
    console.error("[db] createStudent failed:", err);
    return { ok: false };
  }
}

export async function updateStudent(
  id: string,
  patch: {
    status?: StudentStatus | undefined;
    publicDirectory?: boolean | undefined;
    notes?: string | null | undefined;
  },
): Promise<boolean> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return false;
  try {
    const { status, publicDirectory, notes } = patch;
    if (status !== undefined && publicDirectory !== undefined && notes !== undefined) {
      await sql`UPDATE students SET status=${status}, public_directory=${publicDirectory},
        notes=${toNull(notes)} WHERE id=${id}`;
    } else if (status !== undefined && publicDirectory !== undefined) {
      await sql`UPDATE students SET status=${status}, public_directory=${publicDirectory} WHERE id=${id}`;
    } else if (status !== undefined && notes !== undefined) {
      await sql`UPDATE students SET status=${status}, notes=${toNull(notes)} WHERE id=${id}`;
    } else if (publicDirectory !== undefined && notes !== undefined) {
      await sql`UPDATE students SET public_directory=${publicDirectory}, notes=${toNull(notes)} WHERE id=${id}`;
    } else if (status !== undefined) {
      await sql`UPDATE students SET status=${status} WHERE id=${id}`;
    } else if (publicDirectory !== undefined) {
      await sql`UPDATE students SET public_directory=${publicDirectory} WHERE id=${id}`;
    } else if (notes !== undefined) {
      await sql`UPDATE students SET notes=${toNull(notes)} WHERE id=${id}`;
    }
    return true;
  } catch (err) {
    console.error("[db] updateStudent failed:", err);
    return false;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return false;
  try {
    await sql`DELETE FROM students WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error("[db] deleteStudent failed:", err);
    return false;
  }
}

export async function adminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    totalApplications: 0,
    pendingReview: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalLeads: 0,
  };
  const ok = await ensureSchema();
  const sql = ok ? await getSql() : null;
  if (!sql) return empty;
  try {
    const rows = await sql<
      Array<{
        total_applications: number;
        pending_review: number;
        total_students: number;
        active_students: number;
        total_leads: number;
      }>
    >`
      SELECT
        (SELECT count(*) FROM applications) AS total_applications,
        (SELECT count(*) FROM applications WHERE status IN ('submitted','under_review')) AS pending_review,
        (SELECT count(*) FROM students) AS total_students,
        (SELECT count(*) FROM students WHERE status = 'active') AS active_students,
        (SELECT count(*) FROM application_leads) AS total_leads`;
    const r = rows[0];
    return {
      totalApplications: Number(r?.total_applications ?? 0),
      pendingReview: Number(r?.pending_review ?? 0),
      totalStudents: Number(r?.total_students ?? 0),
      activeStudents: Number(r?.active_students ?? 0),
      totalLeads: Number(r?.total_leads ?? 0),
    };
  } catch (err) {
    console.error("[db] adminStats failed:", err);
    return empty;
  }
}

-- ICSR admissions schema (mirrors the bootstrap in src/server/db.ts).
-- The server creates/migrates these tables automatically on first use; this
-- file exists for DBAs who prefer to provision ahead of deployment.

CREATE TABLE IF NOT EXISTS application_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT        NOT NULL,
  mobile      TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  source      TEXT,
  status      TEXT        NOT NULL DEFAULT 'started', -- started | completed
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id                    UUID REFERENCES application_leads(id),
  reference_code             TEXT UNIQUE NOT NULL,       -- e.g. ICS-2026-A1B2C3D4
  full_name                  TEXT NOT NULL,
  mobile                     TEXT NOT NULL,
  email                      TEXT NOT NULL,
  course_id                  TEXT NOT NULL,              -- cth | dipth | bth | mdiv | mth | phd
  medium                     TEXT NOT NULL,              -- English | Telugu
  date_of_birth              DATE,
  fathers_or_husbands_name   TEXT,
  address_line               TEXT,
  city                       TEXT,
  state                      TEXT,
  pin_code                   TEXT,
  baptism_date               DATE,
  denomination_church        TEXT,
  ministry_experience        TEXT,
  academic_qualifications    JSONB   NOT NULL DEFAULT '[]'::jsonb,
  theological_qualifications JSONB   NOT NULL DEFAULT '[]'::jsonb,
  -- Lifecycle: submitted → under_review → accepted → rejected → enrolled
  status                     TEXT    NOT NULL DEFAULT 'submitted',
  admin_notes                TEXT,
  submitted_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrolled students. Rows may originate from an accepted application
-- (application_id set) or manual office entry (application_id NULL).
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
  -- active | alumni | withdrawn
  status           TEXT        NOT NULL DEFAULT 'active',
  -- Consent flag: only true rows appear on the public /students page.
  public_directory BOOLEAN     NOT NULL DEFAULT false,
  notes            TEXT,
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS applications_email_idx         ON applications (email);
CREATE INDEX IF NOT EXISTS applications_submitted_at_idx  ON applications (submitted_at DESC);
CREATE INDEX IF NOT EXISTS applications_status_idx        ON applications (status);
CREATE INDEX IF NOT EXISTS students_course_idx            ON students (course_id);
CREATE INDEX IF NOT EXISTS students_status_idx            ON students (status);

-- Migrations for databases provisioned before lifecycle management existed.
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status      TEXT NOT NULL DEFAULT 'submitted';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT now();

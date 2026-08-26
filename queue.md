# Task Queue â€” ICS Website Completion

Autonomous execution queue. Tasks are completed top-to-bottom; each task is
verified (typecheck + lint + build + runtime test) before the next begins.
If a task fails, fix and re-verify before moving on.

## Queue

- [x] **T1 â€” Complete the database schema.** Add `students` table, application
      lifecycle (`status`: submitted â†’ under_review â†’ accepted â†’ rejected â†’
      enrolled), `admin_notes`, `updated_at` on applications, consent flag for the
      public directory, and supporting indexes. Keep `ensureSchema()` idempotent so
      existing Neon databases migrate safely on boot. Mirror everything in
      `db/schema.sql`.

- [x] **T2 â€” Admin authentication + API.** Passcode-based admin auth
      (`ADMIN_PASSCODE` env) issuing a signed HttpOnly cookie. Endpoints:
      `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/data`
      (stats + applications + students), `PATCH /api/admin/application`
      (status/notes), `POST /api/admin/admit` (application â†’ student),
      `PATCH /api/admin/student`, `POST /api/admin/student` (manual enrolment),
      `POST /api/admin/student/delete`. All admin routes verify the session and
      return 503 with guidance when `ADMIN_PASSCODE` is unset.

- [x] **T3 â€” Admin dashboard UI (`/admin`).** Premium, on-brand dashboard:
      login card, stat cards, Applications table (reference, applicant, course,
      date, inline status control, notes, Admit action for accepted applications),
      Students table (name, course, contact, status, public-directory toggle,
      remove). Fully responsive, Lucide icons only, sonner feedback.

- [x] **T4 â€” Public students directory (`/students`).** Separate website
      section listing enrolled students (only those with directory consent) in a
      premium table grouped by programme, with counts and empty state. Navbar +
      footer links.

- [x] **T5 â€” Seed demo data.** Remove local test rows from Neon, insert a
      realistic demo cohort (students across C.Th.â€“Ph.D. with directory consent)
      so the new sections render meaningfully, and set the sample application to
      `under_review`.

- [x] **T6 â€” Config & docs.** `.env` / `.env.example` gain `ADMIN_PASSCODE`;
      README documents the admin dashboard, students directory, and Render env
      vars.

- [x] **T7 â€” Full verification.** `tsc --noEmit` clean, `eslint` clean,
      production build passes (Cloudflare + Node presets), runtime smoke tests of
      every new endpoint (auth reject/accept, status update, admit, directory
      toggle, public page render).

- [x] **T8 â€” Commit & push to `main`.** Linear commit (no history rewriting â€”
      Lovable syncs from this branch). Render auto-deploys; Neon persists.

## Notes

- Retry rule: on network/API timeouts, wait 15s and resubmit automatically.
- Nalu folder remains off-limits (AGENTS.md).
- Design tokens only from `src/styles.css`; `cn()` for class merging.

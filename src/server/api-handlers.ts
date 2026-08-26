/**
 * Plain REST endpoints for the admissions flow, served from the server entry
 * (src/server.ts) before the TanStack handler runs.
 *
 * Chosen over createServerFn deliberately: the RPC compiler pass produced a
 * circular-chunk crash under the node-server preset with the current
 * @tanstack/react-start / nitro beta combination. Plain JSON endpoints are
 * framework-version-proof and behave identically on Node and Cloudflare.
 *
 * Routes:
 *   POST /api/lead         — stage 1 basic details
 *   POST /api/application  — stage 2 full application
 */

import { ZodError } from "zod";
import {
  applicationSchema,
  leadSchema,
  normalizeMobile,
  type ApplicationResult,
  type LeadResult,
} from "../lib/validation";

const MAX_BODY_BYTES = 128 * 1024;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** Returns a Response for intercepted API paths, or undefined to pass through. */
export async function handleApiRequest(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return undefined;

  const GET_ROUTES = new Set(["/api/public/students", "/api/admin/data"]);
  const isGet = request.method === "GET";
  const isPost = request.method === "POST";
  const isPatch = request.method === "PATCH";
  const routeAllowed =
    (isGet && GET_ROUTES.has(url.pathname)) ||
    (isPost && !GET_ROUTES.has(url.pathname)) ||
    (isPatch && url.pathname === "/api/admin/application");
  if (!routeAllowed) {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  // Same-origin guard (browser always sends Origin on cross-origin POSTs;
  // absence here means same-origin fetch or non-browser client).
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return jsonResponse({ ok: false, message: "Forbidden." }, 403);
      }
    } catch {
      return jsonResponse({ ok: false, message: "Forbidden." }, 403);
    }
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: "Payload too large." }, 413);
  }

  /** Routes that require a JSON body. */
  const BODY_ROUTES = new Set([
    "/api/lead",
    "/api/application",
    "/api/admin/login",
    "/api/admin/application",
    "/api/admin/admit",
    "/api/admin/student",
    "/api/admin/student/update",
    "/api/admin/student/delete",
  ]);
  let raw: unknown;
  if (BODY_ROUTES.has(url.pathname)) {
    try {
      raw = await request.json();
    } catch {
      return jsonResponse({ ok: false, message: "Invalid JSON body." }, 400);
    }
  }

  try {
    switch (url.pathname) {
      case "/api/lead":
        return await handleLead(raw);
      case "/api/application":
        return await handleApplication(raw);
      case "/api/public/students":
        return await handlePublicStudents();
      case "/api/admin/login":
        return await handleAdminLogin(request, raw);
      case "/api/admin/logout":
        return await handleAdminLogout();
      case "/api/admin/data":
        return await handleAdminData(request);
      case "/api/admin/application":
        return await handleAdminApplicationUpdate(raw);
      case "/api/admin/admit":
        return await handleAdminAdmit(raw);
      case "/api/admin/student":
        return await handleAdminStudentCreate(raw);
      case "/api/admin/student/update":
        return await handleAdminStudentUpdate(raw);
      case "/api/admin/student/delete":
        return await handleAdminStudentDelete(raw);
      default:
        return jsonResponse({ ok: false, message: "Not found." }, 404);
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      return jsonResponse(
        { ok: false, stored: false, message: first?.message ?? "Please check your details." },
        400,
      );
    }
    console.error("[api] unhandled error:", err);
    return jsonResponse({ ok: false, message: "Unexpected server error. Please try again." }, 500);
  }
}

async function readLead(raw: unknown) {
  const parsed = leadSchema.parse(raw);
  return {
    fullName: parsed.fullName,
    mobile: normalizeMobile(parsed.mobile),
    email: parsed.email,
    source: parsed.source,
  };
}

async function handleLead(raw: unknown): Promise<Response> {
  const lead = await readLead(raw);
  const { insertLead } = await import("./db");
  const result = await insertLead(lead);
  const body: LeadResult = {
    ok: true,
    stored: result.stored,
    leadId: result.leadId,
    message: result.stored ? undefined : "Saved locally — we will confirm by phone/email.",
  };
  return jsonResponse(body);
}

async function handleApplication(raw: unknown): Promise<Response> {
  const parsed = applicationSchema.parse(raw);
  const { insertApplication, findLeadIdByEmail, isDatabaseConfigured } = await import("./db");

  if (!isDatabaseConfigured()) {
    console.error(
      "[api] DATABASE_URL missing — application payload for recovery:",
      JSON.stringify(parsed),
    );
  }

  let leadId = parsed.leadId;
  if (!leadId && isDatabaseConfigured()) {
    leadId = await findLeadIdByEmail(parsed.email);
  }

  const result = await insertApplication({
    fullName: parsed.fullName,
    mobile: parsed.mobile,
    email: parsed.email,
    courseId: parsed.courseId,
    medium: parsed.medium,
    dateOfBirth: parsed.dateOfBirth,
    fathersOrHusbandsName: parsed.fathersOrHusbandsName,
    addressLine: parsed.addressLine,
    city: parsed.city,
    state: parsed.state,
    pinCode: parsed.pinCode,
    baptismDate: parsed.baptismDate,
    denominationChurch: parsed.denominationChurch,
    ministryExperience: parsed.ministryExperience,
    academicQualifications: parsed.academicQualifications,
    theologicalQualifications: parsed.theologicalQualifications,
    leadId,
  });

  const body: ApplicationResult = {
    ok: true,
    stored: result.stored,
    reference: result.reference,
    message: result.stored ? undefined : "Saved locally — we will confirm by phone/email.",
  };
  return jsonResponse(body);
}

async function handlePublicStudents(): Promise<Response> {
  const { listPublicStudents } = await import("./db");
  const students = await listPublicStudents();
  return jsonResponse({ ok: true, students });
}

/* ── Admin API ───────────────────────────────────────────────────────── */

const ADMIN_COOKIE = "ics_admin";
const ADMIN_SESSION_HOURS = 12;

function getAdminPasscode(): string | undefined {
  return typeof process !== "undefined" ? process.env?.["ADMIN_PASSCODE"] : undefined;
}

/** Signed session token: HMAC-style sha256(passcode + scope + expiry). */
async function makeAdminToken(expiresAt: number): Promise<string> {
  const passcode = getAdminPasscode() ?? "";
  const data = new TextEncoder().encode(`ics-admin:${passcode}:${expiresAt}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return `${expiresAt}.${Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = await makeAdminToken(expiresAt);
  // Constant-time-ish comparison (lengths equal by construction).
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

function readAdminCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === ADMIN_COOKIE) return part.slice(eq + 1).trim();
  }
  return undefined;
}

function adminForbidden(): Response {
  return jsonResponse({ ok: false, message: "Admin session expired. Please sign in again." }, 401);
}

function adminNotConfigured(): Response {
  return jsonResponse(
    {
      ok: false,
      message:
        "Admin access is not configured. Set the ADMIN_PASSCODE environment variable on the server.",
    },
    503,
  );
}

// Naive in-memory brute-force throttle (per IP, 10 attempts / 10 min).
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function loginThrottled(ip: string): boolean {
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= 10;
}

function recordLoginAttempt(ip: string): void {
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) {
    loginAttempts.set(ip, { count: 1, resetAt: Date.now() + 10 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

async function handleAdminLogin(request: Request, raw: unknown): Promise<Response> {
  const passcode = getAdminPasscode();
  if (!passcode) return adminNotConfigured();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (loginThrottled(ip)) {
    return jsonResponse(
      { ok: false, message: "Too many attempts. Try again in a few minutes." },
      429,
    );
  }
  recordLoginAttempt(ip);

  const body = raw as { passcode?: unknown };
  if (typeof body?.passcode !== "string" || body.passcode !== passcode) {
    return jsonResponse({ ok: false, message: "Incorrect passcode." }, 401);
  }

  const expiresAt = Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  const token = await makeAdminToken(expiresAt);
  const secure = new URL(request.url).protocol === "https:" ? " Secure;" : "";
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${ADMIN_SESSION_HOURS * 3600}`,
    },
  });
}

async function handleAdminLogout(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}

async function handleAdminData(request: Request): Promise<Response> {
  if (!(await isValidAdminToken(readAdminCookie(request)))) return adminForbidden();
  const { adminStats, listApplications, listStudents } = await import("./db");
  const [stats, applications, students] = await Promise.all([
    adminStats(),
    listApplications(),
    listStudents(),
  ]);
  return jsonResponse({ ok: true, stats, applications, students });
}

const APPLICATION_STATUS_SET = new Set([
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "enrolled",
]);
const STUDENT_STATUS_SET = new Set(["active", "alumni", "withdrawn"]);

async function handleAdminApplicationUpdate(raw: unknown): Promise<Response> {
  const body = raw as { id?: unknown; status?: unknown; adminNotes?: unknown };
  if (typeof body?.id !== "string") {
    return jsonResponse({ ok: false, message: "Application id is required." }, 400);
  }
  const patch: { status?: import("./db").ApplicationStatus; adminNotes?: string | null } = {};
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !APPLICATION_STATUS_SET.has(body.status)) {
      return jsonResponse({ ok: false, message: "Invalid status." }, 400);
    }
    patch.status = body.status as import("./db").ApplicationStatus;
  }
  if (body.adminNotes !== undefined) {
    patch.adminNotes = typeof body.adminNotes === "string" ? body.adminNotes.slice(0, 2000) : null;
  }
  const { updateApplication } = await import("./db");
  const ok = await updateApplication(body.id, patch);
  return jsonResponse({ ok });
}

async function handleAdminAdmit(raw: unknown): Promise<Response> {
  const body = raw as { applicationId?: unknown; publicDirectory?: unknown };
  if (typeof body?.applicationId !== "string") {
    return jsonResponse({ ok: false, message: "Application id is required." }, 400);
  }
  const { admitStudent } = await import("./db");
  const result = await admitStudent(body.applicationId, body.publicDirectory === true);
  if (!result.ok) return jsonResponse({ ok: false, message: "Could not enrol student." }, 500);
  return jsonResponse({ ok: true, alreadyEnrolled: result.alreadyEnrolled === true });
}

async function handleAdminStudentCreate(raw: unknown): Promise<Response> {
  const b = raw as Record<string, unknown>;
  const fullName = typeof b?.["fullName"] === "string" ? b["fullName"].trim() : "";
  const email = typeof b?.["email"] === "string" ? b["email"].trim().toLowerCase() : "";
  const mobile = typeof b?.["mobile"] === "string" ? b["mobile"].replace(/\D/g, "") : "";
  const courseId = typeof b?.["courseId"] === "string" ? b["courseId"] : "";
  if (fullName.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || mobile.length !== 10) {
    return jsonResponse(
      { ok: false, message: "Name, valid email and 10-digit mobile are required." },
      400,
    );
  }
  const validCourses = new Set(["cth", "dipth", "bth", "mdiv", "mth", "phd"]);
  if (!validCourses.has(courseId)) {
    return jsonResponse({ ok: false, message: "Select a valid course." }, 400);
  }
  const { createStudent } = await import("./db");
  const result = await createStudent({
    fullName: fullName.slice(0, 120),
    email: email.slice(0, 160),
    mobile,
    courseId,
    medium: b?.["medium"] === "Telugu" ? "Telugu" : "English",
    city: typeof b?.["city"] === "string" ? b["city"].slice(0, 80) : null,
    state: typeof b?.["state"] === "string" ? b["state"].slice(0, 80) : null,
    publicDirectory: b?.["publicDirectory"] === true,
    notes: typeof b?.["notes"] === "string" ? b["notes"].slice(0, 1000) : null,
  });
  if (!result.ok) return jsonResponse({ ok: false, message: "Could not add student." }, 500);
  return jsonResponse({ ok: true, studentId: result.studentId });
}

async function handleAdminStudentUpdate(raw: unknown): Promise<Response> {
  const b = raw as Record<string, unknown>;
  if (typeof b?.["id"] !== "string") {
    return jsonResponse({ ok: false, message: "Student id is required." }, 400);
  }
  const patch: {
    status?: import("./db").StudentStatus;
    publicDirectory?: boolean;
    notes?: string | null;
  } = {};
  if (b["status"] !== undefined) {
    if (typeof b["status"] !== "string" || !STUDENT_STATUS_SET.has(b["status"])) {
      return jsonResponse({ ok: false, message: "Invalid status." }, 400);
    }
    patch.status = b["status"] as import("./db").StudentStatus;
  }
  if (b["publicDirectory"] !== undefined) patch.publicDirectory = b["publicDirectory"] === true;
  if (b["notes"] !== undefined) {
    patch.notes = typeof b["notes"] === "string" ? b["notes"].slice(0, 1000) : null;
  }
  const { updateStudent } = await import("./db");
  const ok = await updateStudent(b["id"], patch);
  return jsonResponse({ ok });
}

async function handleAdminStudentDelete(raw: unknown): Promise<Response> {
  const b = raw as { id?: unknown };
  if (typeof b?.["id"] !== "string") {
    return jsonResponse({ ok: false, message: "Student id is required." }, 400);
  }
  const { deleteStudent } = await import("./db");
  const ok = await deleteStudent(b["id"]);
  return jsonResponse({ ok });
}

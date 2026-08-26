import type {
  AdminApplicationRow,
  AdminStats,
  AdminStudentRow,
  ApplicationStatus,
  StudentStatus,
} from "@/server/db";

/**
 * Browser client for the admin API (src/server/api-handlers.ts).
 * Session lives in an HttpOnly cookie — no tokens in JS.
 */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (res.status === 401) {
    const err = new Error("unauthorized") as Error & { unauthorized?: boolean };
    err.unauthorized = true;
    throw err;
  }
  if (!res.ok) {
    const message = (body as { message?: string })?.message ?? `Request failed (${res.status}).`;
    throw new Error(message);
  }
  return body as T;
}

export interface AdminData {
  ok: true;
  stats: AdminStats;
  applications: AdminApplicationRow[];
  students: AdminStudentRow[];
}

export const adminApi = {
  login: (passcode: string) =>
    request<{ ok: true }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ passcode }),
    }),
  logout: () => request<{ ok: true }>("/api/admin/logout", { method: "POST" }),
  data: () => request<AdminData>("/api/admin/data"),
  updateApplication: (
    id: string,
    patch: { status?: ApplicationStatus; adminNotes?: string | null },
  ) =>
    request<{ ok: boolean }>("/api/admin/application", {
      method: "PATCH",
      body: JSON.stringify({ id, ...patch }),
    }),
  admit: (applicationId: string, publicDirectory: boolean) =>
    request<{ ok: boolean; alreadyEnrolled: boolean }>("/api/admin/admit", {
      method: "POST",
      body: JSON.stringify({ applicationId, publicDirectory }),
    }),
  createStudent: (input: {
    fullName: string;
    email: string;
    mobile: string;
    courseId: string;
    medium?: string;
    city?: string;
    state?: string;
    publicDirectory?: boolean;
    notes?: string;
  }) =>
    request<{ ok: boolean }>("/api/admin/student", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateStudent: (
    id: string,
    patch: { status?: StudentStatus; publicDirectory?: boolean; notes?: string | null },
  ) =>
    request<{ ok: boolean }>("/api/admin/student/update", {
      method: "PATCH",
      body: JSON.stringify({ id, ...patch }),
    }),
  deleteStudent: (id: string) =>
    request<{ ok: boolean }>("/api/admin/student/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};

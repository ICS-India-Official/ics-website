import type { ApplicationInput, ApplicationResult, LeadInput, LeadResult } from "./validation";

/**
 * Browser-side clients for the admissions REST API.
 *
 * The endpoints are plain JSON POSTs served by src/server/api-handlers.ts —
 * deliberately not TanStack server functions, whose RPC compiler pass caused
 * circular-chunk failures under the node-server preset. Plain fetch works
 * identically across Node and Cloudflare deployments.
 */

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      stored: false,
      message: "Network error — please check your connection and try again.",
    } as T;
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) message = body.message;
    } catch {
      /* non-JSON error body */
    }
    return { ok: false, stored: false, message } as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {
      ok: false,
      stored: false,
      message: "Unexpected server response. Please call the office to confirm.",
    } as T;
  }
}

/** Stage 1 — basic details (home card / apply gate). */
export function submitLead(data: LeadInput): Promise<LeadResult> {
  return postJson<LeadResult>("/api/lead", data);
}

/** Stage 2 — the full application (/apply wizard). */
export function submitApplication(data: ApplicationInput): Promise<ApplicationResult> {
  return postJson<ApplicationResult>("/api/application", data);
}

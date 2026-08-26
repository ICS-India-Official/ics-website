import { z } from "zod";
import { COURSES } from "./application-data";

/* ── Normalisers ─────────────────────────────────────────────────────── */

/** Accepts 9876543210, +91 98765 43210, 098765..., etc. → bare 10-digit MSISDN. */
export function normalizeMobile(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function isValidIndianMobile(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeMobile(raw));
}

export function formatMobileDisplay(raw: string): string {
  const d = normalizeMobile(raw);
  if (d.length !== 10) return raw;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

/* ── Field schemas ───────────────────────────────────────────────────── */

const nameField = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(120, "Name is too long")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, "Letters, spaces and hyphens only");

const mobileField = z
  .string()
  .trim()
  .refine(isValidIndianMobile, "Enter a valid 10-digit Indian mobile number");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email is required")
  .max(160)
  .email("Enter a valid email address");

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use the date picker");

const pinField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/\D/g, "") : undefined))
  .refine((v) => v === undefined || /^\d{6}$/.test(v), "PIN must be 6 digits");

/* ── Step 1 — lead captured on the home page ─────────────────────────── */

export const leadSchema = z.object({
  fullName: nameField,
  mobile: mobileField,
  email: emailField,
  source: z.string().trim().max(40).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/* ── Qualification rows (dynamic lists on the Education step) ────────── */

export interface QualificationRow {
  course: string;
  board: string;
  institution: string;
  year: string;
  grade: string;
}

export const qualificationRowSchema = z.object({
  course: z.string().trim().max(120).default(""),
  board: z.string().trim().max(160).default(""),
  institution: z.string().trim().max(160).default(""),
  year: z
    .string()
    .trim()
    .max(4)
    .refine((v) => v === "" || /^(19|20)\d{2}$/.test(v), "Enter a 4-digit year")
    .default(""),
  grade: z.string().trim().max(40).default(""),
});

/* ── Full application (the /apply wizard payload) ────────────────────── */

const courseIdEnum = z.enum(["cth", "dipth", "bth", "mdiv", "mth", "phd"]);
export const MEDIUM_VALUES = ["English", "Telugu"] as const;

/** Basics may arrive from the home step; /apply also works standalone. */
export const applicationSchema = leadSchema.extend({
  /** Lead row created by the home-page step, when present. */
  leadId: z
    .string()
    .trim()
    .uuid()
    .optional()
    .transform((v) => (v ? v : undefined)),
  source: z.string().trim().max(40).optional(),
  courseId: courseIdEnum,
  medium: z.enum(MEDIUM_VALUES),
  dateOfBirth: optionalDate,
  fathersOrHusbandsName: optionalText(120),
  addressLine: z
    .string()
    .trim()
    .min(1, "Address is required — study notes are dispatched by post")
    .max(400),
  city: optionalText(80),
  state: optionalText(80),
  pinCode: pinField,
  baptismDate: optionalDate,
  denominationChurch: optionalText(160),
  ministryExperience: optionalText(600),
  academicQualifications: z.array(qualificationRowSchema).max(8).default([]),
  theologicalQualifications: z.array(qualificationRowSchema).max(8).default([]),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const courseIdValues = COURSES.map((c) => c.id) as [string, ...string[]];

/* ── Per-step validation gates for the wizard ────────────────────────── */

export function validateBasics(d: Pick<ApplicationInput, "fullName" | "mobile" | "email">) {
  return leadSchema.safeParse({ ...d, source: "apply-page" });
}

export function validateProgramme(d: Pick<ApplicationInput, "courseId" | "medium">) {
  return z.object({ courseId: courseIdEnum, medium: z.enum(MEDIUM_VALUES) }).safeParse(d);
}

export function validatePersonal(
  d: Pick<
    ApplicationInput,
    "dateOfBirth" | "fathersOrHusbandsName" | "addressLine" | "city" | "state" | "pinCode"
  >,
) {
  return z
    .object({
      dateOfBirth: optionalDate,
      fathersOrHusbandsName: optionalText(120),
      addressLine: applicationSchema.shape.addressLine,
      city: optionalText(80),
      state: optionalText(80),
      pinCode: pinField,
    })
    .safeParse(d);
}

/* ── Server → client result envelopes ────────────────────────────────── */

export interface LeadResult {
  ok: boolean;
  stored: boolean;
  leadId?: string | undefined;
  message?: string | undefined;
}

export interface ApplicationResult {
  ok: boolean;
  stored: boolean;
  reference?: string | undefined;
  message?: string | undefined;
}

import { useCallback, useEffect, useState } from "react";
import type { CourseId, Medium } from "@/lib/application-data";
import type { QualificationRow } from "@/lib/validation";
import { normalizeMobile, isValidIndianMobile } from "@/lib/validation";

/**
 * Client-side draft store for the two-stage application journey.
 * Persisted to localStorage after every change so a refresh, a closed tab,
 * or a device switch back to the same browser never loses progress.
 */

const STORAGE_KEY = "ics-application-draft-v1";

export interface ApplicationDraft {
  leadId?: string;
  fullName: string;
  mobile: string;
  email: string;
  courseId: CourseId | "";
  medium: Medium | "";
  dateOfBirth: string;
  fathersOrHusbandsName: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  baptismDate: string;
  denominationChurch: string;
  ministryExperience: string;
  academicQualifications: QualificationRow[];
  theologicalQualifications: QualificationRow[];
}

export function emptyDraft(): ApplicationDraft {
  return {
    fullName: "",
    mobile: "",
    email: "",
    courseId: "",
    medium: "English",
    dateOfBirth: "",
    fathersOrHusbandsName: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    baptismDate: "",
    denominationChurch: "",
    ministryExperience: "",
    academicQualifications: [],
    theologicalQualifications: [],
  };
}

export function loadDraft(): ApplicationDraft {
  const base = emptyDraft();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<ApplicationDraft>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

export function saveDraft(draft: ApplicationDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable (private mode) — flow continues in memory */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function basicsComplete(
  d: Pick<ApplicationDraft, "fullName" | "mobile" | "email">,
): boolean {
  return (
    d.fullName.trim().length >= 2 && isValidIndianMobile(d.mobile) && /.+@.+\..+/.test(d.email)
  );
}

/** React hook exposing the draft plus granular updaters. */
export function useApplicationDraft() {
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  const update = useCallback(
    <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => {
      setDraft((d) => ({ ...d, [key]: value }));
    },
    [],
  );

  const updateBasics = useCallback(
    (patch: Partial<Pick<ApplicationDraft, "fullName" | "mobile" | "email" | "leadId">>) => {
      setDraft((d) => ({ ...d, ...patch }));
    },
    [],
  );

  const reset = useCallback(() => {
    clearDraft();
    setDraft(emptyDraft());
  }, []);

  return { draft, setDraft, update, updateBasics, reset, hydrated };
}

export { normalizeMobile };

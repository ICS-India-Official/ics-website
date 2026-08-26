/** Shared admin domain types (safe for client and server imports). */

export const APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "enrolled",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STUDENT_STATUSES = ["active", "alumni", "withdrawn"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export interface AdminStats {
  totalApplications: number;
  pendingReview: number;
  totalStudents: number;
  activeStudents: number;
  totalLeads: number;
}

export interface AdminApplicationRow {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  mobile: string;
  courseId: string;
  medium: string;
  city: string | null;
  status: ApplicationStatus;
  adminNotes: string | null;
  submittedAt: string;
}

export interface AdminStudentRow {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  courseId: string;
  medium: string;
  city: string | null;
  status: StudentStatus;
  publicDirectory: boolean;
  notes: string | null;
  enrolledAt: string;
}

export interface PublicStudentRow {
  fullName: string;
  courseId: string;
  city: string | null;
  status: StudentStatus;
  enrolledAt: string;
}

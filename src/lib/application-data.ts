/**
 * Official course catalogue, transcribed from the ICSR application form (NATA-accredited).
 * Fees, eligibility and durations are the authoritative figures printed on the
 * official APPLICATION FORM document.
 */

export type CourseId = "cth" | "dipth" | "bth" | "mdiv" | "mth" | "phd";
export type Medium = "English" | "Telugu";

export interface CourseInfo {
  id: CourseId;
  abbr: string;
  title: string;
  credits: number;
  duration: string;
  fee: string;
  feeNote: string;
  eligibility: string;
  notesPages: string;
  highlights: string[];
}

export const COURSES: CourseInfo[] = [
  {
    id: "cth",
    abbr: "C.Th.",
    title: "Certificate in Theology",
    credits: 36,
    duration: "1 Year",
    fee: "₹5,000 / year",
    feeNote: "Total fee ₹5,000",
    eligibility: "10th Pass / Fail",
    notesPages: "250 pages of study notes",
    highlights: [
      "OT & NT Survey",
      "Basics of Theology",
      "Evangelism & Homiletics",
      "Greek Alphabets",
    ],
  },
  {
    id: "dipth",
    abbr: "Dip.Th.",
    title: "Diploma in Theology",
    credits: 72,
    duration: "2 Years",
    fee: "₹4,000 / year",
    feeNote: "Total fee ₹8,000",
    eligibility: "10th Pass / Inter Fail / C.Th.",
    notesPages: "350 pages of study notes",
    highlights: [
      "Pentateuch & Gospels",
      "Bibliology",
      "Church History",
      "Elementary Greek & Hebrew",
    ],
  },
  {
    id: "bth",
    abbr: "B.Th.",
    title: "Bachelor of Theology",
    credits: 120,
    duration: "3 Years",
    fee: "₹7,000 / year",
    feeNote: "Total fee ₹21,000",
    eligibility: "Inter Pass / Dip.Th.",
    notesPages: "1,000 pages of study notes",
    highlights: ["Full Bible Survey", "Systematic Theology", "Pastoral Ministry", "Greek & Hebrew"],
  },
  {
    id: "mdiv",
    abbr: "M.Div.",
    title: "Master of Divinity",
    credits: 96,
    duration: "2 Years",
    fee: "₹11,500 / year",
    feeNote: "Total fee ₹23,000",
    eligibility: "Degree Pass / B.Th.",
    notesPages: "1,000 pages of study notes",
    highlights: ["Exegesis", "Christian Ethics", "Biblical Counselling", "Church Administration"],
  },
  {
    id: "mth",
    abbr: "M.Th.",
    title: "Master of Theology",
    credits: 72,
    duration: "2 Years",
    fee: "₹13,500 / year",
    feeNote: "Total fee ₹27,000",
    eligibility: "Degree + M.Div.",
    notesPages: "1,000 pages of study notes",
    highlights: ["OT & NT Exegesis", "Research Methodology", "Missiology", "Thesis Writing"],
  },
  {
    id: "phd",
    abbr: "Ph.D.",
    title: "Doctor of Philosophy",
    credits: 102,
    duration: "2 Years",
    fee: "₹20,000 / year",
    feeNote: "Total fee ₹40,000",
    eligibility: "P.G. / Degree + M.Div. or M.Th.",
    notesPages: "1,000 pages of study notes",
    highlights: [
      "Advanced Exegesis",
      "Indian Christian Theology",
      "Original Research",
      "Doctoral Thesis",
    ],
  },
];

export function getCourse(id: string | undefined | null): CourseInfo | undefined {
  return COURSES.find((c) => c.id === id);
}

export const MEDIUMS: Medium[] = ["English", "Telugu"];

/** Progress milestones for the two-stage application journey. */
export const PROGRESS = {
  /** Shown on the home card before any input — endowed-progress effect (Nunes & Drèze). */
  opened: 8,
  /** Basic details (name, mobile, email) captured — carried onto /apply. */
  basicsDone: 15,
  steps: [15, 36, 56, 74, 88] as const,
  complete: 100,
};

export interface WizardStepMeta {
  id: "programme" | "personal" | "church" | "education" | "review";
  label: string;
  blurb: string;
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  { id: "programme", label: "Programme", blurb: "Choose your course and medium of study." },
  {
    id: "personal",
    label: "Personal Details",
    blurb: "Tell us who you are and where to send your study notes.",
  },
  {
    id: "church",
    label: "Church Background",
    blurb: "A few lines about your church life — mostly optional.",
  },
  {
    id: "education",
    label: "Education",
    blurb: "Academic and theological qualifications — optional, copies can follow later.",
  },
  {
    id: "review",
    label: "Review & Submit",
    blurb: "One last look before your application reaches the admissions office.",
  },
];

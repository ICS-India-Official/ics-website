import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import {
  PROGRESS,
  WIZARD_STEPS,
  getCourse,
  type CourseId,
  type Medium,
} from "@/lib/application-data";
import {
  applicationSchema,
  leadSchema,
  normalizeMobile,
  validatePersonal,
  validateProgramme,
  type QualificationRow,
} from "@/lib/validation";
import { submitApplication } from "@/lib/api";
import { basicsComplete, useApplicationDraft, type ApplicationDraft } from "./draft";
import { BasicsForm } from "./BasicsForm";
import { ProgressHeader, StepRail } from "./WizardChrome";
import { ProgrammeStep } from "./steps/ProgrammeStep";
import { PersonalStep, type PersonalErrors, type PersonalField } from "./steps/PersonalStep";
import { ChurchStep, type ChurchErrors, type ChurchField } from "./steps/ChurchStep";
import { EducationStep } from "./steps/EducationStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SuccessPanel } from "./SuccessPanel";
import { TextField } from "./Field";
import { siteConfig } from "@/config/site";

type StepErrors = Partial<Record<string, string | undefined>>;

const LAST = WIZARD_STEPS.length - 1;

export function ApplyWizard() {
  const navigate = useNavigate();
  const { draft, update, updateBasics, reset, hydrated } = useApplicationDraft();

  const [stepIndex, setStepIndex] = useState(0);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [declared, setDeclared] = useState(false);
  const [declarationError, setDeclarationError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string; stored: boolean }>();
  const [editingBasics, setEditingBasics] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const basicsDone = basicsComplete(draft);

  // Scroll + focus management on step changes (accessibility).
  useEffect(() => {
    if (!hydrated || result || editingBasics) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex, hydrated, result, editingBasics]);

  function goNext() {
    setStepErrors({});
    setDeclarationError(undefined);

    if (stepIndex === 0) {
      const r = validateProgramme({
        courseId: draft.courseId as Exclude<CourseId, "">,
        medium: draft.medium as Medium,
      });
      if (!r.success) {
        setStepErrors(
          Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])),
        );
        return;
      }
    }

    if (stepIndex === 1) {
      const r = validatePersonal(draft);
      if (!r.success) {
        const mapped: StepErrors = {};
        for (const issue of r.error.issues) {
          const key = String(issue.path[0]);
          if (!(key in mapped)) mapped[key] = issue.message;
        }
        setStepErrors(mapped);
        return;
      }
    }

    // Steps 2 and 3 are optional by design — no gate.
    setStepIndex((i) => Math.min(i + 1, LAST));
  }

  function goBack() {
    setStepErrors({});
    setDeclarationError(undefined);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    if (!declared) {
      setDeclarationError("Please confirm the declaration before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = applicationSchema.parse({
        leadId: draft.leadId || undefined,
        source: "apply-wizard",
        fullName: draft.fullName.trim(),
        mobile: normalizeMobile(draft.mobile),
        email: draft.email.trim(),
        courseId: draft.courseId,
        medium: draft.medium,
        dateOfBirth: draft.dateOfBirth || undefined,
        fathersOrHusbandsName: draft.fathersOrHusbandsName || undefined,
        addressLine: draft.addressLine.trim(),
        city: draft.city || undefined,
        state: draft.state || undefined,
        pinCode: draft.pinCode || undefined,
        baptismDate: draft.baptismDate || undefined,
        denominationChurch: draft.denominationChurch || undefined,
        ministryExperience: draft.ministryExperience || undefined,
        academicQualifications: draft.academicQualifications,
        theologicalQualifications: draft.theologicalQualifications,
      });

      const res = await submitApplication(payload);
      if (!res.ok || !res.reference) {
        toast.error(res.message ?? "Submission failed. Please check your connection and retry.");
        return;
      }
      if (!res.stored) {
        toast.warning("Saved on this device.", {
          description:
            "The admissions office could not be reached — we will confirm your application by phone or email.",
        });
      }
      setResult({ reference: res.reference, stored: res.stored });
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error(
        `Some details need attention before we can submit. Please call us at ${siteConfig.phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Not hydrated yet (SSR-safe) ─────────────────────────────────── */
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-40 pb-24 sm:px-6">
        <div className="mx-auto h-64 max-w-xl animate-pulse rounded-2xl border border-border bg-card/50" />
      </div>
    );
  }

  /* ── Submitted — success screen ──────────────────────────────────── */
  if (result) {
    return (
      <div className="px-4 pt-36 pb-28 sm:px-6">
        <SuccessPanel reference={result.reference} stored={result.stored} />
      </div>
    );
  }

  /* ── Stage gate: capture the three basic details first ───────────── */
  if (!basicsDone && !editingBasics) {
    return (
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-32 pb-24 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <GateAside />
        <div className="mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-[family-name:var(--font-display)] text-3xl leading-tight text-foreground outline-none sm:text-4xl"
          >
            Application for Admission
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            First, the essentials — your name, mobile number and email. The full form takes just a
            few more minutes, you can pause anytime, and progress is saved automatically on this
            device.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold transition-colors hover:text-gold/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to homepage
          </button>
          <div className="mt-8">
            <BasicsForm onComplete={() => setStepIndex(0)} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Editing the three basics from the review step ───────────────── */
  if (editingBasics) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-32 pb-24 sm:px-6">
        <BasicsEditor
          initial={{ fullName: draft.fullName, mobile: draft.mobile, email: draft.email }}
          onSave={(patch) => {
            updateBasics(patch);
            setEditingBasics(false);
            setStepIndex(LAST);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onCancel={() => {
            setEditingBasics(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  /* ── Main wizard ─────────────────────────────────────────────────── */
  const percent = PROGRESS.steps[stepIndex] ?? PROGRESS.complete;
  const course = getCourse(draft.courseId);
  const meta = WIZARD_STEPS[stepIndex];

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <StepRail stepIndex={stepIndex} />

      <section className="min-w-0">
        <ProgressHeader stepIndex={stepIndex} percent={percent} />

        <div className="card-sheen mt-5 rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20 sm:p-8">
          {/* Mobile-only compact title — the rail is hidden on small screens */}
          <h1 ref={headingRef} tabIndex={-1} className="outline-none lg:hidden">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {meta?.label}
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl leading-snug text-foreground">
              {course ? `${course.abbr} · ${course.title}` : (meta?.blurb ?? "")}
            </span>
          </h1>

          <div className="mt-6 lg:mt-2" aria-live="polite">
            {stepIndex === 0 && (
              <ProgrammeStep
                courseId={draft.courseId}
                medium={draft.medium}
                onSelectCourse={(id) => update("courseId", id)}
                onSelectMedium={(m) => update("medium", m)}
                error={stepErrors["courseId"]}
              />
            )}
            {stepIndex === 1 && (
              <PersonalStep
                draft={draft}
                errors={stepErrors as PersonalErrors}
                onField={(key: PersonalField, value) => {
                  update(key, value);
                  if (stepErrors[key]) setStepErrors((e) => ({ ...e, [key]: undefined }));
                }}
              />
            )}
            {stepIndex === 2 && (
              <ChurchStep
                draft={draft}
                errors={stepErrors as ChurchErrors}
                onField={(key: ChurchField, value) => update(key, value)}
              />
            )}
            {stepIndex === 3 && (
              <EducationStep
                academic={draft.academicQualifications}
                theological={draft.theologicalQualifications}
                onAcademicChange={(rows: QualificationRow[]) =>
                  update("academicQualifications", rows)
                }
                onTheologicalChange={(rows: QualificationRow[]) =>
                  update("theologicalQualifications", rows)
                }
              />
            )}
            {stepIndex === LAST && (
              <ReviewStep
                draft={draft}
                declared={declared}
                onDeclaredChange={(v) => {
                  setDeclared(v === true);
                  if (v === true) setDeclarationError(undefined);
                }}
                declarationError={declarationError}
                onEditBasics={() => setEditingBasics(true)}
                onEditStep={(index) => {
                  setStepErrors({});
                  setStepIndex(index);
                }}
              />
            )}
          </div>

          {/* ── Footer navigation ─────────────────────────────────── */}
          <div className="mt-9 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </button>

            {stepIndex < LAST ? (
              <button
                type="button"
                onClick={goNext}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-all hover:shadow-lg hover:shadow-gold/25"
              >
                Continue
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-all hover:shadow-lg hover:shadow-gold/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit application
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            )}
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            <LockKeyhole className="h-3 w-3" aria-hidden />
            Progress saved automatically on this device
          </p>
        </div>
      </section>
    </div>
  );
}

/* Small aside shown next to the basics gate. */
function GateAside() {
  return (
    <aside className="sticky top-28 hidden self-start lg:block">
      <ol className="space-y-5">
        {[
          { t: "Basic details", d: "Name, mobile and email — done in under a minute." },
          { t: "Full application", d: "Course choice, personal and church background." },
          { t: "Verification call", d: "We confirm your details and guide the next steps." },
        ].map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-card font-mono text-xs font-bold text-gold"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{s.t}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

interface EditorErrors {
  fullName?: string | undefined;
  mobile?: string | undefined;
  email?: string | undefined;
}

/* Local-only editor for the three contact basics (no extra API call —
 * the final submission always sends the authoritative values). */
function BasicsEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: { fullName: string; mobile: string; email: string };
  onSave: (patch: Pick<ApplicationDraft, "fullName" | "mobile" | "email">) => void;
  onCancel: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<EditorErrors>({});

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  function save() {
    const fullName = leadSchema.shape.fullName.safeParse(values.fullName);
    const mobile = leadSchema.shape.mobile.safeParse(values.mobile);
    const email = leadSchema.shape.email.safeParse(values.email);
    const next: EditorErrors = {
      fullName: fullName.success ? undefined : fullName.error.issues[0]?.message,
      mobile: mobile.success ? undefined : mobile.error.issues[0]?.message,
      email: email.success ? undefined : email.error.issues[0]?.message,
    };
    setErrors(next);
    if (next.fullName || next.mobile || next.email) return;

    onSave({
      fullName: values.fullName.trim(),
      mobile: normalizeMobile(values.mobile),
      email: values.email.trim().toLowerCase(),
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      noValidate
      className="card-sheen rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20 sm:p-8"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-[family-name:var(--font-display)] text-xl text-foreground outline-none"
      >
        Edit your basic details
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        These are used for all official correspondence.
      </p>

      <div className="mt-6 space-y-5">
        <TextField
          label="Full Name"
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
          error={errors.fullName}
        />
        <TextField
          label="Mobile Number"
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={values.mobile}
          onChange={(e) => setValues((v) => ({ ...v, mobile: e.target.value }))}
          error={errors.mobile}
        />
        <TextField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
        />
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-all hover:shadow-lg hover:shadow-gold/25"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

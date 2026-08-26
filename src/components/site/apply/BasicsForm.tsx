import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShieldCheck, Clock3, LockKeyhole, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { leadSchema, normalizeMobile } from "@/lib/validation";
import { submitLead } from "@/lib/api";
import { PROGRESS } from "@/lib/application-data";
import { basicsComplete, useApplicationDraft } from "./draft";
import { FieldError, FieldLabel } from "./Field";

interface FieldErrors {
  fullName?: string | undefined;
  mobile?: string | undefined;
  email?: string | undefined;
}

/**
 * Stage 1 of the application journey — full name, mobile and email only.
 *
 * Uses the endowed-progress effect (Nunes & Drèze, 2006): the bar opens at
 * 8% ("application opened") and settles at exactly 15% once the three basic
 * details are captured, so applicants always feel ahead, never at zero.
 */
export function BasicsForm({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const { draft, updateBasics } = useApplicationDraft();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [captured, setCaptured] = useState(false);

  const valid = useMemo(() => basicsComplete(draft), [draft]);

  function validateField(field: keyof FieldErrors, value: string): string | undefined {
    const candidate = leadSchema.shape[field].safeParse(value);
    return candidate.success ? undefined : candidate.error.issues[0]?.message;
  }

  function blurField(field: keyof FieldErrors) {
    const message = validateField(field, draft[field]);
    setErrors((e) => ({ ...e, [field]: message }));
  }

  function changeField(field: keyof FieldErrors, value: string) {
    updateBasics({ [field]: value });
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: FieldErrors = {
      fullName: validateField("fullName", draft.fullName),
      mobile: validateField("mobile", draft.mobile),
      email: validateField("email", draft.email),
    };
    setErrors(next);
    const firstInvalid = (Object.keys(next) as Array<keyof FieldErrors>).find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(`basics-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitLead({
        fullName: draft.fullName.trim(),
        mobile: normalizeMobile(draft.mobile),
        email: draft.email.trim(),
        source: onComplete ? "apply-gate" : "home-card",
      });

      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong. Please try again.");
        return;
      }
      if (result.leadId) updateBasics({ leadId: result.leadId });
      if (!result.stored) {
        toast.warning("Your progress is saved on this device.", {
          description: "We could not reach the admissions server just now.",
        });
      }

      setCaptured(true);
      // Let the 15% state register visually before moving on.
      window.setTimeout(() => {
        if (onComplete) onComplete();
        else navigate({ to: "/apply" });
      }, 450);
    } finally {
      setSubmitting(false);
    }
  }

  const progress = captured || valid ? PROGRESS.basicsDone : PROGRESS.opened;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card-sheen rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20 sm:p-8"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-foreground">
            Begin your application
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Three details — that&apos;s all we need to open your file.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold">
          Stage 1 of 2
        </span>
      </div>

      {/* ── Progress ───────────────────────────────────────────────── */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="min-w-14 text-right text-xs font-semibold tabular-nums text-gold">
          {progress}% done
        </span>
      </div>

      {/* ── Fields ─────────────────────────────────────────────────── */}
      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="basics-fullName">Full Name</FieldLabel>
          <input
            id="basics-fullName"
            name="fullName"
            autoComplete="name"
            placeholder="As per your records"
            value={draft.fullName}
            onChange={(e) => changeField("fullName", e.target.value)}
            onBlur={() => blurField("fullName")}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? "basics-fullName-error" : undefined}
            className="field-input"
            disabled={submitting || captured}
          />
          <FieldError id="basics-fullName-error" message={errors.fullName} />
        </div>

        <div>
          <FieldLabel htmlFor="basics-mobile">Mobile Number</FieldLabel>
          <input
            id="basics-mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={draft.mobile}
            onChange={(e) => changeField("mobile", e.target.value)}
            onBlur={() => blurField("mobile")}
            aria-invalid={errors.mobile ? true : undefined}
            aria-describedby={errors.mobile ? "basics-mobile-error" : undefined}
            className="field-input"
            disabled={submitting || captured}
          />
          <FieldError id="basics-mobile-error" message={errors.mobile} />
        </div>

        <div>
          <FieldLabel htmlFor="basics-email">Email Address</FieldLabel>
          <input
            id="basics-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={draft.email}
            onChange={(e) => changeField("email", e.target.value)}
            onBlur={() => blurField("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "basics-email-error" : undefined}
            className="field-input"
            disabled={submitting || captured}
          />
          <FieldError id="basics-email-error" message={errors.email} />
        </div>
      </div>

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting || captured || !(draft.fullName.trim() || draft.mobile || draft.email)}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-gold-foreground transition-all hover:shadow-lg hover:shadow-gold/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Opening your file…
          </>
        ) : captured ? (
          <>
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Details captured
          </>
        ) : (
          <>
            Continue to the application
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </>
        )}
      </button>

      {/* ── Trust signals ──────────────────────────────────────────── */}
      <ul className="mt-6 grid grid-cols-1 gap-2.5 border-t border-border pt-5 text-xs text-muted-foreground sm:grid-cols-3">
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          NATA accredited
        </li>
        <li className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          Under two minutes
        </li>
        <li className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          Kept confidential
        </li>
      </ul>
    </form>
  );
}

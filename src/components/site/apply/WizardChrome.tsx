import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Church as ChurchIcon,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { WIZARD_STEPS } from "@/lib/application-data";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "../ImagePlaceholder";

export const STEP_ICONS = [BookOpen, UserRound, ChurchIcon, GraduationCap, ClipboardCheck] as const;

/* ── Sticky progress header (visible on every screen size) ─────────── */

export function ProgressHeader({ stepIndex, percent }: { stepIndex: number; percent: number }) {
  const meta = WIZARD_STEPS[stepIndex];
  return (
    <div className="sticky top-[5.5rem] z-30 -mx-1 rounded-2xl border border-border bg-card/90 px-4 py-3.5 shadow-lg shadow-black/20 backdrop-blur-md sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-sm font-semibold text-foreground">
          <span className="text-gold" aria-hidden>
            Step {stepIndex + 1} of {WIZARD_STEPS.length}
          </span>
          <span className="mx-2 text-border" aria-hidden>
            ·
          </span>
          {meta?.label}
        </p>
        <span
          aria-hidden
          className="shrink-0 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold tabular-nums text-gold"
        >
          {percent}%
        </span>
      </div>
      {/* Screen readers get a live region; sighted users watch the bar move. */}
      <p className="sr-only" role="status">
        You are {percent} percent complete, on step {stepIndex + 1}: {meta?.label}.
      </p>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Application progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ── Desktop side rail ─────────────────────────────────────────────── */

export function StepRail({ stepIndex }: { stepIndex: number }) {
  return (
    <aside className="sticky top-28 hidden self-start lg:block">
      <ImagePlaceholder label="Campus photograph" className="aspect-[4/3] w-full" />

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
          Application · 2026–27
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-snug text-foreground">
          Your journey to formal theological training
        </h2>
      </div>

      <ol className="mt-8 space-y-1">
        {WIZARD_STEPS.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? BookOpen;
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li key={step.id}>
              <div
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  current && "bg-gold/[0.08]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    done && "border-gold/50 bg-gold/15 text-gold",
                    current && "border-gold bg-gold text-gold-foreground",
                    !done && !current && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium leading-tight",
                      current ? "text-gold" : done ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {current && step.blurb ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.blurb}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 space-y-2.5 border-t border-border pt-6 text-xs text-muted-foreground">
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-2.5 transition-colors hover:text-foreground"
        >
          <Phone className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          {siteConfig.phone}
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="flex items-center gap-2.5 break-all transition-colors hover:text-foreground"
        >
          <Mail className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          {siteConfig.email}
        </a>
        <p className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" aria-hidden />
          Labbipet, Vijayawada, NTR Dist., A.P.
        </p>
      </div>

      <p className="mt-6 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground/70">
        <CheckCircle2 className="h-3.5 w-3.5 text-gold/60" aria-hidden />
        NATA Accredited · Estd. 2005
      </p>
    </aside>
  );
}

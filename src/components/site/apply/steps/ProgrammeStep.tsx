import { BookOpen, Check, Clock3, Coins, GraduationCap, Languages } from "lucide-react";
import { COURSES, type CourseId, type Medium } from "@/lib/application-data";
import { cn } from "@/lib/utils";

export function ProgrammeStep({
  courseId,
  medium,
  onSelectCourse,
  onSelectMedium,
  error,
}: {
  courseId: CourseId | "";
  medium: Medium | "";
  onSelectCourse: (id: CourseId) => void;
  onSelectMedium: (m: Medium) => void;
  error?: string | undefined;
}) {
  const errorId = "programme-error";
  return (
    <fieldset>
      <legend className="sr-only">Choose your programme</legend>

      {/* ── Course cards ─────────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
          <GraduationCap className="h-4 w-4 text-gold" aria-hidden />
          Course applied for
        </h3>
        {error ? null : <span className="text-xs text-muted-foreground">Select one</span>}
      </div>
      <div aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}>
        <div className="grid gap-3 sm:grid-cols-2">
          {COURSES.map((c) => {
            const selected = courseId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectCourse(c.id)}
                className={cn(
                  "group relative rounded-xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                    : "border-border bg-background/60 hover:border-gold/40 hover:bg-background",
                )}
              >
                {/* Selection indicator */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                    selected
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-border text-transparent group-hover:border-gold/40",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>

                <p className="font-[family-name:var(--font-display)] text-base text-gold">
                  {c.abbr}
                </p>
                <p className="mt-0.5 pr-6 text-sm font-medium leading-snug text-foreground">
                  {c.title}
                </p>

                <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                    <dd>{c.duration}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                    <dd>{c.fee}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                    <dd>{c.credits} credits</dd>
                  </div>
                </dl>

                <p className="mt-2.5 border-t border-border/60 pt-2.5 text-[0.72rem] leading-relaxed text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Eligibility:
                  </span>{" "}
                  {c.eligibility}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      ) : null}

      {/* ── Medium of study ──────────────────────────────────────── */}
      <div className="mt-7">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
          <Languages className="h-4 w-4 text-gold" aria-hidden />
          Medium of study
        </h3>
        <div className="mt-3 flex gap-2.5">
          {(["English", "Telugu"] as Medium[]).map((m) => {
            const selected = medium === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectMedium(m)}
                className={cn(
                  "rounded-full border px-6 py-2.5 text-sm font-medium transition-all",
                  selected
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border bg-background/60 text-muted-foreground hover:border-gold/40 hover:text-foreground",
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Reassurance ──────────────────────────────────────────── */}
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-gold/20 bg-gold/[0.06] p-4">
        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Every programme runs in{" "}
          <span className="font-semibold text-foreground">distance (extension) mode</span> — printed
          study notes are dispatched to you and online contact classes are taken by experienced
          faculty. Contact-class dates are shared in the first week of July.
        </p>
      </div>
    </fieldset>
  );
}

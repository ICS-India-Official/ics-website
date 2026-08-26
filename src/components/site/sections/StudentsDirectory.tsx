import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { COURSES } from "@/lib/application-data";
import type { PublicStudentRow } from "@/lib/admin-types";

/**
 * Public directory of enrolled students.
 * Only rows with public_directory = true (set by the office in the staff
 * console) are returned by the server — nothing else is exposed.
 */
export function StudentsDirectory() {
  const [students, setStudents] = useState<PublicStudentRow[]>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/students");
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as { ok: boolean; students?: PublicStudentRow[] };
        if (!cancelled) setStudents(body.students ?? []);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, PublicStudentRow[]>();
    for (const s of students ?? []) {
      const list = map.get(s.courseId) ?? [];
      list.push(s);
      map.set(s.courseId, list);
    }
    // Order groups by the official course ladder.
    return COURSES.map((c) => ({ course: c, rows: map.get(c.id) ?? [] })).filter(
      (g) => g.rows.length > 0,
    );
  }, [students]);

  const total = students?.length ?? 0;

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          background:
            "radial-gradient(60% 40% at 85% -5%, var(--gold), transparent 70%)," +
            "radial-gradient(50% 35% at 0% 100%, color-mix(in oklab, var(--maroon) 80%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
            Student Register
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Men and women <span className="text-gradient-gold">formed for His ministry</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Our students study in distance mode across Andhra Pradesh and beyond — serving in
            churches while they earn accredited theological degrees. Only students who have
            consented to appear here are listed.
          </p>
        </Reveal>

        {/* ── Body ──────────────────────────────────────────────────── */}
        {students === undefined && !failed ? (
          <div className="mt-20 flex min-h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" aria-hidden />
          </div>
        ) : failed ? (
          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-gold/70" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">
              The student register is temporarily unavailable. Please try again shortly.
            </p>
          </div>
        ) : total === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border/80 bg-card/50 p-10 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-gold/70" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">
              The public register is being prepared. Students appear here once the office publishes
              the current cohort.
            </p>
          </div>
        ) : (
          <>
            <Reveal delay={100}>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {total} student{total === 1 ? "" : "s"} across {groups.length} programme
                {groups.length === 1 ? "" : "s"}
              </p>
            </Reveal>

            <div className="mt-8 space-y-14">
              {groups.map((group, gi) => (
                <Reveal key={group.course.id} delay={gi * 60}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-foreground">
                      <span className="text-gold">{group.course.abbr}</span> · {group.course.title}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {group.rows.length} enrolled
                    </span>
                  </div>

                  <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
                    <table className="w-full min-w-125 text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                          <th className="px-5 py-3.5 font-semibold">#</th>
                          <th className="px-5 py-3.5 font-semibold">Student name</th>
                          <th className="px-5 py-3.5 font-semibold">Location</th>
                          <th className="px-5 py-3.5 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {group.rows.map((s, i) => (
                          <tr
                            key={`${s.fullName}-${i}`}
                            className="transition-colors hover:bg-muted/20"
                          >
                            <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="flex items-center gap-2.5 font-medium text-foreground">
                                <UserRound className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
                                {s.fullName}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground">
                              {s.city ? (
                                <span className="flex items-center gap-2">
                                  <MapPin
                                    className="h-3.5 w-3.5 shrink-0 text-gold/60"
                                    aria-hidden
                                  />
                                  {s.city}
                                </span>
                              ) : (
                                <span className="opacity-50">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={
                                  s.status === "alumni"
                                    ? "rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                                    : "rounded-full bg-gold/12 px-2.5 py-1 text-xs font-semibold text-gold"
                                }
                              >
                                {s.status === "alumni" ? "Alumni" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

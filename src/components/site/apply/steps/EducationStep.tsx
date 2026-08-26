import { Fragment, useId } from "react";
import { GraduationCap, Plus, ScrollText, X } from "lucide-react";
import type { QualificationRow } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface GroupProps {
  title: string;
  caption: string;
  icon: "academic" | "theological";
  rows: QualificationRow[];
  onChange: (rows: QualificationRow[]) => void;
}

function QualificationGroup({ title, caption, icon, rows, onChange }: GroupProps) {
  const baseId = useId();
  const Icon = icon === "academic" ? GraduationCap : ScrollText;

  function updateRow(index: number, patch: Partial<QualificationRow>) {
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Icon className="h-4 w-4 text-gold" aria-hidden />
            {title}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([...rows, { course: "", board: "", institution: "", year: "", grade: "" }])
          }
          disabled={rows.length >= 8}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3.5 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add qualification
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border/80 px-4 py-5 text-center text-xs text-muted-foreground">
          Nothing added yet — this section is optional. Attested copies can also be submitted to the
          office later.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {rows.map((row, index) => (
            <Fragment key={`${baseId}-${index}`}>
              <li className="rounded-lg border border-border/70 bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Entry {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Remove entry ${index + 1}`}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="field-label mb-1.5 block">Course / Standard</span>
                    <input
                      value={row.course}
                      onChange={(e) => updateRow(index, { course: e.target.value })}
                      placeholder="e.g. B.A. History / 10th Class"
                      maxLength={120}
                      className={cn("field-input", "py-2.5")}
                    />
                  </label>
                  <label className="block">
                    <span className="field-label mb-1.5 block">Board / University</span>
                    <input
                      value={row.board}
                      onChange={(e) => updateRow(index, { board: e.target.value })}
                      placeholder="Board or university"
                      maxLength={160}
                      className="field-input py-2.5"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label mb-1.5 block">School / College</span>
                    <input
                      value={row.institution}
                      onChange={(e) => updateRow(index, { institution: e.target.value })}
                      placeholder="Institution name"
                      maxLength={160}
                      className="field-input py-2.5"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label mb-1.5 block">Year of Passing</span>
                    <input
                      value={row.year}
                      onChange={(e) =>
                        updateRow(index, { year: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      inputMode="numeric"
                      placeholder="2019"
                      className="field-input py-2.5"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label mb-1.5 block">Percentage / Grade</span>
                    <input
                      value={row.grade}
                      onChange={(e) => updateRow(index, { grade: e.target.value })}
                      placeholder="e.g. 72% / B+"
                      maxLength={40}
                      className="field-input py-2.5"
                    />
                  </label>
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EducationStep({
  academic,
  theological,
  onAcademicChange,
  onTheologicalChange,
}: {
  academic: QualificationRow[];
  theological: QualificationRow[];
  onAcademicChange: (rows: QualificationRow[]) => void;
  onTheologicalChange: (rows: QualificationRow[]) => void;
}) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Educational qualifications</legend>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-gold/[0.06] px-4 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Optional now — you may also{" "}
          <span className="font-semibold text-foreground">
            submit self-attested copies after verification
          </span>
          .
        </p>
        <span className="tag-optional shrink-0">All optional</span>
      </div>

      <QualificationGroup
        icon="academic"
        title="Academic Qualifications"
        caption="School and secular college records."
        rows={academic}
        onChange={onAcademicChange}
      />
      <QualificationGroup
        icon="theological"
        title="Theological Qualifications"
        caption="Prior Bible school or seminary training."
        rows={theological}
        onChange={onTheologicalChange}
      />
    </fieldset>
  );
}

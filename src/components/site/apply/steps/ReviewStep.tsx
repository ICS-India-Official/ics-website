import {
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ScrollText,
  UserRound,
  Languages,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatMobileDisplay } from "@/lib/validation";
import { getCourse, type CourseId } from "@/lib/application-data";
import type { QualificationRow } from "@/lib/validation";
import type { ApplicationDraft } from "../draft";

function SectionCard({
  icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
          <span className="text-gold">{icon}</span>
          {title}
        </h4>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
            aria-label={`Edit ${title}`}
          >
            <Pencil className="h-3 w-3" aria-hidden />
            Edit
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  if (!v || (typeof v === "string" && v.trim() === "")) return null;
  return (
    <div className="flex gap-4 py-1.5 text-sm">
      <dt className="w-36 shrink-0 text-xs uppercase tracking-wider text-muted-foreground sm:w-44">
        {k}
      </dt>
      <dd className="min-w-0 break-words text-foreground">{v}</dd>
    </div>
  );
}

function QualificationCount({ rows }: { rows: QualificationRow[] }) {
  const filled = rows.filter((r) => r.course.trim() !== "").length;
  return (
    <span className={filled === 0 ? "text-muted-foreground italic" : ""}>
      {filled === 0
        ? "Not provided — copies may follow later"
        : `${filled} entr${filled === 1 ? "y" : "ies"} listed`}
    </span>
  );
}

export function ReviewStep({
  draft,
  declared,
  onDeclaredChange,
  declarationError,
  onEditBasics,
  onEditStep,
}: {
  draft: ApplicationDraft;
  declared: boolean;
  onDeclaredChange: (v: boolean | string) => void;
  declarationError?: string | undefined;
  onEditBasics: () => void;
  onEditStep: (index: number) => void;
}) {
  const course = getCourse(draft.courseId);
  return (
    <div className="space-y-4">
      {/* ── Contact basics ─────────────────────────────────────────── */}
      <SectionCard
        icon={<UserRound className="h-4 w-4" />}
        title="Your Details"
        onEdit={onEditBasics}
      >
        <dl className="divide-y divide-border/50">
          <Row k="Full name" v={draft.fullName} />
          <Row
            k="Mobile"
            v={
              draft.mobile ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                  {formatMobileDisplay(draft.mobile)}
                </span>
              ) : (
                ""
              )
            }
          />
          <Row
            k="Email"
            v={
              draft.email ? (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                  {draft.email}
                </span>
              ) : (
                ""
              )
            }
          />
        </dl>
      </SectionCard>

      {/* ── Programme ──────────────────────────────────────────────── */}
      <SectionCard
        icon={<GraduationCap className="h-4 w-4" />}
        title="Programme Applied For"
        onEdit={() => onEditStep(0)}
      >
        <dl className="divide-y divide-border/50">
          <Row k="Course" v={course ? `${course.abbr} — ${course.title}` : ""} />
          <Row
            k="Medium"
            v={
              draft.medium ? (
                <span className="inline-flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                  {draft.medium}
                </span>
              ) : (
                ""
              )
            }
          />
          {course ? <Row k="Duration / Fee" v={`${course.duration} · ${course.fee}`} /> : null}
        </dl>
      </SectionCard>

      {/* ── Personal ───────────────────────────────────────────────── */}
      <SectionCard
        icon={<MapPin className="h-4 w-4" />}
        title="Personal & Postal"
        onEdit={() => onEditStep(1)}
      >
        <dl className="divide-y divide-border/50">
          <Row k="Date of birth" v={draft.dateOfBirth} />
          <Row k="Father's / Husband's name" v={draft.fathersOrHusbandsName} />
          <Row
            k="Address"
            v={[
              draft.addressLine,
              draft.city,
              draft.state,
              draft.pinCode ? `PIN ${draft.pinCode}` : "",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </dl>
      </SectionCard>

      {/* ── Church ─────────────────────────────────────────────────── */}
      <SectionCard
        icon={<BookOpen className="h-4 w-4" />}
        title="Church Background"
        onEdit={() => onEditStep(2)}
      >
        <dl className="divide-y divide-border/50">
          <Row k="Baptism date" v={draft.baptismDate} />
          <Row k="Denomination / church" v={draft.denominationChurch} />
          <Row k="Ministry experience" v={draft.ministryExperience} />
        </dl>
      </SectionCard>

      {/* ── Education ──────────────────────────────────────────────── */}
      <SectionCard
        icon={<ScrollText className="h-4 w-4" />}
        title="Education"
        onEdit={() => onEditStep(3)}
      >
        <dl className="divide-y divide-border/50">
          <Row k="Academic" v={<QualificationCount rows={draft.academicQualifications} />} />
          <Row k="Theological" v={<QualificationCount rows={draft.theologicalQualifications} />} />
        </dl>
      </SectionCard>

      {/* ── Declaration ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gold/25 bg-gold/[0.05] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="declaration"
            checked={declared}
            onCheckedChange={onDeclaredChange}
            aria-invalid={declarationError ? true : undefined}
            aria-describedby={declarationError ? "declaration-error" : undefined}
            className="mt-0.5 data-[state=checked]:border-gold data-[state=checked]:bg-gold data-[state=checked]:text-gold-foreground"
          />
          <label
            htmlFor="declaration"
            className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
          >
            I declare that the information provided is true to the best of my knowledge, and I
            consent to the Institute of Christian Studies &amp; Research contacting me regarding my
            application.
          </label>
        </div>
        {declarationError ? (
          <p id="declaration-error" role="alert" className="field-error mt-2">
            {declarationError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

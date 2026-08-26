import { HeartHandshake } from "lucide-react";
import { DateField, TextAreaField, TextField } from "../Field";

export interface ChurchErrors {
  baptismDate?: string | undefined;
  denominationChurch?: string | undefined;
  ministryExperience?: string | undefined;
}

export type ChurchField = keyof ChurchErrors;

export function ChurchStep({
  draft,
  errors,
  onField,
}: {
  draft: {
    baptismDate: string;
    denominationChurch: string;
    ministryExperience: string;
  };
  errors: ChurchErrors;
  onField: (key: ChurchField, value: string) => void;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Church background</legend>

      {/* Everything on this step is optional — say so up front (form UX research:
          indicating effort level per section prevents mid-form abandonment). */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-gold/[0.06] px-4 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This section is <span className="font-semibold text-gold">entirely optional</span> — skip
          anything you prefer not to share for now.
        </p>
        <span className="tag-optional shrink-0">All optional</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <DateField
          label="Baptism Date"
          name="baptismDate"
          value={draft.baptismDate}
          max={new Date().toISOString().slice(0, 10)}
          min="1920-01-01"
          onChange={(e) => onField("baptismDate", e.target.value)}
          error={errors.baptismDate}
          optional
        />
        <TextField
          label="Denomination / Church"
          name="denominationChurch"
          placeholder="e.g. Baptist, Pentecostal, Independent"
          value={draft.denominationChurch}
          onChange={(e) => onField("denominationChurch", e.target.value)}
          error={errors.denominationChurch}
          optional
        />
      </div>

      <TextAreaField
        label="Ministry Experience"
        name="ministryExperience"
        rows={4}
        placeholder="Sunday school teaching, preaching, church planting, worship…"
        hint="Ministry experience is considered favourably for admission to every course."
        value={draft.ministryExperience}
        onChange={(e) => onField("ministryExperience", e.target.value)}
        error={errors.ministryExperience}
        optional
      />

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <HeartHandshake className="h-3.5 w-3.5 text-gold/70" aria-hidden />
        Students from every denomination and independent churches study with us.
      </p>
    </fieldset>
  );
}

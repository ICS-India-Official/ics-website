import { MapPin, UserRound } from "lucide-react";
import { DateField, TextAreaField, TextField } from "../Field";

export interface PersonalErrors {
  dateOfBirth?: string | undefined;
  fathersOrHusbandsName?: string | undefined;
  addressLine?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pinCode?: string | undefined;
}

export type PersonalField = keyof PersonalErrors;

export function PersonalStep({
  draft,
  errors,
  onField,
}: {
  draft: {
    dateOfBirth: string;
    fathersOrHusbandsName: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  errors: PersonalErrors;
  onField: (key: PersonalField, value: string) => void;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Personal details</legend>

      <div className="grid gap-5 sm:grid-cols-2">
        <DateField
          label="Date of Birth"
          name="dateOfBirth"
          value={draft.dateOfBirth}
          max={new Date().toISOString().slice(0, 10)}
          min="1920-01-01"
          onChange={(e) => onField("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
        />
        <TextField
          label="Father's / Husband's Name"
          name="fathersOrHusbandsName"
          autoComplete="off"
          placeholder="e.g. Pr. John Sudheer"
          value={draft.fathersOrHusbandsName}
          onChange={(e) => onField("fathersOrHusbandsName", e.target.value)}
          error={errors.fathersOrHusbandsName}
          optional
        />
      </div>

      {/* ── Postal address ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-background/50 p-4 sm:p-5">
        <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-gold" aria-hidden />
          Postal Address
        </h4>
        <p className="mb-4 text-xs text-muted-foreground">
          Study notes and official correspondence are dispatched by post.
        </p>

        <div className="space-y-4">
          <TextAreaField
            label="Street Address"
            name="addressLine"
            rows={2}
            placeholder="House no., street, area"
            value={draft.addressLine}
            onChange={(e) => onField("addressLine", e.target.value)}
            error={errors.addressLine}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="City / Town"
              name="city"
              placeholder="Vijayawada"
              value={draft.city}
              onChange={(e) => onField("city", e.target.value)}
              error={errors.city}
              optional
            />
            <TextField
              label="State"
              name="state"
              placeholder="Andhra Pradesh"
              value={draft.state}
              onChange={(e) => onField("state", e.target.value)}
              error={errors.state}
              optional
            />
            <TextField
              label="PIN Code"
              name="pinCode"
              inputMode="numeric"
              maxLength={6}
              placeholder="520001"
              value={draft.pinCode}
              onChange={(e) => onField("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              error={errors.pinCode}
            />
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="h-3.5 w-3.5 text-gold/70" aria-hidden />
        Details here go straight into your official student record — please double-check spellings.
      </p>
    </fieldset>
  );
}

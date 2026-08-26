import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle } from "lucide-react";

/* Shared, accessible form primitives for the application flow.
 * All styling comes from the design tokens in src/styles.css. */

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean | undefined;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="field-label">
        {children}
      </label>
      {optional ? <span className="tag-optional">Optional</span> : null}
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="field-error">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, optional, id, ...inputProps },
  ref,
) {
  const fieldId = id ?? inputProps.name ?? "";
  const errorId = `${fieldId}-error`;
  return (
    <div>
      <FieldLabel htmlFor={fieldId} optional={optional}>
        {label}
      </FieldLabel>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field-input"
        {...inputProps}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
});

interface DateFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
}

export function DateField({ label, error, optional, id, ...props }: DateFieldProps) {
  const fieldId = id ?? props.name ?? "";
  const errorId = `${fieldId}-error`;
  return (
    <div>
      <FieldLabel htmlFor={fieldId} optional={optional}>
        {label}
      </FieldLabel>
      <input
        type="date"
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field-input [color-scheme:dark]"
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
  hint?: string | undefined;
}

export function TextAreaField({
  label,
  error,
  optional,
  hint,
  id,
  rows = 3,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? "";
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <FieldLabel htmlFor={fieldId} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="field-input resize-y"
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : (
        <FieldError id={errorId} message={error} />
      )}
    </div>
  );
}

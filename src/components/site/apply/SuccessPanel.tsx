import { useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  FileCheck2,
  GraduationCap,
  Mail,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const NEXT_STEPS = [
  {
    icon: PhoneCall,
    title: "Verification call",
    body: "Our admissions office will call you to confirm your details and answer any questions.",
  },
  {
    icon: FileCheck2,
    title: "Submit attested copies",
    body: "Keep self-attested copies of your academic and theological certificates ready for the office.",
  },
  {
    icon: CalendarDays,
    title: "Contact classes begin",
    body: "Online contact-class dates (for your course) are shared in the first week of July.",
  },
  {
    icon: GraduationCap,
    title: "Notes dispatched",
    body: "Printed study notes for every subject are posted to the address you provided.",
  },
] as const;

export function SuccessPanel({ reference, stored }: { reference: string; stored: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — reference remains visible to copy manually */
    }
  }

  return (
    <div className="fade-up is-visible mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/15 shadow-lg shadow-gold/10">
        <CheckCircle2 className="h-8 w-8 text-gold" aria-hidden />
      </div>

      <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">Application received</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {stored ? (
          <>
            Your application has reached the admissions office. Please save your reference number —
            quote it in all correspondence.
          </>
        ) : (
          <>
            Your application has been recorded on this device and our team will confirm it by phone
            or email shortly. Please save your reference number.
          </>
        )}
      </p>

      {/* ── Reference code ─────────────────────────────────────────── */}
      <div className="mx-auto mt-7 inline-flex max-w-full items-center gap-3 rounded-full border border-gold/40 bg-gold/10 py-2 pl-5 pr-2">
        <span className="truncate font-mono text-sm font-semibold tracking-wider text-gold">
          {reference}
        </span>
        <button
          type="button"
          onClick={copyReference}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/20"
          aria-label="Copy reference number"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      {/* ── What happens next ──────────────────────────────────────── */}
      <div className="mt-12 text-left">
        <h3 className="text-center text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
          What happens next
        </h3>
        <ol className="relative mt-7 space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-border">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4">
              <span
                aria-hidden
                className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-card text-gold"
              >
                <step.icon className="h-4.5 w-4.5" />
              </span>
              <div className="pt-1">
                <p className="text-sm font-semibold text-foreground">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Contact fallback ──────────────────────────────────────── */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          Questions? Write to us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="font-medium text-gold hover:underline">
            {siteConfig.email}
          </a>
        </p>
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-gold-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp Admissions
        </a>
      </div>
    </div>
  );
}

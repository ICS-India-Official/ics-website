import { Reveal } from "@/components/site/Reveal";
import { BasicsForm } from "@/components/site/apply/BasicsForm";
import { ClipboardCheck, PhoneCall, UserRoundPlus, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

const HOW_IT_WORKS = [
  {
    icon: UserRoundPlus,
    title: "Share the essentials",
    body: "Name, mobile and email — that opens your application file instantly.",
  },
  {
    icon: ClipboardCheck,
    title: "Complete the guided form",
    body: "Course choice, personal details and background. Optional fields are clearly marked.",
  },
  {
    icon: PhoneCall,
    title: "Receive your verification call",
    body: "Our admissions office confirms everything and guides you through enrolment.",
  },
] as const;

export function AdmissionsSection() {
  return (
    <section id="admissions" className="bg-background py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        {/* ── Left: pitch + process + contact ──────────────────────── */}
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Admissions open</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">
            Two minutes to begin.
            <br />
            <span className="text-gradient-gold">A calling fulfilled for life.</span>
          </h2>

          <ol className="mt-10 space-y-6">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.08] text-gold"
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    <span className="mr-2 font-mono text-xs text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="mt-10 space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
              <dt className="sr-only">Location</dt>
              <dd className="text-muted-foreground">{siteConfig.location}</dd>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
              <dt className="sr-only">Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-muted-foreground transition-colors hover:text-gold hover:underline underline-offset-4"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* ── Right: stage-1 form ──────────────────────────────────── */}
        <Reveal delay={120}>
          <BasicsForm />
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/site/Reveal";
import { stats } from "@/data/stats";
import { siteConfig } from "@/config/site";
import heroImg from "@/assets/hero-sanctuary.jpg";
import { GraduationCap, BookOpen, Shield, MonitorSmartphone, type LucideIcon } from "lucide-react";

const statIcons: Record<string, LucideIcon> = {
  "Degree Pathways": GraduationCap,
  "Full Academic Ladder": BookOpen,
  Accredited: Shield,
  "Faith-Based Curriculum": MonitorSmartphone,
};

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-24 pb-14">
      <img
        src={heroImg}
        alt="Cathedral sanctuary interior with light through stained glass"
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/80" />

      {/* Subtle animated cross/particle overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          {/* ── Accreditation Banner (No borders) ──────────────── */}
          <div className="mb-4 inline-block">
            <p className="text-[0.72rem] font-bold tracking-[0.2em] text-gold uppercase sm:text-xs leading-relaxed">
              {siteConfig.accreditation}
            </p>
          </div>

          {/* ── Headline ─────────────────────────────────────────── */}
          <h1 className="mt-2 text-4xl leading-[1.1] sm:text-6xl md:text-7xl">
            Equipping the saints for His ministry
          </h1>

          {/* ── Location (Subtle, less focus) ────────────────────── */}
          <p className="mt-6 max-w-2xl text-sm font-medium tracking-widest text-foreground/45 uppercase">
            Since 2005 · {siteConfig.location}
          </p>

          {/* ── CTAs ─────────────────────────────────────────────── */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#admissions"
              className="rounded-full bg-gold px-7 py-3.5 text-center text-sm font-medium text-gold-foreground shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25"
            >
              Begin Your Application
            </a>
            <a
              href="#programs"
              className="rounded-full border border-foreground/30 px-7 py-3.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              Explore Programs
            </a>
          </div>
        </Reveal>

        {/* ── Stats Bar ────────────────────────────────────────────── */}
        <Reveal delay={150} className="mt-14 border-t border-border pt-8">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => {
              const Icon = statIcons[s.label];
              return (
                <div key={s.label} className="flex flex-col">
                  {Icon && <Icon className="mb-3 h-6 w-6 text-gold/70" />}
                  <dt className="font-[family-name:var(--font-display)] text-2xl text-gold sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                    {s.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>

      {/* Gradient Section Bridge to Mission */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

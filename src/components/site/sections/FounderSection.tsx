import { useState, useRef } from "react";
import { Reveal } from "@/components/site/Reveal";
import { founderData } from "@/data/founder";
import pastorImg from "@/assets/pastor-david-anil-kumar.png";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Quote,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Compass,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function FounderSection() {
  const [expanded, setExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (willExpand) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    // ── Reduced from py-20 sm:py-28 to py-12 sm:py-16 ─────────────────────
    <section id="leadership" className="bg-maroon py-12 text-maroon-foreground sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Profile Hero Block ──────────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Portrait Column */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="group relative mx-auto max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-3xl border-2 border-gold/35 bg-black/40 shadow-2xl shadow-black/60">
                  <img
                    src={pastorImg}
                    alt={`${founderData.name} - ${founderData.role}`}
                    loading="lazy"
                    width={1122}
                    height={1402}
                    className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  {/* Badge */}
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-gold/30 bg-black/75 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                          {founderData.role}
                        </p>
                        <p className="text-xs text-maroon-foreground/80">
                          Institute of Christian Studies and Research
                        </p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bio Column */}
          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <Compass className="h-3.5 w-3.5" />
                Leadership &amp; Vision
              </div>

              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {founderData.name}
              </h2>

              <p className="mt-2 text-base font-semibold text-gold sm:text-lg">
                {founderData.tagline}
              </p>

              <div className="mt-5 space-y-4 text-base leading-relaxed text-maroon-foreground/90 font-light sm:text-lg">
                {founderData.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Scripture Motto */}
              <div className="mt-6 rounded-2xl border border-gold/35 bg-black/30 p-5 backdrop-blur-xs sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Quote className="h-5 w-5" />
                  </div>
                  <div>
                    <blockquote className="font-[family-name:var(--font-display)] text-lg font-medium italic text-gold sm:text-xl">
                      "{founderData.motto}"
                    </blockquote>
                    <p className="mt-1 text-xs font-semibold tracking-widest uppercase text-maroon-foreground/75">
                      — {founderData.scriptureRef}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Blur Line Separator — reduced from my-16 to my-10 ─────────────
             Button: left half = dark navy (--background), right half = maroon
             This makes the button look like it literally bridges two sections. */}
        <div className="relative my-10 flex items-center justify-center">
          {/* Frosted blur band */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 backdrop-blur-sm" />
          {/* Gold gradient line */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          {/* ── Split-color Toggle Button ───────────────────────────────────
               background: left 50% = --background (dark navy)
                           right 50% = --maroon (deep red)
               text: gold (readable on both halves)
               border: gold/60                                               */}
          <button
            onClick={handleToggle}
            className="relative z-10 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-maroon border border-gold/60 px-8 py-3.5 text-sm font-semibold text-gold shadow-2xl shadow-black/50 ring-1 ring-gold/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-gold/20 hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                More About Rev. Jeldi
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* ── Expandable Details (CSS grid 1fr trick for smooth height) ─────── */}
        <div
          ref={detailsRef}
          className="grid transition-all duration-700 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {/* Credentials Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Education */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs transition-colors hover:border-gold/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Education
                  </h3>
                </div>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-maroon-foreground/85">
                  {founderData.education.map((item, i) => (
                    <li
                      key={i}
                      className="border-t border-white/10 pt-2.5 first:border-0 first:pt-0"
                    >
                      <p className="font-medium text-maroon-foreground">{item.degree}</p>
                      {item.institution && (
                        <p className="text-xs text-gold/90">{item.institution}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ministry & Leadership */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs transition-colors hover:border-gold/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Ministry &amp; Leadership
                  </h3>
                </div>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-maroon-foreground/85">
                  {founderData.leadership.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 border-t border-white/10 pt-2.5 first:border-0 first:pt-0"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic & Research */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs transition-colors hover:border-gold/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Academic &amp; Research
                  </h3>
                </div>
                <div className="mt-5 flex-1 space-y-3.5 text-sm text-maroon-foreground/85 leading-relaxed">
                  <p>{founderData.academicResearch.overview}</p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Key Highlights
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-maroon-foreground/80">
                      {founderData.academicResearch.keyVenues.map((venue, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          {venue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Ministry Highlights */}
            <div className="mt-8" id="founder-impact">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6 sm:p-8 backdrop-blur-xs">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <HeartHandshake className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl text-maroon-foreground">
                        Ministry Highlights &amp; Societal Impact
                      </h3>
                      <p className="text-xs text-gold uppercase tracking-wider">
                        Over two decades of faithful service &amp; transformation
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-maroon-foreground/70">
                    <Users className="h-4 w-4 text-gold" />
                    <span>Reaching 90,000+ children and youth every year</span>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {founderData.ministryHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-gold/30 hover:bg-white/10"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span className="text-sm leading-snug text-maroon-foreground/90">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision Banner */}
            <div className="mt-8 pb-4">
              <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-black/50 via-black/35 to-black/50 p-6 sm:p-10 text-center backdrop-blur-xs">
                <div className="mx-auto max-w-3xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    Founder's Vision
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg leading-relaxed text-maroon-foreground sm:text-xl md:text-2xl font-light">
                    "{founderData.vision}"
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="h-px w-12 bg-gold/40" />
                    <span className="text-xs uppercase tracking-widest text-gold font-medium">
                      {founderData.name}
                    </span>
                    <span className="h-px w-12 bg-gold/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

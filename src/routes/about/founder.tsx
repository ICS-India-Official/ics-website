import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { founderData } from "@/data/founder";
import pastorImg from "@/assets/pastor-david-anil-kumar.png";
import { siteConfig } from "@/config/site";
import { BackToHome } from "@/components/site/BackToHome";
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
} from "lucide-react";

export const Route = createFileRoute("/about/founder")({
  head: () => ({
    meta: [
      { title: `Rev. David Anil Kumar Jeldi — Founder & Director | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Profile and ministry of Rev. David Anil Kumar Jeldi, Founder and Director of the Institute of Christian Studies and Research, Vijayawada.",
      },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Maroon Hero Section */}
        <section className="bg-maroon pt-32 pb-16 text-maroon-foreground sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <BackToHome className="border-white/20 bg-black/40 text-gold hover:bg-gold hover:text-black" />
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <Compass className="h-3.5 w-3.5" />
                About Us · Leadership
              </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
              {/* Portrait */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative overflow-hidden rounded-3xl border-2 border-gold/35 bg-black/40 shadow-2xl shadow-black/60">
                    <img
                      src={pastorImg}
                      alt={`${founderData.name} - ${founderData.role}`}
                      width={1122}
                      height={1402}
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
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
              </div>

              {/* Bio Details */}
              <div className="lg:col-span-7">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {founderData.name}
                </h1>

                <p className="mt-2 text-base font-semibold text-gold sm:text-lg">
                  {founderData.tagline}
                </p>

                <div className="mt-5 space-y-4 text-base leading-relaxed font-light text-maroon-foreground/90 sm:text-lg">
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
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-maroon-foreground/75">
                        — {founderData.scriptureRef}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Grid */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {/* Education */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
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
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
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
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Academic &amp; Research
                  </h3>
                </div>
                <div className="mt-5 flex-1 space-y-3.5 text-sm leading-relaxed text-maroon-foreground/85">
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
            <div className="mt-12 rounded-3xl border border-white/10 bg-black/25 p-6 sm:p-8 backdrop-blur-xs">
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

            {/* Vision Banner */}
            <div className="mt-12">
              <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-black/50 via-black/35 to-black/50 p-6 sm:p-10 text-center backdrop-blur-xs">
                <div className="mx-auto max-w-3xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    Founder's Vision
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg font-light leading-relaxed text-maroon-foreground sm:text-xl md:text-2xl">
                    "{founderData.vision}"
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="h-px w-12 bg-gold/40" />
                    <span className="text-xs font-medium uppercase tracking-widest text-gold">
                      {founderData.name}
                    </span>
                    <span className="h-px w-12 bg-gold/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { BackToHome } from "@/components/site/BackToHome";
import { Quote, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about/vision")({
  head: () => ({
    meta: [
      { title: `Vision & Mission | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "The vision of the Institute of Christian Studies and Research: training and equipping lay leaders and ministers of the Gospel grounded in Scripture.",
      },
    ],
  }),
  component: VisionPage,
});

export function VisionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <BackToHome />
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              About Us · Our Foundation
            </div>
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Our Vision
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Institute of Christian Studies and Research — Vijayawada, Andhra Pradesh
          </p>

          {/* Vision Callout Box */}
          <div className="relative mt-10 overflow-hidden rounded-3xl border-2 border-gold/40 bg-card/60 p-8 shadow-2xl backdrop-blur-md sm:p-12">
            <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
            <div className="flex items-start gap-4 sm:gap-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold sm:h-14 sm:w-14">
                <Quote className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div>
                <blockquote className="font-[family-name:var(--font-display)] text-xl font-medium leading-relaxed text-foreground sm:text-2xl md:text-3xl font-light">
                  "The Institute of Christian Studies and Research is committed to training and
                  equipping lay leaders and ministers of the Gospel—grounded in the authority of
                  Scripture, centered on the person of Jesus Christ, empowered by the Holy Spirit,
                  and formed not merely in mind but in the whole person, for faithful and effective
                  Kingdom service."
                </blockquote>
              </div>
            </div>
          </div>

          {/* Pillars of the Vision */}
          <div className="mt-14">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Core Pillars of the Vision
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Authority of Scripture",
                  body: "Every doctrine, practice, and syllabus is anchored in the infallible Word of God.",
                },
                {
                  num: "02",
                  title: "Person of Christ",
                  body: "Christ-centered theological scholarship aiming for devotion and discipleship.",
                },
                {
                  num: "03",
                  title: "Spirit-Empowered",
                  body: "Empowered by the Holy Spirit for spiritual vitality and supernatural ministry fruitfulness.",
                },
                {
                  num: "04",
                  title: "Whole-Person Formation",
                  body: "Nurturing intellect, character, heart, and hands for faithful pastoral and lay leadership.",
                },
              ].map((p) => (
                <div
                  key={p.num}
                  className="rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-xs transition-colors hover:border-gold/40"
                >
                  <span className="font-mono text-xs font-semibold text-gold">{p.num}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation Cards */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/30 p-6">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                Explore Leadership & Advisory
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Meet the visionary leadership and faculty guiding the Institute.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/about/founder"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-transform hover:scale-105"
              >
                Founder Director
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about/advisor"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
              >
                Senior Advisor
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

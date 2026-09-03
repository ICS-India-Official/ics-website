import { MissionReveal } from "@/components/site/MissionReveal";
import { Reveal } from "@/components/site/Reveal";
import { pillars } from "@/data/pillars";

export function MissionSection() {
  return (
    <section className="bg-background">
      {/* Scroll-driven word lighting effect */}
      <MissionReveal />

      {/* 4 Pillars - positioned directly below with tight, clean padding */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-2 pb-14 sm:pb-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="border-t border-border/70 pt-5">
                <span className="text-xs tracking-[0.2em] text-gold font-mono">{p.n}</span>
                <h3 className="mt-3 text-xl font-bold font-[family-name:var(--font-display)]">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

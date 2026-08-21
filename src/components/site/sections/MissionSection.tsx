import { MissionReveal } from "@/components/site/MissionReveal";
import { Reveal } from "@/components/site/Reveal";
import { pillars } from "@/data/pillars";

export function MissionSection() {
  return (
    <section className="bg-background">
      <MissionReveal />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <div className="border-t border-border pt-5">
                <span className="text-xs tracking-[0.2em] text-gold">{p.n}</span>
                <h3 className="mt-3 text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

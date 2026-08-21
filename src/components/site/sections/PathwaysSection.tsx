import { Reveal } from "@/components/site/Reveal";
import { Pathways } from "@/components/site/Pathways";

export function PathwaysSection() {
  return (
    <section id="programs" className="bg-cream py-24 text-cream-foreground sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-2xl text-3xl leading-tight sm:text-5xl">
            Four Degree Pathways. One Mission.
          </h2>
          <p className="mt-4 max-w-2xl text-cream-foreground/70">
            From foundational theology to doctoral research — every program shaped by Scripture,
            anchored in the local church.
          </p>
        </Reveal>
        <Pathways />
      </div>
    </section>
  );
}

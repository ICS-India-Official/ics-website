import { Reveal } from "@/components/site/Reveal";
import { Pathways } from "@/components/site/Pathways";

export function PathwaysSection() {
  return (
    <section id="programs" className="bg-cream scroll-mt-24 py-14 text-cream-foreground sm:py-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-cream-foreground sm:text-5xl">
            Degree Pathways. One Mission.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-cream-foreground/85">
            From foundational theology to doctoral research — every program shaped by Scripture,
            anchored in the local church.
          </p>
        </Reveal>
        <Pathways />
      </div>
    </section>
  );
}

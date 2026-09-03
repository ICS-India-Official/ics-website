import { Reveal } from "@/components/site/Reveal";
import { pillars } from "@/data/pillars";
import { Quote, Sparkles } from "lucide-react";

export function MissionSection() {
  return (
    <section className="bg-background py-16 sm:py-20 border-b border-border/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Institutional Mission
          </div>

          <div className="relative mx-auto rounded-3xl border border-gold/30 bg-card/60 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
            <Quote className="mx-auto mb-4 h-8 w-8 text-gold/40" />
            <blockquote className="font-[family-name:var(--font-display)] text-xl font-light leading-relaxed text-foreground sm:text-2xl md:text-3xl md:leading-[1.4]">
              "The Institute of Christian Studies and Research is committed to training and
              equipping lay leaders and ministers of the Gospel—grounded in the authority of{" "}
              <span className="text-gold font-normal">Scripture</span>, centered on the person of{" "}
              <span className="text-gold font-normal">Jesus Christ</span>, empowered by the{" "}
              <span className="text-gold font-normal">Holy Spirit</span>, and formed not merely in
              mind but in the whole person, for faithful and effective{" "}
              <span className="text-gold font-normal">Kingdom</span> service."
            </blockquote>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
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

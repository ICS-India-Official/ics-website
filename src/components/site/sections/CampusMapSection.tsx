import { CampusMap } from "@/components/site/CampusMap";
import { Reveal } from "@/components/site/Reveal";
import { MapPin } from "lucide-react";

export function CampusMapSection() {
  return (
    <section id="campus" className="bg-background scroll-mt-24 py-16 sm:py-24 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <MapPin className="h-3.5 w-3.5" />
              Campus Location
            </div>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Visit Our Campus
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Vijayawada, Andhra Pradesh, India · Reachable by road, rail, and air
            </p>
          </div>
        </Reveal>

        <div className="mt-6">
          <CampusMap />
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/site/Reveal";
import { gallery } from "@/data/gallery";

export function GallerySection() {
  return (
    <section className="bg-cream pt-16 pb-16 text-cream-foreground sm:pt-20 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-2xl text-3xl leading-tight sm:text-5xl">
            A place to learn, worship & grow.
          </h2>
          <p className="mt-4 max-w-2xl text-cream-foreground/70">
            The seminary is more than a classroom — it's a sanctuary of study, prayer, and
            brotherhood/sisterhood shaped through lifelong friendships and ministry partnerships
            forged in the Spirit.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:auto-rows-[190px] sm:grid-cols-6">
          {gallery.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 80}
              className={`group relative h-56 overflow-hidden rounded-2xl sm:h-full ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="h-full w-full object-cover blur-md scale-105 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-40 sm:opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-4 bottom-4 translate-y-0 sm:translate-y-8 sm:opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
                <p className="mt-1 text-xs text-foreground/70">
                  Institute of Christian Studies and Research
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

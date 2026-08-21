import { Reveal } from "@/components/site/Reveal";
import alumniImg from "@/assets/alumni-portrait.jpg";

export function TestimonialSection() {
  return (
    <section className="bg-maroon py-20 text-maroon-foreground sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-16">
        <img
          src={alumniImg}
          alt="Rev. Stephen K., ICS alumni"
          loading="lazy"
          width={1024}
          height={1280}
          className="h-72 w-full rounded-2xl object-cover object-top lg:h-80"
        />
        <Reveal>
          <blockquote className="text-2xl leading-snug sm:text-3xl md:text-[2.1rem] md:leading-[1.35]">
            “ICS did not merely teach me theology — it formed me. The classrooms were rigorous, the
            chapel was holy ground, and the faculty walked with me like fathers. I left ready to
            preach Christ and to plant the church He purchased with His own blood.”
          </blockquote>
          <footer className="mt-6">
            <p className="font-medium">Rev. Stephen K.</p>
            <p className="text-sm text-maroon-foreground/70">ICS Alumni, Minister</p>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}

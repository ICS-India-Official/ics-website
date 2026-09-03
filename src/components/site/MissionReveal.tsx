import { useEffect, useRef, useState } from "react";

const TEXT =
  "The Institute of Christian Studies and Research is committed to training and equipping lay leaders and ministers of the Gospel—grounded in the authority of Scripture, centered on the person of Jesus Christ, empowered by the Holy Spirit, and formed not merely in mind but in the whole person, for faithful and effective Kingdom service.";

const WORDS = TEXT.split(" ");
const GOLD_WORDS = new Set(["Scripture,", "Jesus", "Christ,", "Holy", "Spirit,", "Kingdom"]);

export function MissionReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // Scrollable distance through the sticky area
      const totalScrollableDistance = rect.height - vh;
      if (totalScrollableDistance <= 0) {
        setProgress(1);
        return;
      }

      // Start lighting up as container scrolls
      const scrolled = -rect.top;
      const raw = scrolled / totalScrollableDistance;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update(); // Initial check

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const lit = progress * WORDS.length;

  return (
    <div ref={containerRef} className="relative h-[105vh] w-full">
      {/* Sticky container centers the statement during the scroll */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-4 sm:px-6">
        <p className="w-full max-w-5xl text-center font-[family-name:var(--font-display)] text-2xl font-light leading-relaxed sm:text-3xl md:text-4xl md:leading-[1.45] lg:text-[2.65rem]">
          {WORDS.map((word, i) => {
            const on = i < lit;
            const gold = on && GOLD_WORDS.has(word);
            return (
              <span
                key={`${word}-${i}`}
                className={`transition-colors duration-200 ${
                  gold
                    ? "text-gold font-normal"
                    : on
                      ? "text-foreground font-light"
                      : "text-muted-foreground/25"
                }`}
              >
                {word}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

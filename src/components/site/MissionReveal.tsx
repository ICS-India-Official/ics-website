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
      
      // Calculate how far the user has scrolled through the tall container
      const totalScrollableDistance = rect.height - vh;
      
      // Start lighting up when the container hits the top of the screen
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
    // 120vh creates extra scroll height to force the user to scroll through it
    <div ref={containerRef} className="relative h-[120vh] w-full">
      {/* Sticky container pins the text to the screen while scrolling the 120vh area */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <p className="w-full max-w-5xl px-4 text-center font-[family-name:var(--font-display)] text-2xl leading-relaxed sm:px-6 sm:text-3xl md:px-8 md:text-4xl md:leading-[1.4]">
          {WORDS.map((word, i) => {
            const on = i < lit;
            const gold = on && GOLD_WORDS.has(word);
            return (
              <span
                key={`${word}-${i}`}
                className={`transition-colors duration-300 ${
                  gold
                    ? "text-gold"
                    : on
                      ? "text-foreground"
                      : "text-muted-foreground/35"
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

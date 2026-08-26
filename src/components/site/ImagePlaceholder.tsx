import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Blurred placeholder for imagery that will be replaced with real
 * photography later. Renders a soft navy/gold gradient with heavy blur so
 * layouts look intentional rather than broken until assets arrive.
 *
 * To swap in a real image: replace this component's usage with an <img />
 * (or pass `src` once available).
 */
export function ImagePlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      role="img"
      aria-label={label ?? "Photograph coming soon"}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card",
        className,
      )}
    >
      {/* Layered colour fields — heavily blurred so any future photo blends in */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-125 blur-3xl"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 10%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 55%)," +
            "radial-gradient(100% 80% at 85% 25%, oklch(0.42 0.09 268 / 0.9), transparent 60%)," +
            "radial-gradient(90% 90% at 50% 100%, color-mix(in oklab, var(--maroon) 75%, transparent), transparent 65%)",
        }}
      />
      <div aria-hidden className="bg-grain absolute inset-0 -z-10 opacity-[0.05]" />
      <div className="flex h-full min-h-24 w-full items-center justify-center gap-2 text-muted-foreground/50">
        <ImagePlus className="h-4 w-4" aria-hidden />
        {label ? (
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em]">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackToHomeProps {
  label?: string;
  className?: string;
}

export function BackToHome({ label = "Back to Home", className = "" }: BackToHomeProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold shadow-lg backdrop-blur-md transition-all hover:bg-gold hover:text-gold-foreground hover:scale-105 active:scale-95 ${className}`}
      aria-label="Return to homepage"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Link>
  );
}

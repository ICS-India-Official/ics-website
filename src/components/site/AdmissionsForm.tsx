import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

const programs = ["B.Th.", "M.Div.", "M.Th.", "Ph.D."];

export function AdmissionsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "B.Th.",
  });

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg text-foreground">
          Application Process
        </h3>
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">
          Step {step} of 2
        </span>
      </div>

      {/* ── Progress Bar ──────────────────────────────────────────────── */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      {/* ── Step 1: Name & Email ──────────────────────────────────────── */}
      {step === 1 && !submitted && (
        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              Full Name
            </label>
            <input
              id="name"
              required
              value={formData.name}
              placeholder="Your full name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              placeholder="you@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <button
            onClick={nextStep}
            disabled={!formData.name || !formData.email}
            className="mt-2 w-full rounded-full border border-border bg-foreground/8 px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground/30 hover:bg-foreground/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Program Selection →
          </button>
        </div>
      )}

      {/* ── Step 2: Program Selection ─────────────────────────────────── */}
      {step === 2 && !submitted && (
        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="program"
              className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              Degree Program
            </label>

            {/* Custom-styled select: appearance-none removes native chrome,
                ChevronDown replaces the system arrow                       */}
            <div className="relative mt-2">
              <select
                id="program"
                value={formData.program}
                onChange={(e) =>
                  setFormData({ ...formData, program: e.target.value })
                }
                className="w-full cursor-pointer appearance-none rounded-xl border border-gold/50 bg-background px-4 py-3.5 pr-10 text-sm text-foreground outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              >
                {programs.map((p) => (
                  <option key={p} value={p} className="bg-card py-2 text-foreground">
                    {p}
                  </option>
                ))}
              </select>
              {/* Custom arrow icon — pointer-events-none so clicks pass through to select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <ChevronDown className="h-4 w-4 text-gold" />
              </div>
            </div>

            {/* Quick-pick pill buttons — tap to select without dropdown  */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {programs.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, program: p })}
                  className={`rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition-all ${
                    formData.program === p
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-border bg-background/50 text-muted-foreground hover:border-gold/40 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 rounded-full border border-border px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="w-2/3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-gold-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-gold/20"
            >
              Request Admissions Call
            </button>
          </div>
        </div>
      )}

      {/* ── Success State ─────────────────────────────────────────────── */}
      {submitted && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-gold">Application Received!</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Our admissions team will contact you shortly.
          </p>
        </div>
      )}
    </form>
  );
}

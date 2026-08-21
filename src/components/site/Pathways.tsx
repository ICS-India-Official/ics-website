import { useState } from "react";
import { programs } from "./programs";

export function Pathways() {
  const [activeId, setActiveId] = useState(programs[0]!.id);
  const [openTerm, setOpenTerm] = useState<number | null>(0);
  const program = programs.find((p) => p.id === activeId)!;

  const selectProgram = (id: string) => {
    setActiveId(id);
    setOpenTerm(0);
  };

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Degree programs"
        className="grid grid-cols-2 gap-2 sm:inline-flex sm:rounded-full sm:bg-cream-foreground/5 sm:p-1.5"
      >
        {programs.map((p) => {
          const active = p.id === activeId;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={active}
              onClick={() => selectProgram(p.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:px-7 ${
                active
                  ? "bg-cream-foreground text-cream"
                  : "text-cream-foreground/70 hover:text-cream-foreground"
              }`}
            >
              {p.tab}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <article className="rounded-2xl border border-cream-foreground/10 bg-cream-foreground/[0.03] p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-cream-foreground/8 px-3 py-1 text-xs font-medium tracking-wide text-cream-foreground/70 uppercase">
            {program.level}
          </span>
          <h3 className="mt-4 text-3xl text-cream-foreground sm:text-4xl">{program.title}</h3>
          <p className="mt-4 text-cream-foreground/70">{program.description}</p>

          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: "Duration", v: program.duration },
              { k: "Structure", v: program.semesters },
              { k: "Tuition", v: program.tuition },
            ].map((item) => (
              <div key={item.k} className="rounded-xl bg-cream-foreground/5 px-4 py-3">
                <dt className="text-xs tracking-wide text-cream-foreground/55 uppercase">
                  {item.k}
                </dt>
                <dd className="mt-1 font-medium text-cream-foreground">{item.v}</dd>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 rounded-xl bg-cream-foreground/5 px-4 py-3">
              <dt className="text-xs tracking-wide text-cream-foreground/55 uppercase">
                Minimum Qualification
              </dt>
              <dd className="mt-1 text-sm font-medium text-cream-foreground leading-snug">
                {program.qualification}
              </dd>
            </div>
          </dl>

          <a
            href="#admissions"
            className="mt-7 inline-flex rounded-full bg-cream-foreground px-7 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
          >
            {program.cta}
          </a>
        </article>

        <div className="divide-y divide-cream-foreground/10 rounded-2xl border border-cream-foreground/10">
          {program.terms.map((term, i) => {
            const open = openTerm === i;
            return (
              <div key={`${program.id}-${term.label}`}>
                <button
                  onClick={() => setOpenTerm(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="font-medium text-cream-foreground">{term.label}</span>
                  <span
                    className={`shrink-0 text-xl leading-none text-cream-foreground/60 transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 sm:px-6">
                      {term.note ? (
                        <p className="text-sm text-cream-foreground/70">{term.note}</p>
                      ) : (
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {term.courses?.map((course) => (
                            <li
                              key={course}
                              className="flex gap-2 text-sm text-cream-foreground/70"
                            >
                              <span className="text-gold">◆</span>
                              {course}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

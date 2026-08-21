import { Reveal } from "@/components/site/Reveal";
import { AdmissionsForm } from "@/components/site/AdmissionsForm";
import { siteConfig } from "@/config/site";

export function AdmissionsSection() {
  return (
    <section id="admissions" className="bg-background py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="text-3xl leading-tight sm:text-5xl">
            Book your admissions call.
          </h2>
          <dl className="mt-10 space-y-6">
            {[
              { k: "Location", v: siteConfig.location },
              { k: "Email", v: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { k: "Phone", v: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s+/g, "")}` },
            ].map((c) => (
              <div key={c.k} className="border-t border-border pt-4">
                <dt className="text-xs tracking-[0.2em] text-gold uppercase">{c.k}</dt>
                <dd className="mt-1.5 text-lg">
                  {c.href ? (
                    <a
                      href={c.href}
                      className="transition-colors hover:text-gold hover:underline underline-offset-4"
                    >
                      {c.v}
                    </a>
                  ) : (
                    c.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <AdmissionsForm />
        </Reveal>
      </div>
    </section>
  );
}

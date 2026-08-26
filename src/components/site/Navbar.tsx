import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";

interface NavEntry {
  label: string;
  to: "/" | "/students";
  hash?: string | undefined;
}

const NAV_LINKS: NavEntry[] = [
  { label: "Home", to: "/", hash: "top" },
  { label: "Leadership", to: "/", hash: "leadership" },
  { label: "Programs", to: "/", hash: "programs" },
  { label: "Students", to: "/students" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl border border-border/30 bg-background/30 shadow-lg backdrop-blur-md sm:top-6">
      <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" hash="top" className="min-w-0">
          <span className="block truncate font-[family-name:var(--font-display)] text-base text-foreground sm:text-lg">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-6">
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/apply"
              activeProps={{ className: "text-gold" }}
              className="transition-colors hover:text-foreground"
            >
              Apply
            </Link>
          </div>
          <Link
            to="/apply"
            activeProps={{ className: "opacity-90" }}
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 sm:px-5 md:block"
          >
            Apply Now
          </Link>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu - slide in animation */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              hash="top"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="font-[family-name:var(--font-display)] text-base text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    {...(l.hash ? { hash: l.hash } : {})}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/apply"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gold hover:bg-muted [&.text-gold]:bg-transparent"
                  activeProps={{ className: "text-gold" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply
                </Link>
              </div>
              <div className="py-6">
                <Link
                  to="/apply"
                  className="-mx-3 block rounded-lg bg-gold px-3 py-2.5 text-center text-base font-semibold leading-7 text-gold-foreground hover:opacity-90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

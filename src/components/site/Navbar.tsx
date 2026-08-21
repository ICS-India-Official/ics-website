import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl border border-border/30 bg-background/30 shadow-lg backdrop-blur-md sm:top-6">
      <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-8">
        <a href="#top" className="min-w-0">
          <span className="block truncate font-[family-name:var(--font-display)] text-base text-foreground sm:text-lg">
            {siteConfig.name}
          </span>
        </a>
        <div className="flex shrink-0 items-center gap-6">
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#top" className="hover:text-foreground">
              Home
            </a>
            <a href="#leadership" className="hover:text-foreground">
              Leadership
            </a>
            <a href="#programs" className="hover:text-foreground">
              Programs
            </a>
            <a href="#admissions" className="hover:text-foreground">
              Apply
            </a>
          </div>
          <a
            href="#admissions"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 sm:px-5 md:block"
          >
            Apply Now
          </a>
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
          className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <a href="#top" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-[family-name:var(--font-display)] text-base text-foreground">
                {siteConfig.name}
              </span>
            </a>
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
                <a
                  href="#top"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#leadership"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leadership
                </a>
                <a
                  href="#programs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Programs
                </a>
                <a
                  href="#admissions"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#admissions"
                  className="-mx-3 block rounded-lg bg-gold px-3 py-2.5 text-center text-base font-semibold leading-7 text-gold-foreground hover:opacity-90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

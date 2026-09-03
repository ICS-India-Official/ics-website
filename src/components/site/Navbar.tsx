import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  BookOpen,
  UserCheck,
  GraduationCap,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AboutLinkItem {
  label: string;
  sublabel: string;
  to: string;
  hash?: string;
  icon: LucideIcon;
}

const ABOUT_LINKS: AboutLinkItem[] = [
  {
    label: "Vision",
    sublabel: "Foundation & institutional commitment",
    to: "/",
    hash: "vision",
    icon: BookOpen,
  },
  {
    label: "Founder Director",
    sublabel: "Rev. David Anil Kumar Jeldi",
    to: "/about/founder",
    icon: UserCheck,
  },
  {
    label: "Senior Advisor",
    sublabel: "Bishop Emeritus Rev. Dr. Suneel Bhanu Busi",
    to: "/about/advisor",
    icon: GraduationCap,
  },
  {
    label: "Faculty",
    sublabel: "Faculty roster & scholars",
    to: "/about/faculty",
    icon: Users,
  },
  {
    label: "Administrative Staff",
    sublabel: "Office & student operations",
    to: "/about/staff",
    icon: Building2,
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (isHomePage) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl border border-border/40 bg-background/60 shadow-xl shadow-black/40 backdrop-blur-md sm:top-6">
        <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-7 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            {/* Top-left Back to Home button on non-home pages */}
            {!isHomePage && (
              <Link
                to="/"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold hover:text-gold-foreground hover:scale-105 active:scale-95"
                title="Return to main page"
                aria-label="Back to main page"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}

            <Link
              to="/"
              hash="top"
              onClick={() => handleAnchorClick("top")}
              className="min-w-0 transition-opacity hover:opacity-90"
            >
              <span className="block truncate font-[family-name:var(--font-display)] text-base font-medium text-foreground sm:text-lg">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <Link
                to="/"
                hash="top"
                onClick={() => handleAnchorClick("top")}
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>

              {/* Enhanced About Us Dropdown with Zero-Gap hover bridge and Click Support */}
              <div
                ref={dropdownRef}
                className="relative py-1"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1 transition-all hover:text-foreground focus:outline-none",
                    aboutOpen && "text-gold font-medium"
                  )}
                  onClick={() => setAboutOpen((prev) => !prev)}
                  aria-expanded={aboutOpen}
                  aria-haspopup="true"
                >
                  About Us
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      aboutOpen && "rotate-180 text-gold"
                    )}
                  />
                </button>

                {/* Dropdown Menu with zero-gap padding container */}
                {aboutOpen && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5 z-50">
                    <div className="w-80 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-gold/20">
                      <div className="px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold/80 border-b border-border/50">
                        About The Institute
                      </div>
                      <div className="mt-1 space-y-1">
                        {ABOUT_LINKS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={`${item.to}-${item.hash || ""}`}
                              to={item.to}
                              hash={item.hash}
                              className="group flex items-start gap-3 rounded-xl p-2.5 text-left transition-all hover:bg-gold/10 hover:text-foreground"
                              onClick={() => {
                                setAboutOpen(false);
                                if (item.hash) handleAnchorClick(item.hash);
                              }}
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">
                                  {item.label}
                                </p>
                                <p className="truncate text-xs text-muted-foreground font-light">
                                  {item.sublabel}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/"
                hash="programs"
                onClick={() => handleAnchorClick("programs")}
                className="transition-colors hover:text-foreground"
              >
                Courses
              </Link>

              <Link
                to="/"
                hash="gallery"
                onClick={() => handleAnchorClick("gallery")}
                className="transition-colors hover:text-foreground"
              >
                Gallery
              </Link>
            </div>

            {/* Primary Apply Button */}
            <Link
              to="/apply"
              activeProps={{ className: "opacity-90" }}
              className="hidden rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95 sm:px-5 md:block"
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
      </header>

      {/* Mobile Menu — OUTSIDE <header> to prevent backdrop-filter containing block bug */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-[60] bg-background/85 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              hash="top"
              className="-m-1.5 p-1.5"
              onClick={() => {
                setMobileMenuOpen(false);
                handleAnchorClick("top");
              }}
            >
              <span className="font-[family-name:var(--font-display)] text-base font-medium text-foreground">
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
                {!isHomePage && (
                  <Link
                    to="/"
                    className="-mx-3 flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2.5 text-base font-semibold text-gold hover:bg-gold/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Main Page</span>
                  </Link>
                )}

                <Link
                  to="/"
                  hash="top"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAnchorClick("top");
                  }}
                >
                  Home
                </Link>

                {/* About Us Mobile Submenu */}
                <div className="py-1">
                  <button
                    type="button"
                    className="-mx-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                    onClick={() => setMobileAboutOpen((prev) => !prev)}
                  >
                    <span>About Us</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileAboutOpen && "rotate-180 text-gold"
                      )}
                    />
                  </button>

                  {mobileAboutOpen && (
                    <div className="mt-2 ml-2 space-y-1.5 border-l-2 border-gold/40 pl-3">
                      {ABOUT_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={`${item.to}-${item.hash || ""}`}
                            to={item.to}
                            hash={item.hash}
                            className="flex items-center gap-2.5 rounded-md py-2 px-2 text-sm font-medium text-muted-foreground hover:text-gold hover:bg-muted/30"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (item.hash) handleAnchorClick(item.hash);
                            }}
                          >
                            <Icon className="h-4 w-4 text-gold shrink-0" />
                            <div>
                              <p className="leading-tight text-foreground font-medium">{item.label}</p>
                              <p className="text-[0.72rem] text-muted-foreground font-light">{item.sublabel}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  hash="programs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAnchorClick("programs");
                  }}
                >
                  Courses
                </Link>

                <Link
                  to="/"
                  hash="gallery"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAnchorClick("gallery");
                  }}
                >
                  Gallery
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
    </>
  );
}

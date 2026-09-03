# Website Changes & Implementation Guide
**Institute of Christian Studies and Research (ICSR)**

This guide provides the complete, step-by-step instructions for updating the website. For each file, the exact sections to remove and the exact code to write/replace are provided.

---

## Table of Contents
1. [Media Assets Setup](#1-media-assets-setup)
2. [Navigation Bar: `src/components/site/Navbar.tsx`](#2-navigation-bar-srccomponentssitenavbartsx)
3. [Founder Section & Button: `src/components/site/sections/FounderSection.tsx`](#3-founder-section--button-srccomponentssitesectionsfoundersectiontsx)
4. [Fee Corrections](#4-fee-corrections)
   - [4.1 `src/lib/application-data.ts`](#41-srclibapplication-datats)
   - [4.2 `src/components/site/programs.ts`](#42-srccomponentssiteprogramsts)
5. [Consistency Updates (Stats, Pathways & Footer)](#5-consistency-updates)
   - [5.1 `src/data/stats.ts`](#51-srcdatastatsts)
   - [5.2 `src/components/site/sections/PathwaysSection.tsx`](#52-srccomponentssitesectionspathwayssectiontsx)
   - [5.3 `src/components/site/Footer.tsx`](#53-srccomponentssitefootertsx)
6. [New Routes & Pages (Create 7 Files)](#6-new-routes--pages)
   - [6.1 Gallery Page (`src/routes/gallery.tsx`)](#61-gallery-page-srcroutesgallerytsx)
   - [6.2 Vision Page (`src/routes/about/vision.tsx`)](#62-vision-page-srcroutesaboutvisiontsx)
   - [6.3 Founder Director Page (`src/routes/about/founder.tsx`)](#63-founder-director-page-srcroutesaboutfoundertsx)
   - [6.4 Advisor Page (`src/routes/about/advisor.tsx`)](#64-advisor-page-srcroutesaboutadvisortsx)
   - [6.5 Faculty Page (`src/routes/about/faculty.tsx`)](#65-faculty-page-srcroutesaboutfacultytsx)
   - [6.6 Administrative Staff Page (`src/routes/about/staff.tsx`)](#66-administrative-staff-page-srcroutesaboutstafftsx)
   - [6.7 About Index (`src/routes/about/index.tsx`)](#67-about-index-srcroutesaboutindextsx)
7. [Route Tree Generation Note](#7-route-tree-generation-note)

---

## 1. Media Assets Setup

The photo for **Bishop Emeritus Rev. Dr. Suneel Bhanu Busi** (provided in the prompt) has been placed at:
- `src/assets/advisor-bishop-suneel-busi.png`
- `public/advisor-bishop-suneel-busi.png`

The photo for **Rev. David Anil Kumar Jeldi** already exists in the repository at:
- `src/assets/pastor-david-anil-kumar.png`

---

## 2. Navigation Bar: `src/components/site/Navbar.tsx`

### Issues Fixed
1. **Renamed Leadership to "About Us"** with an interactive dropdown containing:
   - **Vision** (`/about/vision`)
   - **Founder Director** (`/about/founder`)
   - **Advisor** (`/about/advisor`)
   - **Faculty** (`/about/faculty`)
   - **Administrative Staff** (`/about/staff`)
2. **Renamed "Programs"** to **"Courses"** (`/#programs`).
3. **Replaced "Students"** with **"Gallery"** (`/gallery`).
4. **Removed duplicate "Apply" text link**, keeping only the primary gold **"Apply Now"** button.
5. **Mobile drawer updated** with collapsible accordion for "About Us".

### Sections to Remove
In `src/components/site/Navbar.tsx`:
- **Remove lines 6–17**: The old `NavEntry` interface and `NAV_LINKS` array.
- **Remove lines 42–49**: The plain `<Link to="/apply">Apply</Link>` text link.
- **Remove lines 114–121**: The mobile plain `<Link to="/apply">Apply</Link>`.

### Full Replacement Code for `src/components/site/Navbar.tsx`

Replace the entire contents of `src/components/site/Navbar.tsx` with:

```tsx
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const ABOUT_LINKS = [
  { label: "Vision", to: "/about/vision" },
  { label: "Founder Director", to: "/about/founder" },
  { label: "Advisor", to: "/about/advisor" },
  { label: "Faculty", to: "/about/faculty" },
  { label: "Administrative Staff", to: "/about/staff" },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl border border-border/30 bg-background/30 shadow-lg backdrop-blur-md sm:top-6">
        <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-8">
          <Link to="/" hash="top" className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-display)] text-base text-foreground sm:text-lg">
              {siteConfig.name}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-6">
            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <Link to="/" hash="top" className="transition-colors hover:text-foreground">
                Home
              </Link>

              {/* About Us Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground focus:outline-none",
                    aboutOpen && "text-foreground"
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

                {aboutOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur-md z-50">
                    {ABOUT_LINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-gold"
                        onClick={() => setAboutOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/" hash="programs" className="transition-colors hover:text-foreground">
                Courses
              </Link>

              <Link to="/gallery" className="transition-colors hover:text-foreground">
                Gallery
              </Link>
            </div>

            {/* Primary Apply Button */}
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
      </header>

      {/* Mobile Menu — OUTSIDE <header> to escape backdrop-blur containing block */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
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
                <Link
                  to="/"
                  hash="top"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* About Us Mobile Submenu */}
                <div>
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
                    <div className="mt-1 ml-3 space-y-1 border-l-2 border-gold/40 pl-3">
                      {ABOUT_LINKS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-gold hover:bg-muted/30"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  hash="programs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>

                <Link
                  to="/gallery"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
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
```

---

## 3. Founder Section & Button: `src/components/site/sections/FounderSection.tsx`

### Issues Fixed
1. The **"More About Rev. Jeldi"** button currently expands an in-page drawer. The user specifically asked:
   > *"we have a button in the website 'more about Rev .Jeldi' when one clicks that button he should be navigated to that page - where everything about him is clearly visible use proper styling place the photo properly and get things done"*
2. The button is converted into a router `<Link to="/about/founder">` with an arrow icon.
3. The in-page accordion state (`expanded`, `detailsRef`, `handleToggle`) is removed because the dedicated page `/about/founder` displays all full details.

### Section to Remove
In `src/components/site/sections/FounderSection.tsx`:
- Lines 1: Remove `useState, useRef` imports.
- Lines 15–16: Remove `ChevronDown, ChevronUp` imports, add `ArrowRight`.
- Add `import { Link } from "@tanstack/react-router";`
- Lines 20–31: Remove `const [expanded, setExpanded] = useState(false);` and `handleToggle`.
- Lines 130–146: Replace `<button onClick={handleToggle}>...</button>` with `<Link to="/about/founder">`.
- Lines 148–293: Remove the expandable drawer (or keep a preview, but navigating to the full page is cleanest).

### Updated Button Snippet in `src/components/site/sections/FounderSection.tsx`
Replace lines 116–147 in `FounderSection.tsx` with:

```tsx
        {/* ── More About Rev. Jeldi Button (Navigates to dedicated page) ── */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 backdrop-blur-sm" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <Link
            to="/about/founder"
            className="relative z-10 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-maroon border border-gold/60 px-8 py-3.5 text-sm font-semibold text-gold shadow-2xl shadow-black/50 ring-1 ring-gold/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-gold/20 hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            More About Rev. Jeldi
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
```

---

## 4. Fee Corrections

### 4.1 `src/lib/application-data.ts`

In `src/lib/application-data.ts`, lines 23–111 define `COURSES`.

#### Sections to Remove / Replace:

**1. C.Th. (lines 24–40):**
```ts
// REMOVE:
    fee: "₹2,000",
    feeNote: "one-time",

// REPLACE WITH:
    fee: "₹5,000 / year",
    feeNote: "Total fee ₹5,000",
```

**2. Dip.Th. (lines 41–57):**
```ts
// REMOVE:
    fee: "₹2,000 / year",
    feeNote: "per year",

// REPLACE WITH:
    fee: "₹4,000 / year",
    feeNote: "Total fee ₹8,000",
```

**3. B.Th. (lines 58–69):**
```ts
// REMOVE:
    fee: "₹5,000 / year",
    feeNote: "per year",

// REPLACE WITH:
    fee: "₹7,000 / year",
    feeNote: "Total fee ₹21,000",
```

**4. M.Div. (lines 70–81):**
```ts
// REMOVE:
    fee: "₹9,000 / year",
    feeNote: "per year",

// REPLACE WITH:
    fee: "₹11,500 / year",
    feeNote: "Total fee ₹23,000",
```

**5. M.Th. (lines 82–93):**
```ts
// REMOVE:
    fee: "₹10,000 / year",
    feeNote: "per year",

// REPLACE WITH:
    fee: "₹13,500 / year",
    feeNote: "Total fee ₹27,000",
```

**6. Ph.D. (lines 94–110):**
```ts
// REMOVE:
    fee: "₹12,500 / year",
    feeNote: "per year",

// REPLACE WITH:
    fee: "₹20,000 / year",
    feeNote: "Total fee ₹40,000",
```

---

### 4.2 `src/components/site/programs.ts`

In `src/components/site/programs.ts`, update `tuition` for the degree cards:

**1. B.Th. (line 12):**
```ts
// REPLACE:
tuition: "₹7,000 / year",
// WITH:
tuition: "₹7,000 / year (Total: ₹21,000)",
```

**2. M.Div. (line 93):**
```ts
// REPLACE:
tuition: "₹10,000 / year",
// WITH:
tuition: "₹11,500 / year (Total: ₹23,000)",
```

**3. M.Th. (line 160):**
```ts
// REPLACE:
tuition: "₹11,500 / year",
// WITH:
tuition: "₹13,500 / year (Total: ₹27,000)",
```

**4. Ph.D. (line 227):**
```ts
// REPLACE:
tuition: "₹12,500 / year",
// WITH:
tuition: "₹20,000 / year (Total: ₹40,000)",
```

---

## 5. Consistency Updates

### 5.1 `src/data/stats.ts`
Because the college offers 6 levels (C.Th. through Ph.D.):

```ts
// Replace contents of src/data/stats.ts:
export const stats = [
  { value: "6", label: "Degree Pathways" },
  { value: "C.Th – Ph.D", label: "Full Academic Ladder" },
  { value: "NATA", label: "Accredited" },
  { value: "Offline & Online", label: "Faith-Based Curriculum" },
];
```

### 5.2 `src/components/site/sections/PathwaysSection.tsx`
Update the heading from "Four" to "Six" or "Degree Pathways":

```tsx
// In src/components/site/sections/PathwaysSection.tsx, Line 10:
// REPLACE:
<h2 className="max-w-2xl text-3xl leading-tight sm:text-5xl">
  Four Degree Pathways. One Mission.
</h2>
// WITH:
<h2 className="max-w-2xl text-3xl leading-tight sm:text-5xl">
  Degree Pathways. One Mission.
</h2>
```

### 5.3 `src/components/site/Footer.tsx`
Update Quick Links (lines 47–73) to include About Us links and Gallery:

```tsx
        <div>
          <h4 className="text-sm tracking-[0.2em] text-gold uppercase">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#top" className="hover:text-foreground">
                Home
              </a>
            </li>
            <li>
              <Link to="/about/vision" className="hover:text-foreground">
                Vision
              </Link>
            </li>
            <li>
              <Link to="/about/founder" className="hover:text-foreground">
                Founder Director
              </Link>
            </li>
            <li>
              <Link to="/about/advisor" className="hover:text-foreground">
                Senior Advisor
              </Link>
            </li>
            <li>
              <a href="#programs" className="hover:text-foreground">
                Courses
              </a>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-foreground">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/apply" className="hover:text-foreground">
                Admissions
              </Link>
            </li>
          </ul>
        </div>
```

---

## 6. New Routes & Pages

Create the following files under `src/routes/`:

### 6.1 Gallery Page (`src/routes/gallery.tsx`)
Create file `src/routes/gallery.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GallerySection } from "@/components/site/sections/GallerySection";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Campus Gallery | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Moments from student life, worship, classes, and convocation at the Institute of Christian Studies and Research.",
      },
      { property: "og:title", content: `Campus Gallery | ${siteConfig.name}` },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-36">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.2 Vision Page (`src/routes/about/vision.tsx`)
Create file `src/routes/about/vision.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { Quote, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about/vision")({
  head: () => ({
    meta: [
      { title: `Vision & Mission | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "The vision of the Institute of Christian Studies and Research: training and equipping lay leaders and ministers of the Gospel grounded in Scripture.",
      },
    ],
  }),
  component: VisionPage,
});

export function VisionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            About Us · Our Foundation
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Our Vision
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Institute of Christian Studies and Research — Vijayawada, Andhra Pradesh
          </p>

          {/* Vision Callout Box */}
          <div className="relative mt-10 overflow-hidden rounded-3xl border-2 border-gold/40 bg-card/60 p-8 shadow-2xl backdrop-blur-md sm:p-12">
            <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
            <div className="flex items-start gap-4 sm:gap-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold sm:h-14 sm:w-14">
                <Quote className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div>
                <blockquote className="font-[family-name:var(--font-display)] text-xl font-medium leading-relaxed text-foreground sm:text-2xl md:text-3xl font-light">
                  "The Institute of Christian Studies and Research is committed to training and
                  equipping lay leaders and ministers of the Gospel—grounded in the authority of
                  Scripture, centered on the person of Jesus Christ, empowered by the Holy Spirit,
                  and formed not merely in mind but in the whole person, for faithful and effective
                  Kingdom service."
                </blockquote>
              </div>
            </div>
          </div>

          {/* Pillars of the Vision */}
          <div className="mt-14">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Core Pillars of the Vision
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Authority of Scripture",
                  body: "Every doctrine, practice, and syllabus is anchored in the infallible Word of God.",
                },
                {
                  num: "02",
                  title: "Person of Christ",
                  body: "Christ-centered theological scholarship aiming for devotion and discipleship.",
                },
                {
                  num: "03",
                  title: "Spirit-Empowered",
                  body: "Empowered by the Holy Spirit for spiritual vitality and supernatural ministry fruitfulness.",
                },
                {
                  num: "04",
                  title: "Whole-Person Formation",
                  body: "Nurturing intellect, character, heart, and hands for faithful pastoral and lay leadership.",
                },
              ].map((p) => (
                <div
                  key={p.num}
                  className="rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-xs transition-colors hover:border-gold/40"
                >
                  <span className="font-mono text-xs font-semibold text-gold">{p.num}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/30 p-6">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                Explore Leadership & Faculty
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Meet the visionary leaders guiding the Institute.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/about/founder"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-transform hover:scale-105"
              >
                Founder Director
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about/advisor"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
              >
                Senior Advisor
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.3 Founder Director Page (`src/routes/about/founder.tsx`)
Create file `src/routes/about/founder.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { founderData } from "@/data/founder";
import pastorImg from "@/assets/pastor-david-anil-kumar.png";
import { siteConfig } from "@/config/site";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Quote,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/about/founder")({
  head: () => ({
    meta: [
      { title: `Rev. David Anil Kumar Jeldi — Founder & Director | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Profile and ministry of Rev. David Anil Kumar Jeldi, Founder and Director of the Institute of Christian Studies and Research, Vijayawada.",
      },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Maroon Hero Section */}
        <section className="bg-maroon pt-32 pb-16 text-maroon-foreground sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Compass className="h-3.5 w-3.5" />
              About Us · Leadership
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
              {/* Portrait */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative overflow-hidden rounded-3xl border-2 border-gold/35 bg-black/40 shadow-2xl shadow-black/60">
                    <img
                      src={pastorImg}
                      alt={`${founderData.name} - ${founderData.role}`}
                      width={1122}
                      height={1402}
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-gold/30 bg-black/75 p-3.5 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                            {founderData.role}
                          </p>
                          <p className="text-xs text-maroon-foreground/80">
                            Institute of Christian Studies and Research
                          </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                          <Sparkles className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="lg:col-span-7">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {founderData.name}
                </h1>

                <p className="mt-2 text-base font-semibold text-gold sm:text-lg">
                  {founderData.tagline}
                </p>

                <div className="mt-5 space-y-4 text-base leading-relaxed font-light text-maroon-foreground/90 sm:text-lg">
                  {founderData.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Scripture Motto */}
                <div className="mt-6 rounded-2xl border border-gold/35 bg-black/30 p-5 backdrop-blur-xs sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                      <Quote className="h-5 w-5" />
                    </div>
                    <div>
                      <blockquote className="font-[family-name:var(--font-display)] text-lg font-medium italic text-gold sm:text-xl">
                        "{founderData.motto}"
                      </blockquote>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-maroon-foreground/75">
                        — {founderData.scriptureRef}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Grid */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {/* Education */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Education
                  </h3>
                </div>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-maroon-foreground/85">
                  {founderData.education.map((item, i) => (
                    <li
                      key={i}
                      className="border-t border-white/10 pt-2.5 first:border-0 first:pt-0"
                    >
                      <p className="font-medium text-maroon-foreground">{item.degree}</p>
                      {item.institution && (
                        <p className="text-xs text-gold/90">{item.institution}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ministry & Leadership */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Ministry &amp; Leadership
                  </h3>
                </div>
                <ul className="mt-5 flex-1 space-y-3 text-sm text-maroon-foreground/85">
                  {founderData.leadership.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 border-t border-white/10 pt-2.5 first:border-0 first:pt-0"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic & Research */}
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                    Academic &amp; Research
                  </h3>
                </div>
                <div className="mt-5 flex-1 space-y-3.5 text-sm leading-relaxed text-maroon-foreground/85">
                  <p>{founderData.academicResearch.overview}</p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Key Highlights
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-maroon-foreground/80">
                      {founderData.academicResearch.keyVenues.map((venue, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          {venue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Ministry Highlights */}
            <div className="mt-12 rounded-3xl border border-white/10 bg-black/25 p-6 sm:p-8 backdrop-blur-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <HeartHandshake className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-maroon-foreground">
                      Ministry Highlights &amp; Societal Impact
                    </h3>
                    <p className="text-xs text-gold uppercase tracking-wider">
                      Over two decades of faithful service &amp; transformation
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-maroon-foreground/70">
                  <Users className="h-4 w-4 text-gold" />
                  <span>Reaching 90,000+ children and youth every year</span>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {founderData.ministryHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-gold/30 hover:bg-white/10"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm leading-snug text-maroon-foreground/90">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision Banner */}
            <div className="mt-12">
              <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-black/50 via-black/35 to-black/50 p-6 sm:p-10 text-center backdrop-blur-xs">
                <div className="mx-auto max-w-3xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    Founder's Vision
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg font-light leading-relaxed text-maroon-foreground sm:text-xl md:text-2xl">
                    "{founderData.vision}"
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="h-px w-12 bg-gold/40" />
                    <span className="text-xs font-medium uppercase tracking-widest text-gold">
                      {founderData.name}
                    </span>
                    <span className="h-px w-12 bg-gold/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.4 Advisor Page (`src/routes/about/advisor.tsx`)
Create file `src/routes/about/advisor.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import advisorImg from "@/assets/advisor-bishop-suneel-busi.png";
import {
  BookOpen,
  Church,
  Users,
  Compass,
  Sparkles,
  Quote,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/about/advisor")({
  head: () => ({
    meta: [
      {
        title: `Bishop Emeritus Rev. Dr. Suneel Bhanu Busi — Senior Advisor | ${siteConfig.name}`,
      },
      {
        name: "description",
        content:
          "Bishop Emeritus Rev. Dr. Suneel Bhanu Busi — distinguished theologian, educator, church leader, pastor, ecumenical leader, and Senior Advisor of ICSR.",
      },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  const leadershipHighlights = [
    {
      title: "Theological Educator & Scholar",
      desc: "Contributed significantly to theological scholarship, ministerial formation, and the development of Christian leaders across generations.",
    },
    {
      title: "President & Moderator Bishop, AELC",
      desc: "Provided visionary pastoral leadership to the Andhra Evangelical Lutheran Church (AELC), one of India's historic Lutheran churches.",
    },
    {
      title: "Ecumenical & Institutional Leadership",
      desc: "Served in key leadership capacities in CASA (Churches Auxiliary for Social Action) and Church History Association of India (CHAI), Southern India Branch.",
    },
    {
      title: "Global Christian Engagement",
      desc: "Engaged actively in the wider Lutheran communion on contextual theology, societal transformation, and the upliftment of marginalized communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-maroon pt-32 pb-16 text-maroon-foreground sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Compass className="h-3.5 w-3.5" />
              About Us · Senior Advisory
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
              {/* Advisor Photo */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative overflow-hidden rounded-3xl border-2 border-gold/35 bg-black/40 shadow-2xl shadow-black/60">
                    <img
                      src={advisorImg}
                      alt="Bishop Emeritus Rev. Dr. Suneel Bhanu Busi - Senior Advisor"
                      width={1000}
                      height={1250}
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-gold/30 bg-black/75 p-3.5 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                            Senior Advisor
                          </p>
                          <p className="text-xs text-maroon-foreground/80">
                            Institute of Christian Studies and Research
                          </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                          <Sparkles className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="lg:col-span-7">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Bishop Emeritus Rev. Dr. Suneel Bhanu Busi
                </h1>

                <p className="mt-2 text-base font-semibold text-gold sm:text-lg">
                  Distinguished Theologian · Theological Educator · Church Leader · Ecumenical Leader
                </p>

                <div className="mt-5 space-y-4 text-base leading-relaxed font-light text-maroon-foreground/90 sm:text-lg">
                  <p>
                    Bishop Emeritus Rev. Dr. Suneel Bhanu Busi is a distinguished theologian,
                    theological educator, church leader, pastor, and ecumenical leader with
                    extensive experience in theological education and Christian ministry in India
                    and internationally.
                  </p>
                  <p>
                    Dr. Busi has served in theological education for many years, contributing
                    significantly to theological scholarship, ministerial formation, and the
                    development of Christian leaders. Through his teaching, academic leadership, and
                    theological engagement, he has influenced generations of students and church
                    leaders.
                  </p>
                  <p>
                    In addition to his academic ministry, Dr. Busi has significant pastoral and
                    church leadership experience. He served as President and Moderator Bishop of the
                    Andhra Evangelical Lutheran Church (AELC), providing leadership to one of India's
                    historic Lutheran churches.
                  </p>
                  <p>
                    Bishop Emeritus Dr. Busi has also provided leadership to several important
                    Christian and theological organizations. He has served in significant
                    leadership capacities in organizations such as CASA (Churches Auxiliary for
                    Social Action) and the Church History Association of India (CHAI), Southern
                    India Branch, among other ecclesiastical, theological, and ecumenical bodies.
                    Through these roles, he has contributed to theological reflection, church
                    history, Christian unity, social engagement, and the wider mission of the Church
                    in India.
                  </p>
                  <p>
                    Dr. Busi has also been actively involved in ecumenical and international
                    Christian leadership. His ministry has included participation in the wider
                    Lutheran communion and theological engagement with issues relating to the church,
                    society, public witness, contextual theology, and the experience of marginalized
                    communities.
                  </p>
                </div>
              </div>
            </div>

            {/* Tribute Quote Box */}
            <div className="mt-12 rounded-3xl border border-gold/35 bg-black/30 p-6 sm:p-8 backdrop-blur-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Quote className="h-6 w-6" />
                </div>
                <div>
                  <blockquote className="font-[family-name:var(--font-display)] text-lg font-light leading-relaxed text-gold sm:text-xl md:text-2xl">
                    "With his rich experience as a theologian, educator, pastor, church leader,
                    organizational leader, and ecumenical representative, Bishop Emeritus Rev. Dr.
                    Suneel Bhanu Busi brings valuable wisdom, experience, and guidance to the
                    Institute of Christian Studies and Research."
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Leadership & Contributions Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {leadershipHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-xs transition-colors hover:border-gold/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-maroon-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-maroon-foreground/80 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formal Institutional Statement */}
            <div className="mt-12">
              <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-black/50 via-black/35 to-black/50 p-6 sm:p-10 text-center backdrop-blur-xs">
                <div className="mx-auto max-w-3xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    Senior Advisory Commitment
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg font-light leading-relaxed text-maroon-foreground sm:text-xl">
                    "The Institute of Christian Studies and Research is privileged to have Bishop
                    Emeritus Rev. Dr. Suneel Bhanu Busi as its Senior Advisor. His theological
                    scholarship, academic experience, pastoral wisdom, organizational leadership,
                    and decades of service to the Church and theological education will provide
                    valuable guidance to the Institute in its pursuit of academic excellence,
                    biblical scholarship, theological research, and effective Christian ministry."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.5 Faculty Page (`src/routes/about/faculty.tsx`)
Create file `src/routes/about/faculty.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { Construction, ArrowLeft, Mail } from "lucide-react";

export const Route = createFileRoute("/about/faculty")({
  head: () => ({
    meta: [
      { title: `Faculty | ${siteConfig.name}` },
      { name: "description", content: "Faculty directory of the Institute of Christian Studies and Research." },
    ],
  }),
  component: FacultyPage,
});

function FacultyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex min-h-[75vh] items-center justify-center px-4 pt-32 pb-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-lg shadow-gold/10">
            <Construction className="h-8 w-8 animate-pulse" />
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Faculty Directory
          </h1>

          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gold">
            Page Under Construction
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We are curating comprehensive academic and ministerial profiles for our faculty members.
            Please check back soon for the updated roster.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              Contact Admissions
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.6 Administrative Staff Page (`src/routes/about/staff.tsx`)
Create file `src/routes/about/staff.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { Construction, ArrowLeft, Phone } from "lucide-react";

export const Route = createFileRoute("/about/staff")({
  head: () => ({
    meta: [
      { title: `Administrative Staff | ${siteConfig.name}` },
      { name: "description", content: "Administrative staff at the Institute of Christian Studies and Research." },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex min-h-[75vh] items-center justify-center px-4 pt-32 pb-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-lg shadow-gold/10">
            <Construction className="h-8 w-8 animate-pulse" />
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Administrative Staff
          </h1>

          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gold">
            Page Under Construction
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Our administrative contact details and office staff directory are currently being
            updated. For immediate assistance, please get in touch with our office.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              WhatsApp Office
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 6.7 About Index (`src/routes/about/index.tsx`)
Create file `src/routes/about/index.tsx` so visiting `/about` automatically redirects to `/about/vision`:

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  beforeLoad: () => {
    throw redirect({ to: "/about/vision" });
  },
});
```

---

## 7. Route Tree Generation Note

> [!IMPORTANT]
> **Do NOT edit `src/routeTree.gen.ts` manually.**
>
> TanStack Router auto-generates `src/routeTree.gen.ts` by inspecting the files in `src/routes/`.
>
> Once you create the new files in `src/routes/`, simply execute:
> ```bash
> bun run build
> ```
> or run the development server:
> ```bash
> bun run dev
> ```
> The route tree file will automatically pick up `/gallery`, `/about/`, `/about/vision`, `/about/founder`, `/about/advisor`, `/about/faculty`, and `/about/staff`.

---

## 8. Summary Checklist

| Item | Action Required | Status |
|---|---|---|
| **Bishop Photo** | Saved at `src/assets/advisor-bishop-suneel-busi.png` & `public/` | Ready |
| **Navbar.tsx** | Replace with full code in Section 2 (About Us dropdown, Courses, Gallery, remove duplicate Apply) | Ready |
| **FounderSection.tsx** | Replace button with Link to `/about/founder` in Section 3 | Ready |
| **application-data.ts** | Update 6 course fees (C.Th. ₹5k, Dip.Th. ₹4k/yr ₹8k total, B.Th. ₹7k/yr ₹21k total, M.Div. ₹11.5k/yr ₹23k total, M.Th. ₹13.5k/yr ₹27k total, Ph.D. ₹20k/yr ₹40k total) | Ready |
| **programs.ts** | Update tuition strings with totals in Section 4.2 | Ready |
| **stats.ts** | Change 4 Pathways → 6 Pathways (C.Th – Ph.D) in Section 5.1 | Ready |
| **PathwaysSection.tsx** | Change "Four" to "Degree" in Section 5.2 | Ready |
| **Footer.tsx** | Update Quick Links to match new pages in Section 5.3 | Ready |
| **7 New Routes** | Create files detailed in Section 6 | Ready |

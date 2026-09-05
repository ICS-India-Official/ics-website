import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Institute of Christian Studies and Research — Vijayawada" },
      {
        name: "description",
        content:
          "NATA-accredited theological college in Vijayawada, Andhra Pradesh offering C.Th., Dip.Th., B.Th., M.Div., M.Th. and Ph.D. programmes rooted in Scripture.",
      },
      { name: "author", content: "Institute of Christian Studies and Research" },
      // Google Search Console ownership verification
      { name: "google-site-verification", content: "google680fb06ad43f3cff" },
      // Open Graph
      { property: "og:site_name", content: "Institute of Christian Studies and Research" },
      { property: "og:title", content: "Institute of Christian Studies and Research — Vijayawada" },
      {
        property: "og:description",
        content: "Training and equipping ministers of the Gospel in Andhra Pradesh since 2005.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://icsr.org.in/" },
      { property: "og:image", content: "https://icsr.org.in/og-image.jpg" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Institute of Christian Studies and Research — Vijayawada" },
      {
        name: "twitter:description",
        content: "NATA-accredited theological college in Vijayawada, Andhra Pradesh.",
      },
      { name: "twitter:image", content: "https://icsr.org.in/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://icsr.org.in/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..700&family=Inter:wght@300..700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Institute of Christian Studies and Research",
          alternateName: "ICSR",
          url: "https://icsr.org.in/",
          logo: "https://icsr.org.in/favicon.svg",
          description:
            "NATA-accredited theological college in Vijayawada, Andhra Pradesh offering C.Th., Dip.Th., B.Th., M.Div., M.Th. and Ph.D. programmes rooted in Scripture.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Vijayawada",
            addressRegion: "Andhra Pradesh",
            addressCountry: "IN",
          },
          telephone: "+919246470242",
          email: "icsrvja@gmail.com",
          foundingDate: "2005",
          founder: {
            "@type": "Person",
            name: "Rev. David Anil Kumar Jeldi",
            jobTitle: "Founder & Director",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Theological Degree Programmes",
            itemListElement: [
              { "@type": "Course", name: "Certificate in Theology (C.Th.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
              { "@type": "Course", name: "Diploma in Theology (Dip.Th.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
              { "@type": "Course", name: "Bachelor of Theology (B.Th.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
              { "@type": "Course", name: "Master of Divinity (M.Div.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
              { "@type": "Course", name: "Master of Theology (M.Th.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
              { "@type": "Course", name: "Doctor of Philosophy (Ph.D.)", provider: { "@type": "EducationalOrganization", name: "ICSR" } },
            ],
          },
          accreditedBy: {
            "@type": "Organization",
            name: "Nations Association for Theological Accreditation (NATA)",
          },
          sameAs: [
            "https://youtube.com/@studytheologyathome2065",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowBackToTop(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gold z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 ${showBackToTop ? "opacity-100 visible" : "opacity-0 invisible translate-y-4"}`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Toast notifications (application flow feedback) */}
      <Toaster
        theme="dark"
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

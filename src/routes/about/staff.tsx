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

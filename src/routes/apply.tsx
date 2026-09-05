import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ApplyWizard } from "@/components/site/apply/ApplyWizard";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: `Application for Admission | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Apply online for C.Th., Dip.Th., B.Th., M.Div., M.Th. and Ph.D. programmes at ICSR Vijayawada — a NATA-accredited theological college.",
      },
      { property: "og:title", content: `Application for Admission | ${siteConfig.name}` },
      {
        property: "og:description",
        content: "Complete your application in a few guided minutes. Progress saves automatically.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://icsr.org.in/apply" },
    ],
    links: [
      { rel: "canonical", href: "https://icsr.org.in/apply" },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle premium texture behind the whole flow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          background:
            "radial-gradient(60% 40% at 85% -5%, var(--gold), transparent 70%)," +
            "radial-gradient(50% 35% at 0% 100%, color-mix(in oklab, var(--maroon) 80%, transparent), transparent 70%)",
        }}
      />
      <Navbar />
      <main>
        <ApplyWizard />
      </main>
      <Footer />
    </div>
  );
}

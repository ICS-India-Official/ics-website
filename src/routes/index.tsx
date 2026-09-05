import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { HeroSection } from "@/components/site/sections/HeroSection";
import { MissionSection } from "@/components/site/sections/MissionSection";
import { PathwaysSection } from "@/components/site/sections/PathwaysSection";
import { GallerySection } from "@/components/site/sections/GallerySection";
import { FounderSection } from "@/components/site/sections/FounderSection";
import { AdmissionsSection } from "@/components/site/sections/AdmissionsSection";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${siteConfig.name} | NATA Theological College Vijayawada` },
      {
        name: "description",
        content: siteConfig.description,
      },
      { property: "og:title", content: `${siteConfig.name} | NATA Theological College` },
      {
        property: "og:description",
        content: "Formed in the Sanctuary of God — six degree pathways from C.Th. to Ph.D., one mission.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://icsr.org.in/" },
      { property: "og:image", content: "https://icsr.org.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://icsr.org.in/" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main id="top">
        <HeroSection />
        <MissionSection />
        <PathwaysSection />
        <GallerySection />
        <FounderSection />
        <AdmissionsSection />
      </main>
      <Footer />
    </div>
  );
}

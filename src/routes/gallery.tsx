import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GallerySection } from "@/components/site/sections/GallerySection";
import { BackToHome } from "@/components/site/BackToHome";
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-4">
          <BackToHome />
        </div>
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}

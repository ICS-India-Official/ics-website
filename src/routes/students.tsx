import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StudentsDirectory } from "@/components/site/sections/StudentsDirectory";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: `Our Students | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Meet the students of the Institute of Christian Studies & Research — men and women training for ministry across C.Th. to Ph.D. programmes.",
      },
      { property: "og:title", content: `Our Students | ${siteConfig.name}` },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-36">
        <StudentsDirectory />
      </main>
      <Footer />
    </div>
  );
}

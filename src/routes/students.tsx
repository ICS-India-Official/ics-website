import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StudentsDirectory } from "@/components/site/sections/StudentsDirectory";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: `Student Directory | ${siteConfig.name}` },
      {
        name: "description",
        content:
          "Meet the students of the Institute of Christian Studies & Research — men and women training for ministry across B.Th. to Ph.D. programmes in Vijayawada.",
      },
      { property: "og:title", content: `Student Directory | ${siteConfig.name}` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://icsr.org.in/students" },
    ],
    links: [
      { rel: "canonical", href: "https://icsr.org.in/students" },
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

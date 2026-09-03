import { siteConfig } from "@/config/site";
import { Facebook, Youtube, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg">{siteConfig.name}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Equipping the saints for His ministry
          </p>
          <span className="mt-4 inline-flex rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
            NATA Accredited
          </span>
          <div className="mt-6 flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm tracking-[0.2em] text-gold uppercase">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#top" className="hover:text-foreground">
                Home
              </a>
            </li>
            <li>
              <a href="#vision" className="hover:text-foreground">
                Vision
              </a>
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
              <a href="#gallery" className="hover:text-foreground">
                Gallery
              </a>
            </li>
            <li>
              <Link to="/apply" className="hover:text-foreground">
                Admissions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm tracking-[0.2em] text-gold uppercase">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-foreground transition-colors"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.whatsapp} className="hover:text-foreground">
                {siteConfig.phone} (WhatsApp)
              </a>
            </li>
            <li>{siteConfig.location}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-border px-4 pt-6 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}

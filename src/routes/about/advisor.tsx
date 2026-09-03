import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { BackToHome } from "@/components/site/BackToHome";
import advisorImg from "@/assets/advisor-bishop-suneel-busi.png";
import {
  Sparkles,
  Quote,
  CheckCircle2,
  Compass,
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
            <div className="mb-6 flex items-center justify-between">
              <BackToHome className="border-white/20 bg-black/40 text-gold hover:bg-gold hover:text-black" />
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <Compass className="h-3.5 w-3.5" />
                About Us · Senior Advisory
              </div>
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

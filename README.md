# Golden Foundations

Build a website for "Institute of Christian Studies" (ICS), a NATA-accredited theological college in Vijayawada, Andhra Pradesh. Clone the design below exactly — layout, copy, section order, and color/typography feel. Mobile-first, fully responsive.

=== DESIGN SYSTEM ===

- Primary dark background: deep navy (#0B1226)
- Accent color: warm gold/amber (used for "Apply Now" buttons, highlighted words like "Scripture" and "Jesus" in body text, and small accent icons)
- Secondary background: warm cream/off-white (used for the "Four Degree Pathways" and gallery sections)
- Testimonial section background: deep maroon/burgundy
- Headings: large serif display font (classic, academic feel — e.g. Playfair Display or similar)
- Body text: clean sans-serif
- Buttons: pill-shaped, gold fill on dark backgrounds, dark outline/fill on light backgrounds
- Generous whitespace, one section per full-width block, rounded corners on cards (~12-16px)

=== NAVIGATION ===
Fixed/sticky top nav on dark background: logo/wordmark left ("Institute of Christian Studies"), nav links (Home, Programs, Apply), gold "Apply Now" button right.

=== SECTION 1: HERO ===

- Full-bleed background image: gothic cathedral / sanctuary interior, dark navy overlay
- Large serif headline: "Formed in the Sanctuary of God"
- Two CTA buttons: "Apply for Admission" (gold, primary) and "Explore Programs" (outline, secondary)
- Stats row below hero (4 columns):
  1. "4" — label "Degree Pathways"
  2. "B.Th → Ph.D" — label "Full Academic Ladder"
  3. "NATA" — label "Accredited"
  4. "100%" — label "Faith-Based Curriculum"

=== SECTION 2: MISSION STATEMENT ===
Dark navy background, centered large serif text:
"The Institute of Christian Studies is committed to training and equipping ministers of the Gospel — grounded in the authority of Scripture and the person of Jesus Christ, formed not just in mind, but in whole person, for Kingdom service."

SCROLL EFFECT (important): This text starts dim/low-opacity (e.g. 20-30% opacity, muted gray) and brightens word-by-word (or letter-by-letter) to full white/gold as the user scrolls the section into view — a scroll-progress-linked reveal, not a timed animation. Use IntersectionObserver + scroll position to map scroll progress (0→1) to how many words/letters are lit up. Highlight "Scripture" and "Jesus Christ" permanently in gold once revealed.

Below it, 4 numbered pillars in a row:
01 — Scripture-Centered — "All teaching rooted in the inerrant Word of God."
02 — Christ-Forward
03 — Mission-Focused
04 — NATA Accredited
(Use the same numbered "01/02/03/04" label style as shown for pillar 01.)

=== SECTION 3: DEGREE PATHWAYS ===
Cream background. Heading: "Four Degree Pathways. One Mission."
Subheading: "From foundational theology to doctoral research — every program shaped by Scripture, anchored in the local church."

Tab selector with 4 tabs: B.Th. (default active), M.Div., M.Th., Ph.D.
Each tab swaps the card + accordion below it. Use this exact data:

--- TAB 1: B.Th. Program ---
Title: Bachelor of Theology
Description: "An undergraduate foundation in biblical, theological and ministerial studies — the first step into vocational ministry. Builds language proficiency, ecclesiology and Christian living."
Tags/details: Undergraduate | 3 Years (Duration) | 6 Semesters | ₹7,000 / year (Tuition)
Button: "Apply to B.Th."
Semester accordion (6 semesters):

- Semester 1: Old Testament Survey, New Testament Survey, Theology Proper, Spiritual Life & Christian Ethics, Evangelism, Elementary Greek 1
- Semester 2: Pentateuch, Gospels, Bibliology, Hinduism, Homiletics, Elementary Greek 2
- Semester 3: Historical Books, Acts, Christology, Children Ministry, Early Church History, Elementary Greek 3
- Semester 4: Poetical Books, Pauline Epistles, Pneumatology, Youth Ministry, Medieval Church History, Elementary Hebrew 1
- Semester 5: Major Prophets, Non-Pauline Epistles, Angelology, Leadership, Reformed Church History, Elementary Hebrew 2
- Semester 6: Minor Prophets, Revelation, Eschatology, Discipleship, Indian Church History, Elementary Hebrew 3

--- TAB 2: M.Div. Program ---
Title: Master of Divinity
Description: "A graduate-level pastoral and theological formation programme equipping students for ordained ministry, church planting and full-time vocational service."
Tags/details: Graduate · Ministry track | 2 Years (Duration) | 4 Semesters | ₹10,000 / year (Tuition)
Button: "Apply to M.Div."
Semester accordion (4 semesters):

- Semester 1: Pentateuch, Gospels, Theology Proper, Bibliology, Spiritual Life & Christian Ethics, Evangelism, Hinduism, Elementary Greek 1
- Semester 2: Historical Books, Acts, Christology, Pneumatology, Children & Youth Ministry, Homiletics, Islam, Elementary Greek 2
- Semester 3: Poetical Books, Pauline & Non-Pauline Epistles, Soteriology, Ecclesiology, Leadership, Discipleship, Early & Medieval Church History, Elementary Hebrew 1
- Semester 4: Major & Minor Prophets, Revelation, Eschatology, Angelology, Pastoral Ministry, Church Planting & Church Growth, Reformed & Indian Church History, Elementary Hebrew 2

--- TAB 3: M.Th. Program ---
Title: Master of Theology
Description: "An advanced post-graduate degree refining exegetical, theological and pastoral skill. Designed for scholar-pastors and future seminary faculty."
Tags/details: Post-graduate · Research-oriented | 2 Years (Duration) | 4 Semesters | ₹11,500 / year (Tuition)
Button: "Apply to M.Th."
Semester accordion (4 semesters):

- Semester 1: Pentateuch, Gospels, Theology Proper, Bibliology, Spiritual Life & Christian Ethics, Evangelism, Hinduism & Islam, Elementary Greek 1
- Semester 2: Historical Books, Acts, Christology, Pneumatology, Children & Youth Ministry, Homiletics, Leadership & Discipleship, Elementary Greek 2
- Semester 3: Poetical Books, Pauline & Non-Pauline Epistles, Soteriology, Ecclesiology, Pastoral Ministry, Hermeneutics, Early & Medieval Church History, Elementary Hebrew 1
- Semester 4: Major & Minor Prophets, Revelation, Eschatology, Angelology, Church Planting & Church Growth, Reformed & Indian Church History, Elementary Hebrew 2, Thesis

--- TAB 4: Ph.D. Program ---
Title: Doctor of Philosophy
Description: "An original-research doctorate. Designed for academic theologians, seminary professors and senior ministry leaders pursuing the highest level of scholarly contribution to the Indian church."
Tags/details: Doctoral · Research & Thesis | 2 Years (Duration) | 4 Semesters | ₹12,500 / year (Tuition)
Button: "Apply to Ph.D."
Semester accordion (4 semesters, last one is thesis-only):

- Semester 1: Old Testament Exegesis, Theology Proper, Bibliology, Christology, Pneumatology, Religions: Hinduism, Islam, Jainism, Sikhism
- Semester 2: New Testament Exegesis, Eschatology, Angelology, Soteriology, Ecclesiology, Church History: Early, Medieval, Reformed, Modern (Indian), Hebrew
- Semester 3: Research Methodology, Indian Christian Theology, Missiology, Contemporary Issues: Dalit, Women & Children, Initial Research Proposal
- Semester 4 (labeled "Thesis"): "Full semester dedicated to original doctoral research and thesis completion under faculty supervision."

Accordion behavior: only one semester open at a time, smooth expand/collapse, "Semester 0X" as the collapsed label with a "+" icon that rotates to "×" when open.

=== SECTION 4: CAMPUS LIFE GALLERY ===
Cream background. Heading: "A place to learn, worship & grow."
Subheading: "The seminary is more than a classroom — it's a sanctuary of study, prayer, and brotherhood/sisterhood shaped through lifelong friendships and ministry partnerships forged in the Spirit."

Image grid (mix of large and small cards, masonry-style):

- Large: "Library & Study"
- Large: "Chapel & Worship"
- Medium: "Classroom Learning"
- Small: "Convocation Day"
- Small: "Graduation Ceremony"
- Small: "Campus Walks"
  Use stock/placeholder images matching each label (library interior, chapel, classroom, graduation).

=== SECTION 5: TESTIMONIAL ===
Full-width maroon/burgundy background. Portrait photo on left (or top on mobile). Quote in white serif text:
"ICS did not merely teach me theology — it formed me. The classrooms were rigorous, the chapel was holy ground, and the faculty walked with me like fathers. I left ready to preach Christ and to plant the church He purchased with His own blood."
Attribution: "Rev. Stephen K." — "ICS Alumni, Minister"

=== SECTION 6: ADMISSIONS CALL / CONTACT FORM ===
Dark navy background. Heading: "Book your admissions call."
Left column — contact details:

- Location: Vijayawada, Andhra Pradesh
- Email: ics@gmail.com (placeholder, swap in real one)
- Phone: +91 93066 70242

Right column — form:

- Full Name (text input)
- Email (text input)
- "Confirm Program" dropdown — options: B.Th., M.Div., M.Th., Ph.D.
- Gold submit button: "Request Admissions Call"

=== SECTION 7: FOOTER ===
Dark navy. Columns:

1. "Institute of Christian Studies" + short one-line description + NATA Accredited badge
2. "Quick Links": Admissions Page, Programs, Campus Life, Admissions
3. "Contact": Email, Phone/WhatsApp, Campus address (Vijayawada, Andhra Pradesh)
   Bottom bar: copyright line "© 2026 Institute of Christian Studies. All rights reserved."
   Floating WhatsApp button (green circle, bottom-right corner, fixed position, visible on all pages/scroll).

=== TECH REQUIREMENTS ===

- React + Tailwind CSS
- Fully responsive: mobile-first, extend to wider multi-column layouts on tablet/desktop for the stats row, degree pathway tabs, and gallery
- Scroll-linked text reveal animation for the mission statement (Section 2) — implement with IntersectionObserver/scroll progress, not a fixed-duration animation
- Smooth scroll, subtle fade-in animations on other section entries
- Tabbed program switcher (Section 3) with accordion component per program for semester course lists (expand/collapse, one open at a time)
- Sticky/fixed nav bar with WhatsApp float button
- All placeholder images should use high-quality stock photography matching each caption (cathedral/sanctuary, library, chapel, classroom, graduation)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://golden-pathways-gateway.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f72e5fa-0ef3-45f4-9236-292f87112dae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

---

## Admissions Backend (PostgreSQL)

The two-stage application flow persists to PostgreSQL:

1. **Stage 1** (home page card / /apply gate): name, mobile, email -> pplication_leads
2. **Stage 2** (/apply wizard): full application -> pplications (linked back to its lead)

### Setup

1. Provision any managed Postgres (Neon, Supabase, RDS) and copy the pooled connection string.
2. Set the environment variable:

   `DATABASE_URL=postgres://user:pass@host/db?sslmode=require`

   Locally: copy .env.example to .env. On Render it is set in the dashboard (see
   ender.yaml). On Lovable/Cloudflare add it as a secret.

3. Tables are created automatically on first request. The canonical schema lives in db/schema.sql.

### Behavior without a database

If DATABASE_URL is unset or unreachable, applications are never lost: the server logs the payload for manual recovery, the applicant still receives a reference number (ICS-YYYY-XXXXXX), and drafts survive in the browser via localStorage.

### API surface

| Route            | Method | Purpose                  |
| ---------------- | ------ | ------------------------ |
| /api/lead        | POST   | Stage-1 basic details    |
| /api/application | POST   | Stage-2 full application |

### Staff Console (`/admin`)

Passcode-protected dashboard for the admissions office:

- **Applications table** — every submission with reference code, applicant, course, inline
  status control (`submitted → under_review → accepted → rejected → enrolled`), internal
  notes, and an **Enrol** action that converts an accepted application into a student.
- **Students register** — add students manually, change status (active / alumni / withdrawn),
  toggle inclusion in the public directory, or remove entries.
- Live stats (applications, pending review, students, enquiries).

Set `ADMIN_PASSCODE` in the environment (Render → Environment, or `.env` locally).
The page is `noindex`; sessions are signed, HttpOnly cookies expiring after 12 hours.

### Public students directory (`/students`)

A dedicated section listing enrolled students who have consented
(`public_directory = true`, toggled in the Staff Console), grouped by programme.
Only names, course, city and status are exposed — never contact details.

// Admissions.tsx
import React, { useEffect, useRef } from "react";
import "./Admissions.css";

type DateItem = { title: string; date: string };

const IMPORTANT_DATES: DateItem[] = [
  { title: "Applications open", date: "To be announced" },
  { title: "Last date to apply", date: "To be announced" },
  { title: "Interviews/Assessment", date: "To be announced" },
  { title: "Final results", date: "To be announced" },
];

type CourseCard = {
  sno: number;
  title: string;
  duration: string;
  qualification: string;
  seatsLeft: number;
};

const COURSE_CARDS: CourseCard[] = [
  {
    sno: 1,
    title: "Advanced Diploma in Hotel Management",
    duration: "18 months (12 + 6)",
    qualification: "10th / 12th Pass or Fail",
    seatsLeft: 12,
  },
  {
    sno: 2,
    title: "Diploma in Hotel Management",
    duration: "12 months (8 + 4)",
    qualification: "10th / 12th Pass or Fail",
    seatsLeft: 10,
  },
  {
    sno: 3,
    title: "Post-Graduation Diploma in Hotel Management",
    duration: "12 months (8 + 4)",
    qualification: "Degree / PG",
    seatsLeft: 8,
  },
  {
    sno: 4,
    title: "Diploma in F&B Service & Housekeeping",
    duration: "12 months (6 + 6)",
    qualification: "10th / 12th Pass or Fail",
    seatsLeft: 9,
  },
  {
    sno: 5,
    title: "Diploma in F&B Service",
    duration: "6 months (3 + 3)",
    qualification: "10th / 12th Standard / Degree / PG",
    seatsLeft: 7,
  },
  {
    sno: 6,
    title: "Diploma in Front Office",
    duration: "6 months (3 + 3)",
    qualification: "10th / 12th Standard / Degree / PG",
    seatsLeft: 6,
  },
  {
    sno: 7,
    title: "Diploma in Housekeeping",
    duration: "6 months (3 + 3)",
    qualification: "10th (Pass/Fail)",
    seatsLeft: 5,
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const fillFromSeats = (seatsLeft: number) => {
  const fill = 100 - seatsLeft * 2.5;
  return clamp(fill, 70, 94);
};

/* =========================
   SAME animation as About/Courses
   ========================= */

function useStaggerReveal() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-anim]"));
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-group]"));
    const inGroup = new Set<HTMLElement>();

    groups.forEach((group) => {
      const groupEls = Array.from(group.querySelectorAll<HTMLElement>("[data-anim]"));
      groupEls.forEach((el, idx) => {
        inGroup.add(el);
        el.style.setProperty("--stagger", String(idx));
      });
    });

    let i = 0;
    els.forEach((el) => {
      if (inGroup.has(el)) return;
      el.style.setProperty("--stagger", String(i++));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return rootRef;
}

function useParallax() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;

      for (const el of els) {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const t = (center - vh / 2) / (vh / 2);
        const clamped = Math.max(-1, Math.min(1, t));

        const y = clamped * -10;
        const r = clamped * 0.6;
        el.style.setProperty("--py", `${y}px`);
        el.style.setProperty("--pr", `${r}deg`);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return rootRef;
}

/* ========================= */

export default function Admissions(): JSX.Element {
  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();

  // ✅ FIX: callback ref so both hooks get correct DOM node
  const setRootRef = (node: HTMLDivElement | null) => {
    (revealRef as any).current = node;
    (parallaxRef as any).current = node;
  };

  // ✅ Enable animation only after JS loads (prevents reload weirdness)
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  return (
    <div className="admissions" ref={setRootRef}>
      <div className="admissions__container">
        {/* ✅ HERO */}
        <section className="coursesHeroX" data-anim-group>
          <div className="heroXInner">
            <div className="heroXLeft">
              <h1 className="heroXTitle" data-anim="rise">
                Admissions Open for{" "}
                <span className="heroXHighlight">Hotel Management Programs</span>{" "}
                – Build Your Future in Hospitality.
              </h1>

              <p className="heroXSub" data-anim="rise">
                Join INSPIRE Institute of Hotel Management & Career and take the
                first step toward a successful hospitality career with industry-based
                training, internship opportunities, and complete career guidance.
                Limited seats available for the upcoming batch.
              </p>

              <div className="heroXBtns" data-anim="pop">
                <a className="heroXBtnPrimary" href="#apply">
                  Apply Now
                </a>
                <a className="heroXBtnGhost" href="#enquire">
                  Download Prospectus
                </a>
              </div>

              <div className="heroXBadges" data-anim="rise">
                {[
                  { top: "Admissions Open", bottom: "Limited seats available" },
                  { top: "2026 Batch", bottom: "Enroll today" },
                  { top: "Scholarships", bottom: "Merit-based support" },
                  { top: "Career Placement", bottom: "Industry assistance" },
                ].map((b, idx) => (
                  <div key={b.top} className="heroXBadge" data-anim="pop" style={{ ["--stagger" as any]: idx }}>
                    <div className="heroXBadgeTop">{b.top}</div>
                    <div className="heroXBadgeBottom">{b.bottom}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="heroXRight">
              <div className="heroXImageCard" data-anim="slideR" data-parallax>
                <img src="/images/wow11.png" alt="Admissions Open - Hospitality Training" />
                <div className="heroXImageOverlay">
                  <div className="heroXOverlayTitle">Admissions 2026 • INSPIRE ICHM–Armoor</div>
                  <div className="heroXOverlaySub">
                    Apply Now • Limited Seats • Shape Your Hospitality Career
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ COURSES GRID */}
        <section className="admissions__section admissions__courses" id="courses" data-anim-group>
          <div className="admissions__sectionHead" data-anim="rise">
            <div className="admissions__seatHeader">
              <div>
                <h2 className="admissions__sectionTitle">Admissions Offered</h2>
                <p className="admissions__sectionHint">
                  Choose your program and apply early. Seats are limited for each course.
                </p>
              </div>

              <div className="admissions__hurry" data-anim="pop">
                <span className="admissions__hurryDot" />
                Hurry up! Limited seats available
              </div>
            </div>
          </div>

          <div className="admissions__courseGrid">
            {COURSE_CARDS.map((c, idx) => {
              const fill = fillFromSeats(c.seatsLeft);
              const tone = c.seatsLeft <= 5 ? "danger" : c.seatsLeft <= 8 ? "warn" : "safe";

              return (
                <article
                  className="admissions__courseCard"
                  key={c.sno}
                  data-anim={idx % 2 === 0 ? "slideL" : "slideR"}
                  style={{ ["--stagger" as any]: idx }}
                >
                  <div className="admissions__courseTop">
                    <div className="admissions__courseSno">#{c.sno}</div>
                    <div className={`admissions__courseSeat admissions__courseSeat--${tone}`}>
                      {c.seatsLeft} Seats Left
                    </div>
                  </div>

                  <h3 className="admissions__courseTitle">{c.title}</h3>

                  <div className="admissions__courseMeta">
                    <div className="admissions__metaItem">
                      <div className="admissions__metaLabel">Duration</div>
                      <div className="admissions__metaValue">{c.duration}</div>
                    </div>

                    <div className="admissions__metaItem">
                      <div className="admissions__metaLabel">Minimum qualification required</div>
                      <div className="admissions__metaValue">{c.qualification}</div>
                    </div>
                  </div>

                  <div className="admissions__courseBarWrap" aria-label="Seat fill">
                    <div className="admissions__courseBar">
                      <span
                        className={`admissions__courseFill admissions__courseFill--${tone}`}
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <div className="admissions__courseBarText">
                      {Math.round(fill)}% filled • Apply soon
                    </div>
                  </div>

                  <div className="admissions__courseActions">
                    <a className="admissions__courseBtn admissions__courseBtn--primary" href="#enquire">
                      Apply Now
                    </a>
                    <a className="admissions__courseBtn admissions__courseBtn--ghost" href="#enquire">
                      Enquire
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* PROCESS */}
        <section className="admissions__section" data-anim-group>
          <div className="admissions__sectionHead" data-anim="rise">
            <h2 className="admissions__sectionTitle">How the process works</h2>
            <p className="admissions__sectionHint">
              A simple, transparent flow—so you always know what happens next.
            </p>
          </div>

          <div className="admissions__grid admissions__grid--3">
            {[
              { title: "1) Apply", pill: "Step 01", text: "Submit the application form along with the required documents." },
              { title: "2) Review", pill: "Step 02", text: "Our team verifies eligibility and may schedule an interaction if needed." },
              { title: "3) Confirmation", pill: "Step 03", text: "You’ll receive confirmation and the next steps for enrollment." },
            ].map((p, idx) => (
              <article
                key={p.title}
                className="admissions__card"
                data-anim="pop"
                style={{ ["--stagger" as any]: idx }}
              >
                <div className="admissions__cardTop">
                  <h3 className="admissions__cardTitle">{p.title}</h3>
                  <span className="admissions__pill">{p.pill}</span>
                </div>
                <p className="admissions__cardText">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* DATES + REQUIREMENTS */}
        <section className="admissions__section" data-anim-group>
          <div className="admissions__sectionHead" data-anim="rise">
            <h2 className="admissions__sectionTitle">Dates &amp; requirements</h2>
            <p className="admissions__sectionHint">
              This layout is ready—swap “To be announced” with your actual dates later.
            </p>
          </div>

          <div className="admissions__grid admissions__grid--2">
            <article className="admissions__card" data-anim="slideL">
              <div className="admissions__cardTop">
                <h3 className="admissions__cardTitle">Important dates</h3>
                <span className="admissions__pill">Timeline</span>
              </div>

              <div className="admissions__dates">
                {IMPORTANT_DATES.map((item, idx) => (
                  <div
                    className="admissions__dateRow"
                    key={item.title}
                    data-anim="fade"
                    style={{ ["--stagger" as any]: idx }}
                  >
                    <div className="admissions__dateRowTitle">{item.title}</div>
                    <div className="admissions__dateRowDate">{item.date}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="admissions__card" data-anim="slideR">
              <div className="admissions__cardTop">
                <h3 className="admissions__cardTitle">Eligibility &amp; documents</h3>
                <span className="admissions__pill">Checklist</span>
              </div>

              <ul className="admissions__list">
                {[
                  "Academic transcripts / mark sheets",
                  "Government-issued ID proof",
                  "Passport-size photograph",
                  "Address proof (if required)",
                  "Any additional supporting documents",
                ].map((t, idx) => (
                  <li key={t} data-anim="rise" style={{ ["--stagger" as any]: idx }}>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="admissions__tip" role="note" data-anim="pop">
                Tip: Keep scanned PDFs under 2–5MB each for smoother uploads.
              </div>
            </article>
          </div>
        </section>

        {/* CONTACT */}
        <section className="admissions__section" id="enquire" data-anim-group>
          <div className="admissions__sectionHead" data-anim="rise">
            <h2 className="admissions__sectionTitle">Contact Admissions</h2>
            <p className="admissions__sectionHint">
              Not sure about eligibility, documents, or deadlines? Reach out.
            </p>
          </div>

          <article className="admissions__card" data-anim="rise">
            <div className="admissions__grid admissions__grid--2">
              <div data-anim="slideL">
                <div className="admissions__strong">Admissions Office</div>
                <div className="admissions__muted">
                  Email: info@inspirecollegehm.com <br />
                  Phone: +91-8374382391 <br />
                  Hours: Mon–Fri, 9:30 AM – 5:30 PM
                </div>
              </div>

              <div className="admissions__callout" data-anim="slideR">
                <div className="admissions__strong">Quick question?</div>
                <div className="admissions__muted">
                  Share your program, qualification, and city. We’ll guide you on the next step.
                </div>
              </div>
            </div>
          </article>

          <div className="admissions__helpStrip" data-anim="pop">
            <p className="admissions__helpStripText">
              Need help choosing a program or understanding the process?
            </p>
            <button className="admissions__btn admissions__btn--ghost" type="button">
              Request a Callback
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// courses.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./courses.css";

type CourseTag = "All" | "Diploma" | "Advanced" | "PG" | "Short-Term";

type Course = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  eligibility: string;
  tag: Exclude<CourseTag, "All">;
  highlights: string[];
  subjects?: string[];
  image: string;
};

const COURSES: Course[] = [
  {
    id: "adv-dhm",
    title: "Advanced Diploma in Hotel Management",
    subtitle:
      "Comprehensive hospitality program covering hotel operations, service standards, and practical exposure.",
    duration: "18 Months (12 + 6)",
    eligibility: "10th / 12th Pass or Fail",
    tag: "Advanced",
    highlights: [
      "Hotel operations & guest handling",
      "Service standards & professionalism",
      "Internship & career support",
    ],
    image: "/images/wow2.png",
  },
  {
    id: "dhm",
    title: "Diploma in Hotel Management",
    subtitle:
      "Core hotel management diploma with operational training, soft skills, and internship exposure.",
    duration: "12 Months (8 + 4)",
    eligibility: "10th / 12th Pass or Fail",
    tag: "Diploma",
    highlights: [
      "Front Office, Housekeeping, Food Production",
      "F&B Service + soft skills",
      "Internship included",
    ],
    subjects: [
      "Front Office",
      "Housekeeping",
      "Food Production",
      "Food & Beverage Service",
      "Communications & Soft Skills",
      "Computer Applications",
      "Internship",
    ],
    image: "/images/wow3.png",
  },
  {
    id: "pg-dhm",
    title: "Post-Graduation Diploma in Hotel Management",
    subtitle:
      "Advanced hotel management program for graduates with hygiene standards and practical internship.",
    duration: "12 Months (8 + 4)",
    eligibility: "Degree / PG",
    tag: "PG",
    highlights: [
      "Advanced operations + hygiene & sanitation",
      "Leadership & communication skills",
      "Internship included",
    ],
    subjects: [
      "Front Office",
      "Housekeeping",
      "Food Production",
      "Food & Beverage Service",
      "Hygiene & Sanitation",
      "Communications & Soft Skills",
      "Computer Applications",
      "Internship",
    ],
    image: "/images/wow4.png",
  },
  {
    id: "fnb-hk-12",
    title: "Diploma in F&B Service & Housekeeping",
    subtitle:
      "Focused program combining housekeeping and F&B service with structured internship exposure.",
    duration: "12 Months (6 + 6)",
    eligibility: "10th / 12th Pass or Fail",
    tag: "Diploma",
    highlights: [
      "Housekeeping procedures & standards",
      "F&B service basics and practical skills",
      "Internship included",
    ],
    subjects: ["Housekeeping", "Food & Beverage Service", "Internship"],
    image: "/images/wow5.png",
  },
  {
    id: "fnb-6",
    title: "Diploma in F&B Service",
    subtitle:
      "Short-term course for restaurant service, banquets, and hotel F&B department readiness.",
    duration: "6 Months (3 + 3)",
    eligibility: "10th / 12th Standard / Degree / PG",
    tag: "Short-Term",
    highlights: ["Service etiquette & standards", "Restaurant & banquet operations", "Career readiness"],
    image: "/images/wow6.png",
  },
  {
    id: "fo-6",
    title: "Diploma in Front Office",
    subtitle:
      "Short-term program focused on reception, guest relations, reservations, and front office operations.",
    duration: "6 Months (3 + 3)",
    eligibility: "10th / 12th Standard / Degree / PG",
    tag: "Short-Term",
    highlights: ["Guest handling & communication", "Reservations & billing basics", "Professional grooming"],
    image: "/images/wow7.png",
  },
  {
    id: "hk-6",
    title: "Diploma in Housekeeping",
    subtitle:
      "Short-term course covering cleanliness standards, room upkeep, and housekeeping department basics.",
    duration: "6 Months (3 + 3)",
    eligibility: "10th Pass",
    tag: "Short-Term",
    highlights: ["Room cleaning standards", "Hygiene practices", "Department workflow basics"],
    image: "/images/slider6.png",
  },
];

const TAGS: CourseTag[] = ["All", "Diploma", "Advanced", "PG", "Short-Term"];

/* =========================
   SAME animation as About
   ========================= */

function useStaggerReveal() {
  const rootRef = useRef<HTMLElement | null>(null);

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
  const rootRef = useRef<HTMLElement | null>(null);

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

export default function Courses() {
  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();

  // ✅ FIX: callback ref (prevents null refs on Vercel)
  const setRootRef = (node: HTMLElement | null) => {
    (revealRef as any).current = node;
    (parallaxRef as any).current = node;
  };

  // ✅ same as About: enable animations only when JS runs
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  const [activeTag, setActiveTag] = useState<CourseTag>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const visibleCourses = useMemo(() => {
    if (activeTag === "All") return COURSES;
    return COURSES.filter((c) => c.tag === activeTag);
  }, [activeTag]);

  const toggleDetails = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="coursesPage" ref={setRootRef as any}>
      {/* HERO */}
      <section className="coursesHeroX" data-anim-group>
        <div className="heroXInner">
          <div className="heroXLeft">
            <h1 className="heroXTitle" data-anim="rise">
              Start your hospitality career with{" "}
              <span className="heroXHighlight">practical training</span>,{" "}
              <span className="heroXHighlight">industry exposure</span>, and{" "}
              <span className="heroXHighlight">internship support</span>.
            </h1>

            <p className="heroXSub" data-anim="rise">
              INSPIRE Institute of Hotel Management & Career helps students build
              job-ready skills through hands-on learning, modern curriculum, and
              real-world hospitality experience.
            </p>

            <div className="heroXBtns" data-anim="pop">
              <a className="heroXBtnPrimary" href="#courses">
                Explore Courses
              </a>
              <a className="heroXBtnGhost" href="#enquire">
                Enquire Now
              </a>
            </div>

            <div className="heroXBadges" data-anim="rise">
              {[
                { top: "Skill-first", bottom: "Industry-focused training" },
                { top: "Internship", bottom: "Practical exposure" },
                { top: "Career Support", bottom: "Guidance & preparation" },
                { top: "Hands-on", bottom: "Learning approach" },
              ].map((b, idx) => (
                <div
                  key={b.top}
                  className="heroXBadge"
                  data-anim="pop"
                  style={{ ["--stagger" as any]: idx }}
                >
                  <div className="heroXBadgeTop">{b.top}</div>
                  <div className="heroXBadgeBottom">{b.bottom}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="heroXRight">
            <div className="heroXImageCard" data-anim="slideR" data-parallax>
              <img src="/images/wow11.png" alt="Hospitality training" />
              <div className="heroXImageOverlay">
                <div className="heroXOverlayTitle">INSPIRE • ICHM–Armoor</div>
                <div className="heroXOverlaySub">
                  Professional learning • Practical training • Global careers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP */}
      <header className="coursesTop" data-anim-group>
        <h1 className="topTitle" data-anim="rise">
          <span className="topUnderline">Academic Courses</span>
        </h1>
        <p className="topSub" data-anim="fade">
          Explore our industry-focused programs designed for real careers.
        </p>

        <div
          className="filtersRow"
          role="tablist"
          aria-label="Course categories"
          data-anim="pop"
        >
          {TAGS.map((tag) => {
            const selected = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                className={`filterPill ${selected ? "isActive" : ""}`}
                onClick={() => {
                  setActiveTag(tag);
                  setOpenId(null);
                }}
                role="tab"
                aria-selected={selected}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </header>

      {/* LIST */}
      <main className="coursesList" id="courses" data-anim-group>
        {visibleCourses.map((course, idx) => {
          const isOpen = openId === course.id;

          return (
            <section
              key={course.id}
              className="courseRow"
              data-anim={idx % 2 === 0 ? "slideL" : "slideR"}
              style={{ ["--stagger" as any]: idx }}
            >
              <img src={course.image} alt={course.title} className="rowBgImage" />
              <div className="rowOverlay" />

              <div className="rowContent">
                <div className="rowLeft">
                  <div className="rowTag">{course.tag}</div>

                  <h2 className="rowTitle">{course.title}</h2>
                  <p className="rowSubtitle">{course.subtitle}</p>

                  <ul className="rowChecks">
                    <li>
                      <span className="checkIcon">✓</span>
                      <span>
                        <b>Duration:</b> {course.duration}
                      </span>
                    </li>
                    <li>
                      <span className="checkIcon">✓</span>
                      <span>
                        <b>Eligibility:</b> {course.eligibility}
                      </span>
                    </li>

                    {course.highlights.map((h) => (
                      <li key={h}>
                        <span className="checkIcon">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rowFooter">
                    <span className="rowPill">
                      {course.duration} • {course.eligibility}
                    </span>

                    <div className="rowBtns">
                      <button
                        className="btnRow btnGhost"
                        type="button"
                        onClick={() => toggleDetails(course.id)}
                        aria-expanded={isOpen}
                        aria-controls={`details-${course.id}`}
                      >
                        {isOpen ? "Hide Details" : "View Details"}
                      </button>

                      <a className="btnRow btnPrimary" href="#enquire">
                        Enquire <span className="arrow">→</span>
                      </a>
                    </div>
                  </div>

                  <div
                    id={`details-${course.id}`}
                    className={`rowDetails ${isOpen ? "open" : ""}`}
                  >
                    {course.subjects?.length ? (
                      <>
                        <h3 className="detailsTitle">Subjects</h3>
                        <div className="subjectsGrid">
                          {course.subjects.map((s) => (
                            <span key={s} className="subjectChip">
                              {s}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="detailsNote">
                        Subject details will be shared during enquiry.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Enquire CTA */}
      <section className="enquireSection" id="enquire" data-anim-group>
        <div className="enquireInner" data-anim="rise">
          <div>
            <h2 className="enquireTitle">Admissions Open</h2>
            <p className="enquireSub">
              Send your details and we’ll guide you to the right program.
            </p>
          </div>

          <div className="enquireActions" data-anim="pop">
            <a className="btnRow btnPrimary" href="/apply">
              Apply Now <span className="arrow">→</span>
            </a>
            <a className="btnRow btnGhostLight" href="/brochure">
              Download Brochure
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

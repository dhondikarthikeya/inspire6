// faculty.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./faculty.css";

type FacultyMember = {
  id: string;
  name: string;
  designation: string;
  dept: string;
  years: string;
  bio: string;
  img: string;
  linkedin?: string;
  email?: string;
};

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 8.5H4.5V23H0.5V8.5zM8.5 8.5H12.3V10.4H12.35C12.88 9.43 14.18 8.4 16.1 8.4 20.15 8.4 20.9 11.06 20.9 14.5V23H16.9V15.4C16.9 13.59 16.87 11.25 14.35 11.25 11.79 11.25 11.4 13.26 11.4 15.27V23H7.4V8.5H8.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

/* =========================
   Scroll reveal + stagger
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

    // Reduced motion: show everything
    if (prefersReduced) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // Stagger per group
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-group]"));
    const inGroup = new Set<HTMLElement>();

    groups.forEach((group) => {
      const groupEls = Array.from(group.querySelectorAll<HTMLElement>("[data-anim]"));
      groupEls.forEach((el, idx) => {
        inGroup.add(el);
        el.style.setProperty("--stagger", String(idx));
      });
    });

    // Fallback stagger outside groups
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

/* =========================
   Optional parallax
   ========================= */
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

        const y = clamped * -10; // px
        const r = clamped * 0.6; // deg
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

/* Merge multiple refs into one */
function useMergedRefs<T extends HTMLElement>(...refs: React.RefObject<T>[]) {
  const merged = useRef<T | null>(null);

  useEffect(() => {
    refs.forEach((r) => ((r as any).current = merged.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return merged;
}

export default function Faculty() {
  const [heroImgOk, setHeroImgOk] = useState(true);

  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();
  const rootRef = useMergedRefs(revealRef as any, parallaxRef as any);

  const faculty = useMemo<FacultyMember[]>(
    () => [
      {
        id: "f4",
        name: "Mr. Gunnala Ranjith Kumar",
        designation: "HEAD OF DEPARTMENT",
        dept: "Housekeeping HOD",
        years: "10+ Years",
        bio: "Detail-oriented housekeeping specialist with expertise in guest room management and cleanliness.",
        img: "/images/faculty/f4.png",
        linkedin: "#",
        email: "mailto:info@example.com",
      },
      {
        id: "f1",
        name: "Prof. Anil Sharma",
        designation: "Head of Department",
        dept: "Food Production",
        years: "15+ Years",
        bio: "Expert chef with extensive industry experience in culinary arts and kitchen management.",
        img: "/images/faculty/f1.png",
        linkedin: "#",
        email: "mailto:info@example.com",
      },
      {
        id: "f2",
        name: "Ms. Priya Kapoor",
        designation: "Lecturer",
        dept: "Front Office",
        years: "10+ Years",
        bio: "Experienced hospitality professional with a passion for guest relations and front desk operations.",
        img: "/images/faculty/f2.png",
        linkedin: "#",
        email: "mailto:info@example.com",
      },
      {
        id: "f3",
        name: "Prof. Rohit Verma",
        designation: "Head of Department",
        dept: "Hospitality Management",
        years: "20+ Years",
        bio: "Seasoned hotel management expert dedicated to student success and hospitality leadership.",
        img: "/images/faculty/f3.png",
        linkedin: "#",
        email: "mailto:info@example.com",
      },
      
    ],
    []
  );

  const labs = useMemo(
    () => [
      {
  title: "Food Production Lab",
  desc: "Advanced culinary training kitchen designed for hands-on cooking, food preparation, and professional kitchen operations practice.",
  img: "/images/labs/lab1.jpg",
  chips: ["Industry Tools", "Practice Stations"],
},
{
  title: "F&B Service Lab",
  desc: "Dedicated training space for food and beverage service, focusing on table setup, guest handling, service techniques, and hospitality standards.",
  img: "/images/labs/lab2.jpg",
  chips: ["Industry Tools", "Service Setup"],
},
{
  title: "Computer Lab",
  desc: "Modern computer facility equipped with updated systems and software for hospitality management, research, and digital learning support.",
  img: "/images/labs/lab3.jpg",
  chips: ["Industry Tools", "Digital Learning"],
},
{
  title: "Bar Lab",
  desc: "Professional bar setup for practical training in beverage preparation, mixology techniques, and responsible service standards.",
  img: "/images/labs/lab4.jpg",
  chips: ["Industry Tools", "Practice Stations"],
},
{
  title: "Housekeeping Lab",
  desc: "Fully equipped mock guest room designed for hands-on training in cleaning procedures, room setup, and housekeeping management skills.",
  img: "/images/labs/lab5.jpg",
  chips: ["Safety Certified", "Practice Stations"],
},
    ],
    []
  );

  return (
    <div className="facultyPage" ref={rootRef}>
      {/* HERO */}
      <section className="facultyPage__hero" aria-label="Faculty hero" data-anim-group>
        <div className="facultyPage__container facultyPage__heroInner">
          <div className="facultyPage__heroLeft">
            <h1 className="facultyPage__heroTitle" data-anim="rise">
              Learn from <span className="facultyPage__hl">expert faculty</span>,{" "}
              <span className="facultyPage__hl">industry mentors</span>, and{" "}
              <span className="facultyPage__hl">practical guidance</span>.
            </h1>

            <p className="facultyPage__heroSub" data-anim="rise">
              INSPIRE Institute of Hotel Management faculty supports students with hands-on training,
              mentorship, and career-focused learning.
            </p>

            <div className="facultyPage__heroBtns" data-anim="pop">
              <a className="facultyPage__btnPrimary" href="#our-faculty">
                Meet Our Faculty
              </a>
              <a className="facultyPage__btnGhost" href="#enquire">
                Enquire Now
              </a>
            </div>

            <div className="facultyPage__miniGrid" aria-label="Faculty highlights" data-anim="rise" data-anim-group>
              {[
                { top: "Expert Mentors", bottom: "Industry-backed guidance" },
                { top: "Practical Learning", bottom: "Hands-on training" },
                { top: "Student Support", bottom: "1:1 mentoring" },
                { top: "Career Focus", bottom: "Job-ready skills" },
              ].map((c) => (
                <div key={c.top} className="facultyPage__miniCard" data-anim="pop">
                  <div className="facultyPage__miniTop">{c.top}</div>
                  <div className="facultyPage__miniBottom">{c.bottom}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="facultyPage__heroRight" data-anim="slideR">
            <div className={`facultyPage__heroCard ${heroImgOk ? "" : "isFallback"}`} data-parallax>
              {heroImgOk && (
                <img
                  src="/images/heroimg.png"
                  alt="Faculty support"
                  onError={() => setHeroImgOk(false)}
                />
              )}

              <div className="facultyPage__heroOverlay">
                <div className="facultyPage__heroOverlayTitle">INSPIRE • Faculty</div>
                <div className="facultyPage__heroOverlaySub">
                  Mentorship • Practical learning • Industry guidance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR FACULTY */}
      <section id="our-faculty" className="facultyPage__wrap" aria-label="Our faculty" data-anim-group>
        <div className="facultyPage__panel">
          <header className="facultyPage__head" data-anim="rise">
            <h2 className="facultyPage__title">Meet Our Faculty</h2>

            <div className="facultyPage__content" data-anim="rise">
              <p>
                We have an extremely well qualified international experienced faculty at ICHM with excellent academic
                credentials and Extensive experience in the Hospitality. Our entire faculty excels in bringing out the
                best in every student.
              </p>

              <p>
                Faculties here are engaged, dedicated to the friendliness and collegiality that foster constructive
                discussion and exciting ideas. They share their enthusiasm in their role as advisors, helping students
                make the most of their field experience and helping them in their search for internship and career
                opportunities.
              </p>

              <p>
                Faculty also contribute to the life of the Institute through curriculum development, seeking the latest
                information in industry needs and trends to make a learning environment that gives students a
                competitive edge.
              </p>
            </div>
          </header>

          <div className="facultyPage__grid" data-anim-group>
            {faculty.map((m) => (
              <article key={m.id} className="facultyPage__card" data-anim="pop">
                <div className="facultyPage__photo">
                  <img src={m.img} alt={m.name} loading="lazy" />
                  <div className="facultyPage__years">{m.years}</div>
                </div>

                <div className="facultyPage__body">
                  <h3 className="facultyPage__name">{m.name}</h3>
                  <div className="facultyPage__meta">{m.designation}</div>
                  <div className="facultyPage__dept">{m.dept}</div>

                  <p className="facultyPage__bio">{m.bio}</p>

                  {/* <div className="facultyPage__actions" aria-label="Faculty links">
                    <a
                      className="facultyPage__iconBtn"
                      href={m.linkedin || "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <LinkedInIcon />
                    </a>
                    <a className="facultyPage__iconBtn" href={m.email || "#"} aria-label="Email" title="Email">
                      <MailIcon />
                    </a>
                  </div> */}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR LABS */}
      <section className="facultyLabs" id="labs" aria-label="Our Labs" data-anim-group>
        <div className="facultyLabs__frame">
          <div className="facultyLabs__panel">
            <div className="facultyLabs__top" data-anim-group>
              <div className="facultyLabs__left">
                <h2 className="facultyLabs__h2" data-anim="rise">
                  Explore Our Industry-Standard Labs
                </h2>

                <p className="facultyLabs__sub" data-anim="rise">
                  Hands-on training facilities designed for practical hospitality learning.
                </p>

                <div className="facultyLabs__btnRow" data-anim="pop">
                  <a className="facultyLabs__btn facultyLabs__btnPrimary" href="#labs-grid">
                    View Labs
                  </a>
                  <a className="facultyLabs__btn facultyLabs__btnGhost" href="#enquire">
                    Enquire Now
                  </a>
                </div>
              </div>

              <div className="facultyLabs__right" data-anim="slideR">
                <div className="facultyLabs__heroImgCard" data-parallax>
                  <img src="/labs/hero-lab.jpeg" alt="INSPIRE Labs" loading="lazy" />
                  <div className="facultyLabs__heroImgLabel">INSPIRE • Labs</div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="facultyLabs__statsBar" aria-label="Lab highlights" data-anim="rise" data-anim-group>
              {[
                { ico: "🏛️", t: "6+ Labs", s: "Fully equipped learning spaces" },
                { ico: "⚙️", t: "Industry-Standard", s: "Modern tools for real-world tasks" },
                { ico: "🧑‍🍳", t: "Hands-on Training", s: "Practical experience in controlled setting" },
                { ico: "✅", t: "Certified Safety", s: "Strict adherence to hygiene standards" },
                { ico: "🧾", t: "Practices", s: "Protocols used across campuses" },
              ].map((x) => (
                <div key={x.t} className="facultyLabs__stat" data-anim="pop">
                  <span className="facultyLabs__ico">{x.ico}</span>
                  <div>
                    <div className="facultyLabs__statT">{x.t}</div>
                    <div className="facultyLabs__statS">{x.s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div id="labs-grid" className="facultyLabs__grid" data-anim-group>
              {labs.map((lab) => (
                <article key={lab.title} className="facultyLabs__card" data-anim="pop">
                  <div className="facultyLabs__cardImg">
                    <img src={lab.img} alt={lab.title} loading="lazy" />
                  </div>

                  <div className="facultyLabs__cardBody">
                    <h3 className="facultyLabs__cardTitle">{lab.title}</h3>
                    <p className="facultyLabs__cardDesc">{lab.desc}</p>

                    {/* <div className="facultyLabs__chipRow" aria-label="Lab features">
                      {lab.chips.map((c) => (
                        <span key={c} className="facultyLabs__chip">
                          {c}
                        </span>
                      ))}
                    </div> */}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="enquire" className="facultyPage__cta" aria-label="Enquire CTA" data-anim-group>
        <div className="facultyPage__container">
          <div className="facultyPage__ctaInner" data-anim="rise">
            <div>
              <h2 className="facultyPage__ctaTitle">Want to know more?</h2>
              <p className="facultyPage__ctaSub">
                Get admission support, course details, and guidance from our team.
              </p>
            </div>

            <div className="facultyPage__ctaBtns" data-anim="pop">
              <a className="facultyPage__btnPrimary" href="/contact#form">
                Apply Now
              </a>
              <a className="facultyPage__btnGhost" href="/brochure">
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
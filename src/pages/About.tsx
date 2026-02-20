// About.tsx
import React, { useEffect, useRef, useState } from "react";
import "./About.css";

type AnimType = "rise" | "fade" | "pop" | "slideL" | "slideR";

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

    // assign a stagger index per group (sections) for nicer cascading
    const sectionGroups = Array.from(
      root.querySelectorAll<HTMLElement>("[data-anim-group]")
    );
    const inGroup = new Set<HTMLElement>();

    sectionGroups.forEach((group) => {
      const groupEls = Array.from(
        group.querySelectorAll<HTMLElement>("[data-anim]")
      );
      groupEls.forEach((el, idx) => {
        inGroup.add(el);
        el.style.setProperty("--stagger", String(idx));
      });
    });

    // anything not in a group gets a simple index
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
        const t = (center - vh / 2) / (vh / 2); // -1..1
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

/* ---------------- Icons / UI bits ---------------- */

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case "spark":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l1.2 5.3L18 9l-4.8 1.7L12 16l-1.2-5.3L6 9l4.8-1.7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "globe":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M2 12h20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 2c3.5 3 5.5 6.8 5.5 10S15.5 19 12 22C8.5 19 6.5 15.2 6.5 12S8.5 5 12 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "briefcase":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 13a18 18 0 0 0 16 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 20 6v6c0 5-3.3 9.4-8 10-4.7-.6-8-5-8-10V6l8-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12.2 11 14l3.8-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bulb":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 22h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8.3 14.7C6.9 13.5 6 11.8 6 10a6 6 0 1 1 12 0c0 1.8-.9 3.5-2.3 4.7-.6.5-1.2 1.3-1.4 2.1H9.7c-.2-.8-.8-1.6-1.4-2.1Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "target":
      return (
        <svg className="abIcon" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M21 3l-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 3h6v6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const InfoCard = ({
  icon,
  title,
  children,
  size = "sm",
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg";
}) => {
  const isLg = size === "lg";
  return (
    <div
      className={`abVMCard ${isLg ? "abVMCardLg" : "abVMCardSm"}`}
      data-anim="pop"
    >
      <div className="abVMHead">
        <div className="abVMIcon" aria-hidden="true">
          <Icon name={icon} />
        </div>
        <h3 className="abVMTitle">{title}</h3>
      </div>
      <div className="abVMBody">{children}</div>
      <div className="abVMWave" aria-hidden="true" />
    </div>
  );
};

const LeaderCard = ({
  role,
  name,
  text,
  imgSrc,
}: {
  role: string;
  name: string;
  text: string;
  imgSrc?: string;
}) => {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="abLeaderCard" data-anim="slideR">
      <div className="abLeaderMain">
        <p className="abRole">{role}</p>
        <h3 className="abLeaderName">{name}</h3>
        <p className="abPara">{text}</p>
      </div>

      {imgSrc ? (
        <div className="abLeaderSide">
          {imgOk ? (
            <img
              className="abLeaderImg"
              src={imgSrc}
              alt={name}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="abLeaderImgFallback" aria-label={`${name} photo`}>
              {name}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default function About() {
  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();

  // ✅ FIX: stable callback ref (works on Vercel)
  const setRootRef = (node: HTMLElement | null) => {
    (revealRef as any).current = node;
    (parallaxRef as any).current = node;
  };

  // ✅ Enable animations only when JS runs (optional but good)
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  const [heroImgOk, setHeroImgOk] = useState(true);

  const stats = [
    { value: "Skill-first", label: "Industry-focused training" },
    { value: "100% Mindset", label: "Career readiness" },
    { value: "International", label: "Faculty experience" },
    { value: "Hands-on", label: "Learning approach" },
  ];

  const different = [
    {
      title: "Practical, industry-first learning",
      desc: "Training focused on hotel operations, standards, and real workflows—so students learn what employers expect.",
      icon: "spark",
      anim: "rise" as AnimType,
    },
    {
      title: "Leadership & career readiness",
      desc: "Communication, grooming, internships, and interview preparation that build confidence for professional success.",
      icon: "briefcase",
      anim: "rise" as AnimType,
    },
    {
      title: "Global mindset",
      desc: "Multicultural skills and hospitality etiquette aligned to global industry expectations and opportunities.",
      icon: "globe",
      anim: "rise" as AnimType,
    },
    {
      title: "Quality & discipline",
      desc: "Consistency, responsibility, and professionalism—habits that create trust and long-term employability.",
      icon: "shield",
      anim: "rise" as AnimType,
    },
  ];

  const leaders = [
    {
      role: "Managing Director",
      name: "Mr. Kampadandi Vinod Kumar",
      imgSrc: "/images/vinod.png",
      text:
        "The INSPIRE INSTITUTE OF HOTEL MANAGEMENT & CAREER was formed with the specific purpose to train quality personnel for the Hospitality Industry. Our Conviction that we would do justice to this end was based on the fact that the Management had more than three decades of experience as successful entrepreneurs in the Industry. I assure all those who join the College a very exciting, interesting, challenging and rewarding learning experience.",
    },
    {
      role: "Admin Director",
      name: "Ms. Lade Sumathi",
      imgSrc: "/images/lade.png",
      text:
        "It is with profound pleasure that I welcome you to INSPIRE INSTITUTE OF HOTEL MANAGEMENT AND CAREER. The vision behind starting this institute is to give best education in hospitality industry to deserving students with affordable fees. The institute is committed to quality at every level. The parents who send their wards to this institute, the students who study here for a career and the industry that offers placement to passed out students – everyone can be sure of quality.",
    },
    {
      role: "Chairman",
      name: "Ms. Gangarajula Pravalika",
      imgSrc: "/images/Gangarajula.png",
      text:
        "Welcome to an Institute where Hoteliering is not just a profession but a lifestyle; where we transform students to become a showman, a personality with unparalleled intelligence and wisdom, who never gives up this positive attitude, a strong “can do” approach.",
    },
  ];

  return (
    <main className="abPage" ref={setRootRef}>
      {/* HERO */}
      <header className="abHeroWrap" data-anim-group>
        <div className="abHeroGradient" />
        <div className="abBlob abBlob1" />
        <div className="abBlob abBlob2" />
        <div className="abBlob abBlob3" />

        <section className="abContainer abHero">
          <div className="abTopRow" data-anim="fade">
            <div className="abBreadcrumb">About Us</div>
          </div>

          <div className="abHeroGrid">
            <div className="abHeroLeft">
              <h1 className="abTitle" data-anim="rise">
                Building tomorrow’s hospitality leaders with{" "}
                <span className="abUnderline">
                  skills, discipline, and confidence
                </span>
                .
              </h1>

              <p className="abSubtitle" data-anim="rise">
                INSPIRE Institute of Hotel Management &amp; Career (ICHM–Armoor)
                prepares students for the hospitality profession through
                practical training, operational exposure, leadership development,
                and a strong career foundation.
              </p>

              <div className="abActions" data-anim="pop">
                <a className="abBtnPrimary" href="#vision-mission">
                  Explore Vision &amp; Mission
                </a>
                <a className="abBtnSecondary" href="#different">
                  What makes us different
                </a>
              </div>

              <div className="abStats" aria-label="Key highlights" data-anim="rise">
                {stats.map((s, idx) => (
                  <div
                    key={s.label}
                    className="abStatCard"
                    data-anim="pop"
                    style={{ ["--stagger" as any]: idx }}
                  >
                    <div className="abStatValue">{s.value}</div>
                    <div className="abStatLabel">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="abHeroRight">
              <div
                className="abImageCard"
                aria-label="Campus / Institute image"
                data-anim="slideL"
                data-parallax
              >
                {heroImgOk ? (
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop"
                    alt="INSPIRE Institute of Hotel Management & Career"
                    className="abHeroImage"
                    loading="lazy"
                    onError={() => setHeroImgOk(false)}
                  />
                ) : (
                  <div className="abImagePlaceholder">
                    <div className="abImagePlaceholderTop">
                      <span className="abImageKicker">INSPIRE • ICHM–Armoor</span>
                      <span className="abImageTag">Hospitality Education</span>
                    </div>
                  </div>
                )}

                <div className="abImageOverlay">
                  <div className="abImageTitle">INSPIRE • ICHM–Armoor</div>
                  <div className="abImageSubtitle">
                    Professional learning • Practical training • Global careers
                  </div>
                </div>
              </div>

              <div className="abHeroNote" data-anim="fade">
                <span className="abHeroNoteDot" />
                <p />
              </div>
            </div>
          </div>
        </section>

        <div className="abSectionDivider" />
      </header>

      {/* WHAT MAKES US DIFFERENT */}
      <section id="different" className="abSection abSectionAlt" data-anim-group>
        <div className="abContainer">
          <div className="abSectionHead" data-anim="rise">
            <h2 className="abH2">What makes us different</h2>
            <p className="abLead">
              A professional learning environment that blends mentorship with
              real-world practice—so students become confident and career-ready.
            </p>
          </div>

          <div className="abGrid4">
            {different.map((d, idx) => (
              <div
                key={d.title}
                data-anim={d.anim}
                style={{ ["--stagger" as any]: idx }}
              >
                <div className="abCard abCardTight">
                  <div className="abCardRow">
                    <div className="abIconBox">
                      <Icon name={d.icon} />
                    </div>
                    <div>
                      <h3 className="abH3">{d.title}</h3>
                      <p className="abCardText">{d.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision/Mission/Values */}
      <section id="vision-mission" className="abSection abVMSection" data-anim-group>
        <div className="abVMBackdrop" aria-hidden="true" />
        <div className="abContainer">
          <div className="abSectionHead" data-anim="rise">
            <h2 className="abH2">Vision, Mission &amp; Values</h2>
            <p className="abLead">
              Our direction is clear: quality education, strong skills, and
              graduates prepared for the hospitality industry.
            </p>
          </div>

          <div className="abVMGridTop">
            <InfoCard icon="bulb" title="Vision" size="lg">
              <p className="abVMText">
                To be the recognized leader in hospitality management education,
                research, and service—consistently delivering skill development,
                operational exposure, managerial competence, and high
                employability through quality education at an affordable cost.
              </p>
            </InfoCard>

            <InfoCard icon="target" title="Mission" size="lg">
              <p className="abVMText">
                To provide tomorrow’s hospitality industry leaders with
                knowledge, practical training, leadership and multicultural
                skills necessary to succeed in today’s global economy while
                fostering international goodwill and friendship.
              </p>
            </InfoCard>
          </div>

          <div className="abVMGridBottom">
            <InfoCard icon="spark" title="Professional Excellence">
              <p className="abVMText">
                Global hospitality standards—grooming, etiquette, communication,
                and operational mastery.
              </p>
            </InfoCard>

            <InfoCard icon="briefcase" title="Leadership & Entrepreneurship">
              <p className="abVMText">
                We encourage confident decision-making, ownership, and a strong
                service mindset.
              </p>
            </InfoCard>

            <InfoCard icon="shield" title="Integrity & Quality">
              <p className="abVMText">
                Discipline, responsibility, and consistency that employers
                trust.
              </p>
            </InfoCard>

            <InfoCard icon="globe" title="Global Outlook">
              <p className="abVMText">
                Multicultural exposure and industry alignment for success in the
                global economy.
              </p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section id="leadership" className="abSection abSectionAlt" data-anim-group>
        <div className="abContainer">
          <div className="abSectionHead" data-anim="rise">
            <h2 className="abH2">Message from Leadership</h2>
            <p className="abLead">
              Guidance that keeps students focused, confident, and ready for the
              real world.
            </p>
          </div>

          <div className="abLeaderGrid">
            {leaders.map((l) => (
              <LeaderCard key={l.name} {...l} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="abCtaSection" data-anim-group>
        <div className="abContainer">
          <div className="abCtaBox" data-anim="rise">
            <div>
              <h2 className="abCtaTitle">Ready to start your hospitality journey?</h2>
              <p className="abCtaText">
                Join a learning environment that builds professionalism,
                leadership, and a global career mindset—step by step.
              </p>
            </div>

            <div className="abCtaActions" data-anim="pop">
              <a href="/contact" className="abBtnPrimary">
                Contact Admissions
              </a>
              <a href="/courses" className="abBtnSecondary">
                Explore Courses
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

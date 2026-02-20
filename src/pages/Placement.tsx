// placement.tsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import "./placement.css";

type AbroadPlacement = {
  name: string;
  company: string;
  location: string;
  img: string;
};

type PlacementLogo = { src: string; alt: string };

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  img: string;
  text: string;
};

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}

/* =========================
   SAME scroll animation hook (About/Courses/Admissions)
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

    // group-based stagger
    const groups = Array.from(
      root.querySelectorAll<HTMLElement>("[data-anim-group]")
    );
    const inGroup = new Set<HTMLElement>();

    groups.forEach((group) => {
      const groupEls = Array.from(
        group.querySelectorAll<HTMLElement>("[data-anim]")
      );
      groupEls.forEach((el, idx) => {
        inGroup.add(el);
        el.style.setProperty("--stagger", String(idx));
      });
    });

    // fallback stagger
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

/**
 * Helper: scroll by ONE card (not full page), loop back to start when reaching end.
 */
function getStepSize(trackEl: HTMLDivElement) {
  const first = trackEl.querySelector<HTMLElement>("[data-slide='true']");
  if (!first) return trackEl.clientWidth;
  const style = window.getComputedStyle(trackEl);
  const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
  return first.getBoundingClientRect().width + gap;
}

function useAutoSlideLoop(
  trackRef: React.RefObject<HTMLDivElement>,
  isPaused: boolean,
  intervalMs: number
) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (isPaused) return;

    const tick = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const step = getStepSize(el);

      if (el.scrollLeft + step >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      el.scrollBy({ left: step, behavior: "smooth" });
    };

    const t = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(t);
  }, [trackRef, isPaused, intervalMs]);
}

/* =========================
   Student Slider (Auto loop)
   ========================= */
function StudentSlider({
  id,
  title,
  subtitle,
  items,
  autoSlide = true,
  intervalMs = 3000,
}: {
  id: string;
  title: React.ReactNode;
  subtitle: string;
  items: AbroadPlacement[];
  autoSlide?: boolean;
  intervalMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const recalc = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPages(total);

    const current = Math.round(el.scrollLeft / el.clientWidth);
    setPage(Math.min(total - 1, Math.max(0, current)));
  }, []);

  useEffect(() => {
    recalc();
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => recalc();
    const onResize = () => recalc();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onResize);
    };
  }, [recalc]);

  const scrollByPage = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === "next" ? el.clientWidth : -el.clientWidth;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const goTo = (p: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  };

  useAutoSlideLoop(trackRef, !autoSlide || paused, intervalMs);

  return (
    <section
      id={id}
      className="placementPage__sliderSection"
      aria-label={`${id} slider`}
      data-anim-group
    >
      <div className="placementPage__sectionHead" data-anim="rise">
        <h2 className="placementPage__h2">{title}</h2>
        <p className="placementPage__p">{subtitle}</p>
      </div>

      <div
        className="placementPage__sliderShell"
        data-anim="pop"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <button
          type="button"
          className="placementPage__navBtn placementPage__navBtn--left"
          aria-label="Previous"
          onClick={() => scrollByPage("prev")}
        >
          ‹
        </button>

        <div className="placementPage__sliderTrack" ref={trackRef}>
          {items.map((s) => (
            <article
              key={s.name}
              data-slide="true"
              className="placementPage__studentCard placementPage__studentCard--slide"
              // ✅ REMOVED: data-anim="fade"
              // ✅ REMOVED: stagger style (not needed if not animating)
            >
              <div className="placementPage__studentImg">
                <img src={s.img} alt={s.name} loading="lazy" />
                <div className="placementPage__chip">Abroad Placement</div>
              </div>

              <div className="placementPage__studentBody">
                <h3 className="placementPage__studentName">{s.name}</h3>
                <p className="placementPage__studentCompany">{s.company}</p>

                <div className="placementPage__loc">
                  <span className="placementPage__locIcon" aria-hidden="true">
                    <LocationIcon />
                  </span>
                  {s.location}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="placementPage__navBtn placementPage__navBtn--right"
          aria-label="Next"
          onClick={() => scrollByPage("next")}
        >
          ›
        </button>
      </div>

      <div className="placementPage__dots" aria-label="Slider pagination" data-anim="fade">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`placementPage__dot ${i === page ? "isActive" : ""}`}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================
   Testimonial Slider (Auto loop)
   ========================= */
function TestimonialSlider({
  id,
  title,
  subtitle,
  items,
  autoSlide = true,
  intervalMs = 3000,
}: {
  id: string;
  title: React.ReactNode;
  subtitle: string;
  items: Testimonial[];
  autoSlide?: boolean;
  intervalMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const recalc = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPages(total);

    const current = Math.round(el.scrollLeft / el.clientWidth);
    setPage(Math.min(total - 1, Math.max(0, current)));
  }, []);

  useEffect(() => {
    recalc();
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => recalc();
    const onResize = () => recalc();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onResize);
    };
  }, [recalc]);

  const scrollByPage = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === "next" ? el.clientWidth : -el.clientWidth;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const goTo = (p: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  };

  useAutoSlideLoop(trackRef, !autoSlide || paused, intervalMs);

  return (
    <section
      id={id}
      className="placementPage__sliderSection"
      aria-label={`${id} testimonials`}
      data-anim-group
    >
      <div className="placementPage__sectionHead" data-anim="rise">
        <h2 className="placementPage__h2">{title}</h2>
        <p className="placementPage__p">{subtitle}</p>
      </div>

      <div
        className="placementPage__sliderShell placementPage__sliderShell--testimonial"
        data-anim="pop"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <button
          type="button"
          className="placementPage__navBtn placementPage__navBtn--left"
          aria-label="Previous"
          onClick={() => scrollByPage("prev")}
        >
          ‹
        </button>

        <div className="placementPage__sliderTrack placementPage__sliderTrack--testimonial" ref={trackRef}>
          {items.map((t, idx) => (
            <article
              key={t.id}
              data-slide="true"
              className="placementPage__testimonialCard placementPage__testimonialCard--slide"
              data-anim={idx % 2 === 0 ? "slideL" : "slideR"}
              style={{ ["--stagger" as any]: idx }}
            >
              <div className="placementPage__tLeft">
                <div className="placementPage__tAvatar">
                  <img src={t.img} alt={t.name} loading="lazy" />
                </div>
              </div>

              <div className="placementPage__tRight">
                <div className="placementPage__tHeader">
                  <div className="placementPage__tName">{t.name}</div>
                  {t.role ? <div className="placementPage__tRole">{t.role}</div> : null}
                </div>

                <div className="placementPage__tBubble">
                  <p className="placementPage__tText">“{t.text}”</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="placementPage__navBtn placementPage__navBtn--right"
          aria-label="Next"
          onClick={() => scrollByPage("next")}
        >
          ›
        </button>
      </div>

      <div className="placementPage__dots" aria-label="Testimonial slider pagination" data-anim="fade">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`placementPage__dot ${i === page ? "isActive" : ""}`}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Placement() {
  const [heroImgOk, setHeroImgOk] = useState(true);

  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();

  // ✅ FIX: callback ref so both hooks get the real DOM node
  const setRootRef = (node: HTMLDivElement | null) => {
    (revealRef as any).current = node;
    (parallaxRef as any).current = node;
  };

  // ✅ enable animations only when JS runs
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  const abroadPlacements2025 = useMemo<AbroadPlacement[]>(
    () => [
      { name: "Komire Srivastav", company: "Nodric Palace & Spa", location: "Bahrain", img: "/images/students/student1.png" },
      { name: "CH Rutvik Goud", company: "Nodric Resort", location: "Bahrain", img: "/images/students/student2.png" },
      { name: "Kadhurkam Rahul", company: "Nodric Holding", location: "Bahrain", img: "/images/students/student3.png" },
      { name: "Golla Karnakar", company: "Nodric Homes Resort", location: "Bahrain", img: "/images/students/student4.png" },
      { name: "Basa Nithin", company: "Nodric Resort", location: "Bahrain", img: "/images/students/student5.png" },
      { name: "Balamuri Rajesh", company: "Nodric Palace & Spa", location: "Bahrain", img: "/images/students/student6.png" },
      { name: "Kasarla Srikar", company: "Ramada", location: "Bahrain", img: "/images/students/student7.png" },
      { name: "Akuthota Yashwan", company: "Nodric", location: "Bahrain", img: "/images/students/student8.png" },
    ],
    []
  );

  const abroadPlacementsFromImage = useMemo<AbroadPlacement[]>(
    () => [
      { name: "Annaram Srujana", company: "Ramada", location: "Bahrain", img: "/images/students/student9.png" },
      { name: "Sallagarige Adarsh", company: "Shalimar", location: "Bahrain", img: "/images/students/student10.png" },
      { name: "Kudukala Vignan", company: "Taj Hotels", location: "Bahrain", img: "/images/students/student11.png" },
      { name: "Gellu Sudheer Yadav", company: "Nodric", location: "Bahrain", img: "/images/students/student12.png" },
      { name: "Ambeer Harish Rao", company: "Nodric Resort", location: "Bahrain", img: "/images/students/student13.png" },
      { name: "Bhanu Prasad", company: "Nodric Palace & Spa", location: "Bahrain", img: "/images/students/student14.png" },
      { name: "Mohammad Jameer", company: "Nodric Palace & Spa", location: "Bahrain", img: "/images/students/student15.png" },
      { name: "Thoparam Nagarjuna", company: "Rotana", location: "Bahrain", img: "/images/students/student16.png" },
    ],
    []
  );

  const testimonials = useMemo<Testimonial[]>(
    () => [
      {
        id: "t1",
        name: "Student",
        role: "Team INSPIRE",
        img: "/images/students/student1.png",
        text:
          "To be a part of the ICHM, Hotel management institute is a life time experience. The quality education that is provided makes all the students ready to face the hospitality industry and climb the corporate ladder with ease.",
      },
      {
        id: "t2",
        name: "Student",
        role: "Team INSPIRE",
        img: "/images/students/student2.png",
        text:
          "In our college apart from academics, there is so much that I have learnt from this college. Personal values in life that the faculty teaches us, not only makes us professional but makes us good human beings as well.",
      },
      {
        id: "t3",
        name: "Student",
        role: "Team INSPIRE",
        img: "/images/students/student3.png",
        text:
          "I choose Spark institute because I wanted to study hospitality at the highest level of professionalism. Our institute provides the right atmosphere for students to truly grow and learn with a multicultural and diverse environment.",
      },
    ],
    []
  );

  const placementLogos: PlacementLogo[] = useMemo(
    () => [
      { src: "/images/placements/taj.png", alt: "Taj Hotels" },
      { src: "/images/placements/itc.png", alt: "ITC Hotels" },
      { src: "/images/placements/marriott.png", alt: "Marriott" },
      { src: "/images/placements/hyatt.png", alt: "Hyatt" },
      { src: "/images/placements/radisson.png", alt: "Radisson" },

      { src: "/images/placements/oberoi.png", alt: "The Oberoi" },
      { src: "/images/placements/lemontree.png", alt: "Lemon Tree Hotels" },
      { src: "/images/placements/novotel.png", alt: "Novotel" },
      { src: "/images/placements/holidayinn.svg", alt: "Holiday Inn" },
      { src: "/images/placements/accor.png", alt: "Accor" },

      { src: "/images/placements/indigo.png", alt: "IndiGo" },
      { src: "/images/placements/airindia.png", alt: "Air India" },
      { src: "/images/placements/vistara.png", alt: "Vistara" },
      { src: "/images/placements/irctc.png", alt: "IRCTC" },
      { src: "/images/placements/cruise.png", alt: "Cruise Hospitality" },

      { src: "/images/placements/airport.png", alt: "Airport Services" },
      { src: "/images/placements/resort.png", alt: "Luxury Resorts" },
      { src: "/images/placements/events.png", alt: "Event Management" },
      { src: "/images/placements/catering.png", alt: "Catering Services" },
      { src: "/images/placements/restaurant.png", alt: "Restaurant Groups" },
    ],
    []
  );

  return (
    <div className="placementPage" ref={setRootRef}>
      {/* HERO */}
      <section className="placementPage__hero" aria-label="Placement hero" data-anim-group>
        <div className="placementPage__container placementPage__heroInner">
          <div className="placementPage__heroLeft">
            <h1 className="placementPage__heroTitle" data-anim="rise">
              Build your career with{" "}
              <span className="placementPage__hl">placements</span>,{" "}
              <span className="placementPage__hl">industry connections</span>, and{" "}
              <span className="placementPage__hl">career guidance</span>.
            </h1>

            <p className="placementPage__heroSub" data-anim="rise">
              INSPIRE Institute of Hotel Management & Career supports students with
              placement assistance, interview preparation, and opportunities across
              leading hospitality brands.
            </p>

            <div className="placementPage__heroBtns" data-anim="pop">
              <a className="placementPage__btnPrimary" href="#slider-2025">
                View Placements
              </a>
              <a className="placementPage__btnGhost" href="#enquire">
                Enquire Now
              </a>
            </div>

            <div className="placementPage__miniGrid" aria-label="Placement highlights" data-anim="rise">
              {[
                { top: "Placement Support", bottom: "Guidance & opportunities" },
                { top: "Interview Prep", bottom: "Resume & mock interviews" },
                { top: "Industry Network", bottom: "Hospitality partners" },
                { top: "Career Readiness", bottom: "Soft skills & grooming" },
              ].map((c, idx) => (
                <div
                  key={c.top}
                  className="placementPage__miniCard"
                  data-anim="pop"
                  style={{ ["--stagger" as any]: idx }}
                >
                  <div className="placementPage__miniTop">{c.top}</div>
                  <div className="placementPage__miniBottom">{c.bottom}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="placementPage__heroRight">
            <div
              className={`placementPage__heroCard ${heroImgOk ? "" : "isFallback"}`}
              data-anim="slideR"
              data-parallax
            >
              {heroImgOk && (
                <img
                  src="/images/heroimg.png"
                  alt="Placement support"
                  onError={() => setHeroImgOk(false)}
                />
              )}

              <div className="placementPage__heroOverlay">
                <div className="placementPage__heroOverlayTitle">INSPIRE • Placement Cell</div>
                <div className="placementPage__heroOverlaySub">
                  Career guidance • Interview prep • Hospitality jobs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Auto: 3s loop back to first */}
      <div className="placementPage__container" data-anim="fade">
        <StudentSlider
          id="slider-2025"
          title={
            <>
              <span className="placementPage__underline">What Made INSPIRE Proud</span>
            </>
          }
          subtitle="Students placed abroad through INSPIRE (2025)"
          items={abroadPlacements2025}
          autoSlide
          intervalMs={3000}
        />
      </div>

      {/* ✅ Auto: 3s loop back to first */}
      <div className="placementPage__container" data-anim="fade">
        <StudentSlider
          id="slider-image"
          title={
            <>
              Abroad placements <span className="placementPage__underline">highlights</span>
            </>
          }
          subtitle="Students placed abroad (additional batch)"
          items={abroadPlacementsFromImage}
          autoSlide
          intervalMs={3000}
        />
      </div>

      {/* PARTNERS */}
      <section className="placementPage__partners" aria-label="Placements and career support" data-anim-group>
        <div className="placementPage__container">
          <div className="placementPage__partnersTop" data-anim="rise">
            <h2 className="placementPage__h2 placementPage__h2Light">
              <span className="placementPage__handUnderline">Placements</span> &amp; Career Support
            </h2>
            <p className="placementPage__p placementPage__pLight">
              We support students with internships, grooming, and interview readiness—so you can confidently start your hospitality career.
            </p>

            <div className="placementPage__statsRow" aria-label="Placement highlights" data-anim="pop">
              <div className="placementPage__stat">
                <div className="placementPage__statK">Internship</div>
                <div className="placementPage__statV">Support</div>
              </div>
              <div className="placementPage__stat">
                <div className="placementPage__statK">Grooming</div>
                <div className="placementPage__statV">Sessions</div>
              </div>
              <div className="placementPage__stat">
                <div className="placementPage__statK">Interview</div>
                <div className="placementPage__statV">Readiness</div>
              </div>
            </div>
          </div>

          <div className="placementPage__logosPanel" aria-label="Placement partners" data-anim="rise">
            <div className="placementPage__logoGrid">
              {placementLogos.map((logo, idx) => (
                <div
                  key={logo.alt}
                  className="placementPage__logoCard"
                  data-anim="pop"
                  style={{ ["--stagger" as any]: idx }}
                >
                  <img
                    className="placementPage__logoImg"
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Testimonials BELOW partners + auto 3s loop */}
      <div className="placementPage__container" data-anim="fade">
        <TestimonialSlider
          id="testimonials"
          title={
            <>
              Our Students <span className="placementPage__underline">Views</span>
            </>
          }
          subtitle="Real experiences shared by our students"
          items={testimonials}
          autoSlide
          intervalMs={3000}
        />
      </div>

      {/* CTA */}
      <section className="placementPage__cta" id="enquire" aria-label="Enquire CTA" data-anim-group>
        <div className="placementPage__container">
          <div className="placementPage__ctaInner" data-anim="rise">
            <div>
              <h2 className="placementPage__ctaTitle">Want placement guidance?</h2>
              <p className="placementPage__ctaSub">
                Get admission support, placement details, and career guidance from our team.
              </p>
            </div>

            <div className="placementPage__ctaBtns" data-anim="pop">
              <a className="placementPage__btnPrimary" href="/contact#form">
                Apply Now
              </a>
              <a className="placementPage__btnGhost" href="/brochure">
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../config/siteConfig";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import "./home.css";

type EnquiryForm = {
  name: string;
  phone: string;
  course:
    | "Advanced Diploma In HotelManagement"
    | "Diploma In Hotel Management"
    | "Post-Graduation Diploma In Hotel Management"
    | "Diploma In F&B Service & Housekeeping"
    | "Diploma In F&B Service"
    | "Diploma In Front Office"
    | "Diploma In Housekeeping";
};

type FieldErrors = Partial<Record<keyof EnquiryForm, string>>;

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  const base = `https://wa.me/${whatsappNumber}`;
  const text = encodeURIComponent(message);
  return `${base}?text=${text}`;
}

function validate(form: EnquiryForm): FieldErrors {
  const e: FieldErrors = {};
  const name = form.name.trim();
  const phone = digitsOnly(form.phone);

  if (!name) e.name = "Please enter your name.";
  if (!phone) e.phone = "Please enter your phone number.";
  else if (phone.length < 10 || phone.length > 12) e.phone = "Phone must be 10–12 digits.";

  return e;
}

/** Existing reveal-once observer (kept) */
function useRevealObserver() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return rootRef;
}

/** NEW: scroll-progress animation for elements with [data-scroll] */
function useScrollProgressAnimation() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll]"));
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.style.setProperty("--p", "1"));
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;

      for (const el of els) {
        const rect = el.getBoundingClientRect();

        // start when element is near bottom, finish when it reaches upper viewport
        const start = vh * 0.85;
        const end = vh * 0.25;

        const pRaw = (start - rect.top) / (start - end);
        const p = Math.max(0, Math.min(1, pRaw));

        el.style.setProperty("--p", String(p));
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

/** Combine both behaviors into one ref (so you can keep data-reveal + add data-scroll) */
function useCombinedAnimations() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Reveal once
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll progress
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll]"));
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.style.setProperty("--p", "1"));
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;

      for (const el of els) {
        const rect = el.getBoundingClientRect();
        const start = vh * 0.85;
        const end = vh * 0.25;

        const pRaw = (start - rect.top) / (start - end);
        const p = Math.max(0, Math.min(1, pRaw));
        el.style.setProperty("--p", String(p));
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

type Slide = { src: string; alt: string; caption?: string };

type Outcome = {
  k: string;
  v: string;
  img: string;
  alt: string;
};

type CourseCard = {
  title: string;
  meta: string;
  tag: string;
  icon: string;
  desc: string;
  points: string[];
  visual: { icon: string };
  theme: { leftBg: string; rightBg: string };
};

type PlacementLogo = { src: string; alt: string };

export default function Home() {
  // ✅ Use combined animations so you keep data-reveal AND add scrolling animation via data-scroll
  const rootRef = useCombinedAnimations();

  const slides: Slide[] = useMemo(
    () => [
      { src: "/images/heroimg.png", alt: "College campus view", caption: "Campus & Learning Environment" },
      { src: "/images/slider2.jpeg", alt: "Training kitchen lab", caption: "Practical Training Labs" },
      { src: "/images/slider3.jpeg", alt: "Advanced cooking practice session", caption: "Hands-On Culinary Experience" },
      { src: "/images/slider5.png", alt: "Hospitality students in food preparation class", caption: "Industry-Based Skill Development" },
      { src: "/images/slider6.png", alt: "Professional chef training workshop", caption: "Real-World Kitchen Exposure" },
      { src: "/images/wow7.png", alt: "Students performing culinary assessment", caption: "Skill Demonstration & Evaluation" },
    ],
    []
  );

  const [slideIndex, setSlideIndex] = useState(0);
  const sliderTimerRef = useRef<number | null>(null);

  const nextSlide = () => setSlideIndex((i) => (i + 1) % slides.length);
  const prevSlide = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  const goToSlide = (i: number) => setSlideIndex(i);

  const stopAutoplay = () => {
    if (sliderTimerRef.current) {
      window.clearInterval(sliderTimerRef.current);
      sliderTimerRef.current = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    sliderTimerRef.current = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    startAutoplay();
    return () => stopAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const [form, setForm] = useState<EnquiryForm>({
    name: "",
    phone: "",
    course: "Diploma In Hotel Management",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const coursesSectionId = "coursesPreview";

  /**
   * ✅ UPDATED: WhatsApp quick enquiry (same style as your Contact page)
   * This one link is used everywhere (slider button, quick enquiry, FAQ card, etc.)
   */
  const quickWaHref = useMemo(() => {
    const message = `Hi ${SITE.name},

Name: ${form.name.trim() || "-"}
Phone: ${digitsOnly(form.phone) || "-"}
Course: ${form.course || "-"}

Please share eligibility, fees & admission steps.`;

    return buildWhatsAppUrl(SITE.whatsapp, message);
  }, [form.name, form.phone, form.course]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    // ✅ open the same WhatsApp quick enquiry
    window.open(quickWaHref, "_blank", "noopener,noreferrer");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const telHref = `tel:${SITE.phone}`;

  const faqs = useMemo(
    () => [
      {
        q: "Who can apply for hotel management courses?",
        a: "Students who have completed 10+2 can apply for degree programs. Diploma and certificate options may be available after 10th/10+2, depending on the course.",
      },
      { q: "Is practical training included?", a: "Yes. Training is supported through labs and structured practical sessions to build job-ready skills." },
      { q: "How do I enquire or apply?", a: "You can call, WhatsApp, or submit the enquiry form. Our team will guide you on eligibility, documents, and admission steps." },
      { q: "What careers can students choose after hotel management?", a: "Hospitality offers opportunities in hotels, resorts, airlines, cruise lines, tourism, events, and food services, based on your interest and skills." },
    ],
    []
  );

  const highlightCards = useMemo(
    () => [
      {
        title: "Practical Training",
        text: "Hands-on labs and structured practice across core hotel departments.",
        img: "/images/slider1.jpeg",
        alt: "Practical training lab",
      },
      {
        title: "Industry Exposure",
        text: "Professional grooming, communication and service standards aligned to industry needs.",
        img: "/images/slider2.jpeg",
        alt: "Industry exposure and professional grooming",
      },
      {
        title: "Career Guidance",
        text: "Internship support, interview readiness and next-step planning for students.",
        img: "/images/hello.jpeg",
        alt: "Career guidance and internship support",
      },
      {
        title: "Student Support",
        text: "Guidance for students and parents with a friendly, student-first environment.",
        img: "/images/wow9.png",
        alt: "Student support and counselling",
      },
    ],
    []
  );

  const outcomes: Outcome[] = useMemo(
    () => [
      { k: "Job-ready skills", v: "Training + Grooming", img: "/images/slider2.jpeg", alt: "Students learning practical skills" },
      { k: "Career options", v: "Hotels • Travel • Events", img: "/images/slider1.jpeg", alt: "Hospitality career opportunities" },
      { k: "Learning approach", v: "Practical + Industry focus", img: "/images/wow10.png", alt: "Industry focused training" },
    ],
    []
  );

  const courses: CourseCard[] = useMemo(
    () => [
      {
        title: "Advanced Diploma In Hotel Management",
        meta: "18 Months (12 + 6) • 10th / 12th Pass or Fail",
        tag: "Most Popular",
        icon: "🏨",
        desc: "Comprehensive hospitality program covering hotel operations, service standards, and practical exposure.",
        points: ["Duration: 18 Months (12 + 6)", "Eligibility: 10th / 12th Pass or Fail", "Hotel operations & guest handling", "Internship & career support"],
        visual: { icon: "🏨" },
        theme: { leftBg: "#2563eb", rightBg: "#eef2ff" },
      },
      {
        title: "Diploma In Hotel Management",
        meta: "12 Months (8 + 4) • 10th / 12th Pass or Fail",
        tag: "Career Focused",
        icon: "🎓",
        desc: "Industry-focused diploma with structured hospitality training and practical development.",
        points: ["Duration: 12 Months (8 + 4)", "Eligibility: 10th / 12th Pass or Fail", "Core hotel departments", "Grooming & interview preparation"],
        visual: { icon: "🎓" },
        theme: { leftBg: "#7c3aed", rightBg: "#f3e8ff" },
      },
      {
        title: "Post-Graduation Diploma In Hotel Management",
        meta: "12 Months (8 + 4) • Degree / PG",
        tag: "For Graduates",
        icon: "📘",
        desc: "Advanced diploma for graduates aiming for managerial roles in hospitality.",
        points: ["Duration: 12 Months (8 + 4)", "Eligibility: Degree / PG", "Advanced hotel management", "Leadership & operations training"],
        visual: { icon: "📘" },
        theme: { leftBg: "#0ea5e9", rightBg: "#ecfeff" },
      },
      {
        title: "Diploma In F&B Service & Housekeeping",
        meta: "12 Months (6 + 6) • 10th / 12th Pass or Fail",
        tag: "Dual Specialization",
        icon: "🍽️",
        desc: "Combined specialization in Food & Beverage Service and Housekeeping operations.",
        points: ["Duration: 12 Months (6 + 6)", "Eligibility: 10th / 12th Pass or Fail", "Restaurant service standards", "Housekeeping operations"],
        visual: { icon: "🍽️" },
        theme: { leftBg: "#16a34a", rightBg: "#f0fdf4" },
      },
      {
        title: "Diploma In F&B Service",
        meta: "6 Months (3 + 3) • 10th / 12th / Degree / PG",
        tag: "Short Term",
        icon: "🥂",
        desc: "Focused short-term program for restaurant service and hospitality etiquette.",
        points: ["Duration: 6 Months (3 + 3)", "Eligibility: 10th / 12th / Degree / PG", "Service techniques", "Guest interaction skills"],
        visual: { icon: "🥂" },
        theme: { leftBg: "#f97316", rightBg: "#fff7ed" },
      },
      {
        title: "Diploma In Front Office",
        meta: "6 Months (3 + 3) • 10th / 12th / Degree / PG",
        tag: "Guest Relations",
        icon: "🛎️",
        desc: "Training in reception management, guest communication, and front desk systems.",
        points: ["Duration: 6 Months (3 + 3)", "Eligibility: 10th / 12th / Degree / PG", "Reception operations", "Customer handling skills"],
        visual: { icon: "🛎️" },
        theme: { leftBg: "#dc2626", rightBg: "#fef2f2" },
      },
      {
        title: "Diploma In Housekeeping",
        meta: "6 Months (3 + 3) • 10th (Pass / Fail)",
        tag: "Practical Training",
        icon: "🧹",
        desc: "Hands-on housekeeping training covering hygiene standards and room maintenance.",
        points: ["Duration: 6 Months (3 + 3)", "Eligibility: 10th (Pass / Fail)", "Room operations", "Hygiene & safety standards"],
        visual: { icon: "🧹" },
        theme: { leftBg: "#9333ea", rightBg: "#faf5ff" },
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

  const abroadPlacements = useMemo(
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

  return (
    <div ref={rootRef} className="home">
      {/* FULL SCREEN SLIDER */}
      <section className="slider slider--fullscreen" aria-label="College photos slider">
        <div className="slider__wrap">
          <div
            className="slider__stage slider__stage--fullscreen"
            aria-live="polite"
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
            onFocusCapture={stopAutoplay}
            onBlurCapture={startAutoplay}
          >
            {slides.map((s, i) => {
              const active = i === slideIndex;
              return (
                <div key={s.src} className={`slide ${active ? "is-active" : ""}`} aria-hidden={!active}>
                  <img className="slide__img" src={s.src} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} />
                  <div className="slide__overlay" />
                  <div className="slide__content">
                    <div className="slide__inner">
                      <h2 className="slide__title">{s.caption ?? "College Gallery"}</h2>
                      <p className="slide__sub">{SITE.location} • Admissions Open</p>
                      <div className="slide__actions">
                        <Link className="btn btn--primary" to="/admissions">
                          Apply / Enquire
                        </Link>
                        <a className="btn btn--ghost" href={quickWaHref} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="slider__nav slider__nav--prev" onClick={prevSlide} aria-label="Previous slide">
            ‹
          </button>
          <button type="button" className="slider__nav slider__nav--next" onClick={nextSlide} aria-label="Next slide">
            ›
          </button>

          <div className="slider__dots" role="tablist" aria-label="Slide dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot ${i === slideIndex ? "is-active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slideIndex}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="home__container">
        {/* HERO */}
        <section className="hero" aria-label="Hero">
          <div className="hero__grid">
            <div className="hero__copy hero__copy--premium" data-reveal data-scroll>
              <div className="badge badge--glow" aria-label="Admissions status">
                Admissions Open
              </div>

              <h1 className="refTitle">
                Build a Career in <span className="accent">Hotel Management</span>
              </h1>

              <p className="hero__sub">
                {SITE.name} in {SITE.location} is dedicated to shaping confident hospitality professionals through a balance of academic learning, hands-on
                training, and real-world industry exposure.
              </p>

              <div className="heroDescription">
                <p>
                  Our programs are designed to prepare students for careers in hotels, resorts, airlines, tourism, and service industries by focusing on
                  practical skills, professional grooming, and workplace readiness.
                </p>

                <p>
                  With experienced faculty, structured practical sessions, and student-first guidance, we help learners build confidence, discipline, and a
                  strong foundation for long-term career growth in hospitality.
                </p>
              </div>

              <div className="miniNote miniNote--premium" aria-label="Trust note">
                <div className="miniNote__iconWrap" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="miniNote__content">
                  <strong>Student-first approach</strong>
                  <span>Simple admission process • Personal guidance • Career-focused learning</span>
                </div>
              </div>
            </div>

            {/* ENQUIRY CARD */}
            <aside className="hero__card" data-reveal data-scroll aria-label="Quick enquiry form">
              <div className="cardHeader">
                <h2 className="cardHeader__title">Quick Enquiry</h2>
                <p className="cardHeader__sub">Get admission details on WhatsApp.</p>
              </div>

              <form onSubmit={onSubmit} className="form" noValidate>
                <div className="field">
                  <label htmlFor="name" className="field__label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="name"
                    className={`field__input ${errors.name ? "is-error" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  {errors.name && <div className="field__error">{errors.name}</div>}
                </div>

                <div className="field">
                  <label htmlFor="phone" className="field__label">
                    Phone <span className="req">*</span>
                  </label>
                  <input
                    id="phone"
                    className={`field__input ${errors.phone ? "is-error" : ""}`}
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: digitsOnly(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="10–12 digits"
                    autoComplete="tel"
                  />
                  {!errors.phone && <div className="field__hint">Digits only. Example: 9876543210</div>}
                  {errors.phone && <div className="field__error">{errors.phone}</div>}
                </div>

                <div className="field">
                  <label htmlFor="course" className="field__label">
                    Interested Course
                  </label>
                  <select
                    id="course"
                    className="field__input"
                    value={form.course}
                    onChange={(e) => setForm((p) => ({ ...p, course: e.target.value as EnquiryForm["course"] }))}
                  >
                    <option value="Advanced Diploma In HotelManagement">Advanced Diploma In Hotel Management</option>
                    <option value="Diploma In Hotel Management">Diploma In Hotel Management</option>
                    <option value="Post-Graduation Diploma In Hotel Management">Post-Graduation Diploma In Hotel Management</option>
                    <option value="Diploma In F&B Service & Housekeeping">Diploma In F&amp;B Service &amp; Housekeeping</option>
                    <option value="Diploma In F&B Service">Diploma In F&amp;B Service</option>
                    <option value="Diploma In Front Office">Diploma In Front Office</option>
                    <option value="Diploma In Housekeeping">Diploma In Housekeeping</option>
                  </select>
                </div>

                <button type="submit" className="btn btn--gold btn--full">
                  Send on WhatsApp
                </button>

                <div className="form__meta">
                  <a className="metaLink" href={telHref}>
                    Call: {SITE.phone}
                  </a>
                  <a className="metaLink" href={quickWaHref} target="_blank" rel="noreferrer">
                    WhatsApp quick enquiry
                  </a>
                </div>
              </form>
            </aside>
          </div>
        </section>
      </div>

      {/* WHY SECTION */}
      <section className="whySection whySection--full" aria-label="Why students choose hospitality" data-reveal data-scroll>
        <div className="whySection__inner whySection__inner--full">
          <div className="whySection__head">
            <h2 className="whyTitle">
              Why Students Choose <span className="handUnderline">Inspire</span>
            </h2>
            <p className="whySub">
              A practical, people-focused career path with strong growth opportunities—supported by training, guidance, and industry-ready learning.
            </p>
          </div>

          <div className="whyCards">
            {highlightCards.map((c) => (
              <article key={c.title} className="whyCard" data-scroll>
                <div className="whyCard__media">
                  <img src={c.img} alt={c.alt} loading="lazy" />
                </div>
                <div className="whyCard__body">
                  <h3 className="whyCard__title">{c.title}</h3>
                  <p className="whyCard__text">{c.text}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="gainBox" aria-label="What students gain" data-scroll>
            <div className="gainBox__head">
              <div>
                <h3 className="gainBox__title">What Students Gain</h3>
                <p className="gainBox__sub">Clear learning path, confidence, and career direction.</p>
              </div>

              <div className="gainBox__chips" aria-label="Highlights">
                <span className="gainChip">Training</span>
                <span className="gainChip">Grooming</span>
                <span className="gainChip">Placement Support</span>
              </div>
            </div>

            <div className="gainGrid">
              {outcomes.map((o) => (
                <div key={o.k} className="gainTile" data-scroll>
                  <div className="gainTile__media">
                    <img src={o.img} alt={o.alt} loading="lazy" />
                  </div>
                  <div className="gainTile__body">
                    <div className="gainTile__k">{o.k}</div>
                    <div className="gainTile__v">{o.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="home__container">
        {/* COURSES */}
        <section id={coursesSectionId} className="section coursesSection" data-reveal data-scroll>
          <div className="coursesInner">
            <div className="coursesHead">
              <div className="coursesHead__center">
                <h2 className="courseTitle">
                  <span className="handUnderline">Courses</span> offered
                </h2>

                <span className="coursesHead__underline"></span>

                <p className="coursesHead__sub">Explore our industry-focused programs designed for real careers.</p>
              </div>
            </div>

            <div className="coursesGrid">
              {courses.map((c, index) => (
                <article key={c.title} className="courseCardUnified" data-scroll style={{ ["--cardBg" as any]: c.theme.leftBg }}>
                  <img src={`/images/${index === 0 ? "wow" : `wow${index + 1}`}.png`} alt={c.title} className="courseCardUnified__img" />

                  <div className="courseCardUnified__overlay" />

                  <div className="courseCardUnified__content">
                    <h3 className="courseCardUnified__title">{c.title}</h3>
                    <p className="courseCardUnified__desc">{c.desc}</p>

                    <ul className="courseCardUnified__points">
                      {c.points.map((p) => (
                        <li key={p} className="courseCardUnified__point">
                          <span className="courseCardUnified__tick">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="courseCardUnified__bottom">
                      <span className="courseCardUnified__meta">{c.meta}</span>

                      <Link to="/admissions" className="courseCardUnified__cta">
                        Enquire <span className="courseCardUnified__arrow">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== PLACEMENTS SECTION ===================== */}
        <section className="placementsFull" aria-label="Placements and career support" data-reveal data-scroll>
          <div className="placementsBox">
            <h2 className="placementsTitle placementsTitle--center">
              <span className="handUnderline">Placements</span> &amp; Career Support
            </h2>

            <p className="placementsSub placementsSub--center">
              We support students with internships, grooming, and interview readiness—so you can confidently start your hospitality career.
            </p>

            <div className="placementsStats placementsStats--center" aria-label="Placement highlights" data-scroll>
              <div className="placementsStat">
                <div className="placementsStat__k">Internship</div>
                <div className="placementsStat__v">Support</div>
              </div>

              <div className="placementsStat">
                <div className="placementsStat__k">Grooming</div>
                <div className="placementsStat__v">Sessions</div>
              </div>

              <div className="placementsStat">
                <div className="placementsStat__k">Interview</div>
                <div className="placementsStat__v">Readiness</div>
              </div>
            </div>

            <div className="placementsCompaniesBox" aria-label="Placement partners">
              <div className="placementsLogoGrid">
                {placementLogos.map((logo) => (
                  <div key={logo.alt} className="placementsLogoCard" data-scroll>
                    <img className="placementsLogoImg" src={logo.src} alt={logo.alt} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ===================== END PLACEMENTS SECTION ===================== */}

        {/* ===================== PROUD / ABROAD SECTION (SEPARATE) ===================== */}
        <section className="placementsFull placementsProudSection" aria-label="What made INSPIRE proud" data-reveal data-scroll>
          <div className="placementsBox">
            <h2 className="placementsAbroad__title placementsTitle--center">
              What made <span className="handUnderline">INSPIRE</span> proud
            </h2>

            <p className="placementsAbroad__desc placementsSub--center">Students have been to Abroad placement through INSPIRE (2025)</p>

            <div className="placementsAbroad__grid">
              {abroadPlacements.map((s) => (
                <article key={s.name} className="whyCard placementsAbroadCard" data-scroll>
                  <div className="whyCard__media placementsAbroadCard__media">
                    <img src={s.img} alt={s.name} loading="lazy" />
                  </div>

                  <div className="whyCard__body placementsAbroadCard__body">
                    <h3 className="whyCard__title placementsAbroadCard__title">{s.name}</h3>
                    <p className="whyCard__text placementsAbroadCard__text">{s.company}</p>

                    <p className="placementsAbroadCard__loc">
                      <span className="locationBadge">
                        <span className="locationIcon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                          </svg>
                        </span>
                        {s.location}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="section faqSection" aria-label="Frequently asked questions" data-reveal data-scroll>
          <div className="section__head faqHead">
            <h2 className="section__title">
              <span className="handUnderline">FAQ</span>
            </h2>
            <p className="section__sub">Quick answers for students and parents.</p>
          </div>

          <div className="faqWrap">
            <div className="faqLeft" data-scroll>
              <div className="faq">
                {faqs.map((item, idx) => {
                  const open = faqOpen === idx;
                  const btnId = `faq-btn-${idx}`;
                  const panelId = `faq-panel-${idx}`;

                  return (
                    <div key={item.q} className={`faqItem ${open ? "is-open" : ""}`} data-scroll>
                      <button
                        id={btnId}
                        className="faqBtn"
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setFaqOpen((p) => (p === idx ? null : idx))}
                      >
                        <span className="faqQ">{item.q}</span>

                        <span className="faqIcon" aria-hidden="true">
                          <span className="faqIcon__plus">+</span>
                        </span>
                      </button>

                      <div id={panelId} role="region" aria-labelledby={btnId} className={`faqPanel ${open ? "is-open" : ""}`}>
                        <div className="faqPanel__inner">
                          <p className="faqA">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="faqRight" aria-label="Student support visual" data-scroll>
              <div className="faqPhotoCard">
                <img src="/images/wow11.png" alt="Students in training session" className="faqPhotoCard__img" loading="lazy" />
                <div className="faqPhotoCard__overlay" />
                <div className="faqPhotoCard__content">
                  <div className="faqPhotoCard__tag">Need help?</div>
                  <h3 className="faqPhotoCard__title">Talk to our admission team</h3>
                  <p className="faqPhotoCard__text">Get course details, eligibility, fees, and guidance in minutes.</p>

                  <div className="faqPhotoCard__actions">
                    <a className="btn btn--gold" href={quickWaHref} target="_blank" rel="noreferrer">
                      WhatsApp Now
                    </a>
                    <Link className="btn btn--primary" to="/admissions">
                      Admission Details
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* ADMISSION ENQUIRY (below FAQ) */}
      <section className="section admissionEnquiry" aria-label="Admission enquiry" data-reveal data-scroll>
        <div className="admissionEnquiry__wrap">
          <div className="admissionEnquiry__head">
            <h2 className="admissionEnquiry__title">
              <span className="handUnderline">Admissions</span> Are Open
            </h2>
            <p className="admissionEnquiry__sub">Limited seats available for the upcoming academic session.</p>
          </div>

          <div className="admissionEnquiry__content">
            <div className="admissionSlider" aria-label="Campus and training highlights" data-scroll>
              <div className="admissionSlider__track">
                {[
                  { src: "/images/heroimg.png", caption: "Practical Training Labs" },
                  { src: "/images/heroimg2.png", caption: "Industry Exposure & Grooming" },
                  { src: "/images/heroimg1.png", caption: "Student Life & Learning" },
                  { src: "/images/heroimg3.png", caption: "Student Life & Learning" },
                  { src: "/images/heroimg4.png", caption: "Student Life & Learning" },
                ].map((s, i) => (
                  <div className="admissionSlide" key={i}>
                    <img src={s.src} alt={s.caption} loading="lazy" />
                    <div className="admissionSlide__overlay" />
                    <div className="admissionSlide__caption">{s.caption}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="admissionEnquiry__card" aria-label="Admission enquiry form" data-scroll>
              <div className="admissionCardHead">
                <h3 className="admissionCardHead__title">Get Admission Details</h3>
                <p className="admissionCardHead__sub">Fill the form and send your enquiry on WhatsApp.</p>
              </div>

              <form onSubmit={onSubmit} className="form form--tight" noValidate>
                <div className="field">
                  <label htmlFor="ad-name" className="field__label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="ad-name"
                    className={`field__input ${errors.name ? "is-error" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  {errors.name && <div className="field__error">{errors.name}</div>}
                </div>

                <div className="field">
                  <label htmlFor="ad-phone" className="field__label">
                    Phone <span className="req">*</span>
                  </label>
                  <input
                    id="ad-phone"
                    className={`field__input ${errors.phone ? "is-error" : ""}`}
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: digitsOnly(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="10–12 digits"
                    autoComplete="tel"
                  />
                  {!errors.phone && <div className="field__hint">Digits only. Example: 9876543210</div>}
                  {errors.phone && <div className="field__error">{errors.phone}</div>}
                </div>

                <div className="field">
                  <label htmlFor="ad-course" className="field__label">
                    Interested Course
                  </label>
                  <select
                    id="ad-course"
                    className="field__input"
                    value={form.course}
                    onChange={(e) => setForm((p) => ({ ...p, course: e.target.value as EnquiryForm["course"] }))}
                  >
                    <option value="Advanced Diploma In HotelManagement">Advanced Diploma In Hotel Management</option>
                    <option value="Diploma In Hotel Management">Diploma In Hotel Management</option>
                    <option value="Post-Graduation Diploma In Hotel Management">Post-Graduation Diploma In Hotel Management</option>
                    <option value="Diploma In F&B Service & Housekeeping">Diploma In F&amp;B Service &amp; Housekeeping</option>
                    <option value="Diploma In F&B Service">Diploma In F&amp;B Service</option>
                    <option value="Diploma In Front Office">Diploma In Front Office</option>
                    <option value="Diploma In Housekeeping">Diploma In Housekeeping</option>
                  </select>
                </div>

                <button type="submit" className="btn btn--gold btn--full">
                  Send Enquiry
                </button>

                <div className="admissionCardMeta">We’ll reply with eligibility, fees &amp; admission steps.</div>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Contact.css";

type FormType = {
  name: string;
  phone: string;
  course: string;
};

const SITE = {
  phone: "+918374382391",
  whatsappNumber: "918374382391", // ✅ digits only (IMPORTANT)
  email: "info@inspirecollegehm.com",
};

const COURSES = [
  "Advanced Diploma In Hotel Management",
  "Diploma In Hotel Management",
  "Post-Graduation Diploma In Hotel Management",
  "Diploma In F&B Service & Housekeeping",
  "Diploma In F&B Service",
  "Diploma In Front Office",
  "Diploma In Housekeeping",
];

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/* =========================
   SAME scroll animation hook (safe)
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

    // Group-based stagger
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-group]"));
    const inGroup = new Set<HTMLElement>();

    groups.forEach((group) => {
      const groupEls = Array.from(group.querySelectorAll<HTMLElement>("[data-anim]"));
      groupEls.forEach((el, idx) => {
        inGroup.add(el);
        el.style.setProperty("--stagger", String(idx));
      });
    });

    // Fallback stagger
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

function useMergedRefs<T extends HTMLElement>(...refs: React.RefObject<T>[]) {
  const merged = useRef<T | null>(null);
  useEffect(() => {
    refs.forEach((r) => ((r as any).current = merged.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return merged;
}

export default function Contact(): JSX.Element {
  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();
  const rootRef = useMergedRefs(revealRef as any, parallaxRef as any);

  // ✅ IMPORTANT: enable animations only on this page
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  const [form, setForm] = useState<FormType>({
    name: "",
    phone: "",
    course: COURSES[0],
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const quickWaHref = useMemo(() => {
    const message = `Hi Inspire ICHM–Armoor,

Name: ${form.name || "-"}
Phone: ${form.phone || "-"}
Course: ${form.course || "-"}

Please share eligibility, fees & admission steps.`;

    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [form.name, form.phone, form.course]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name.";

    const len = form.phone.trim().length;
    if (!form.phone.trim()) newErrors.phone = "Please enter your phone number.";
    else if (len < 10 || len > 12) newErrors.phone = "Phone must be 10–12 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(quickWaHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contact" ref={rootRef}>
      {/* HERO */}
      <section className="contactHero" data-anim-group>
        <div className="contactHero__inner">
          <div className="contactHero__left">
            <h1 className="contactHero__title" data-anim="rise">
              Let’s Connect & <span className="contactHero__highlight">Start Your Journey</span>
            </h1>

            <p className="contactHero__subtitle" data-anim="rise">
              Have questions about admissions, courses, or eligibility? Our team
              is here to guide you every step of the way.
            </p>

            <div className="contactHero__actions" data-anim="pop">
              <a href="#form" className="contactHero__btn contactHero__btn--primary">
                Enquire Now
              </a>
              <a href={`tel:${SITE.phone}`} className="contactHero__btn contactHero__btn--ghost">
                Call Us
              </a>
            </div>

            <div className="contactHero__info" data-anim="rise">
              <div>
                <strong>Email:</strong> {SITE.email}
              </div>
              <div>
                <strong>Phone:</strong> {SITE.phone}
              </div>
              <div>
                <strong>Hours:</strong> Mon–Fri, 9:30 AM – 5:30 PM
              </div>
            </div>
          </div>

          <div className="contactHero__right" data-anim="slideR">
            <div className="contactHero__imageCard" data-parallax>
              <img src="/images/wow2.png" alt="Contact Inspire College" />
              <div className="contactHero__overlay">
                <div className="contactHero__overlayTitle">INSPIRE • ICHM–Armoor</div>
                <div className="contactHero__overlaySub">Admissions Open • Limited Seats • Apply Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="form" className="contactFormSection" data-anim-group>
        <div className="contactFormSection__inner">
          <aside className="contactFormCard" aria-label="Quick enquiry form" data-anim="pop">
            <div className="formHeader">
              <h2 className="formHeader__title" data-anim="rise">
                Get Admission Details
              </h2>
              <p className="formHeader__sub" data-anim="rise">
                Fill the form and send your enquiry on WhatsApp.
              </p>
            </div>

            <form onSubmit={onSubmit} className="form" noValidate data-anim="rise">
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
                  onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn--gold btn--full">
                Send Enquiry
              </button>

              <div className="form__footerNote">We’ll reply with eligibility, fees &amp; admission steps.</div>

              <div className="form__meta">
                <a className="metaLink" href={`tel:${SITE.phone}`}>
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
  );
}

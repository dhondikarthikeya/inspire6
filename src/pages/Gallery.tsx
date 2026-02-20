import React, { useEffect, useRef } from "react";
import "./Gallery.css";

const GALLERY_IMAGES = [
  "/images/slider1.jpeg",
  "/images/slider2.jpeg",
  "/images/slider3.jpeg",
  "/images/gallery1.jpeg",
  "/images/gallery2.jpeg",
  "/images/gallery3.jpeg",
  "/images/gallery4.jpeg",
  "/images/gallery5.jpeg",
  "/images/gallery6.jpeg",
  "/images/gallery7.jpeg",
  "/images/gallery8.jpeg",
];

/* =========================
   scroll animation hook (BULLETPROOF)
   ========================= */
function useStaggerReveal(rootRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // ✅ mark JS-ready so CSS can safely enable animations
    root.setAttribute("data-js", "1");

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-anim]"));
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // stagger per group
    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-group]"));
    const inGroup = new Set<HTMLElement>();

    groups.forEach((group) => {
      const groupEls = Array.from(group.querySelectorAll<HTMLElement>("[data-anim]"));
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
  }, [rootRef]);
}

function useParallax(rootRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
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

        el.style.setProperty("--py", `${clamped * -10}px`);
        el.style.setProperty("--pr", `${clamped * 0.6}deg`);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef]);
}

export default function Gallery(): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ✅ enable animations only while this page is mounted
  useEffect(() => {
    document.documentElement.classList.add("ab-anim");
    return () => document.documentElement.classList.remove("ab-anim");
  }, []);

  useStaggerReveal(rootRef);
  useParallax(rootRef);

  return (
    <div className="gallery" ref={rootRef}>
      {/* HERO */}
      <section className="galleryHero" data-anim-group>
        <div className="galleryHero__inner">
          <h1 className="galleryHero__title" data-anim="rise">
            Explore Our <span className="galleryHero__highlight">Campus Life</span> & Training Moments
          </h1>

          <p className="galleryHero__subtitle" data-anim="rise">
            Take a glimpse into practical sessions, hospitality events, internships, and real-world learning experiences at INSPIRE.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="galleryGrid" data-anim-group>
        <div className="galleryGrid__inner">
          {GALLERY_IMAGES.map((src, index) => (
            <div
              className="galleryCard"
              key={src + index}
              data-anim={index % 3 === 0 ? "slideL" : index % 3 === 1 ? "pop" : "slideR"}
              data-parallax
              style={{ ["--stagger" as any]: index }}
            >
              <img src={src} alt={`Gallery ${index + 1}`} loading="lazy" />
              <div className="galleryCard__overlay">Hospitality Training</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

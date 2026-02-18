import React, { useEffect, useRef } from "react";
import "./Gallery.css";

const GALLERY_IMAGES = [
  "/images/slider1.jpeg",
  "/images/slider2.jpeg",
  "/images/slider3.jpeg",
  "/images/gallery1.jpeg",
  "/images/gallery2.jpeg",
  "/images/gallery3.jpeg",
];

/* =========================
   SAME scroll animation hook (About/Courses/Admissions/Placement)
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

    // Fallback stagger for elements outside groups
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

export default function Gallery(): JSX.Element {
  const revealRef = useStaggerReveal();
  const parallaxRef = useParallax();
  const rootRef = useMergedRefs(revealRef as any, parallaxRef as any);

  return (
    <div className="gallery" ref={rootRef}>
      {/* HERO SECTION */}
      <section className="galleryHero" data-anim-group>
        <div className="galleryHero__inner">
          <h1 className="galleryHero__title" data-anim="rise">
            Explore Our{" "}
            <span className="galleryHero__highlight">Campus Life</span> & Training
            Moments
          </h1>

          <p className="galleryHero__subtitle" data-anim="rise">
            Take a glimpse into practical sessions, hospitality events,
            internships, and real-world learning experiences at INSPIRE.
          </p>
        </div>
      </section>

      {/* IMAGE GRID */}
      <section className="galleryGrid" data-anim-group>
        <div className="galleryGrid__inner">
          {GALLERY_IMAGES.map((src, index) => (
            <div
              className="galleryCard"
              key={index}
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

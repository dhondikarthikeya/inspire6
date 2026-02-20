import React, { useState } from "react";
import "./faculty.css";

export default function Faculty() {
  const [heroImgOk, setHeroImgOk] = useState(true);

  return (
    <div className="facultyPage">
      {/* HERO */}
      <section className="facultyPage__hero" aria-label="Faculty hero">
        <div className="facultyPage__container facultyPage__heroInner">
          <div className="facultyPage__heroLeft">
            <h1 className="facultyPage__heroTitle">
              Learn from{" "}
              <span className="facultyPage__hl">expert faculty</span>,{" "}
              <span className="facultyPage__hl">industry mentors</span>, and{" "}
              <span className="facultyPage__hl">practical guidance</span>.
            </h1>

            <p className="facultyPage__heroSub">
              INSPIRE Institute of Hotel Management faculty supports students with
              hands-on training, mentorship, and career-focused learning.
            </p>

            <div className="facultyPage__heroBtns">
              <a className="facultyPage__btnPrimary" href="#faculty-list">
                Meet Our Faculty
              </a>
              <a className="facultyPage__btnGhost" href="#enquire">
                Enquire Now
              </a>
            </div>

            <div className="facultyPage__miniGrid" aria-label="Faculty highlights">
              {[
                { top: "Expert Mentors", bottom: "Industry-backed guidance" },
                { top: "Practical Learning", bottom: "Hands-on training" },
                { top: "Student Support", bottom: "1:1 mentoring" },
                { top: "Career Focus", bottom: "Job-ready skills" },
              ].map((c) => (
                <div key={c.top} className="facultyPage__miniCard">
                  <div className="facultyPage__miniTop">{c.top}</div>
                  <div className="facultyPage__miniBottom">{c.bottom}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="facultyPage__heroRight">
            <div className={`facultyPage__heroCard ${heroImgOk ? "" : "isFallback"}`}>
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

      {/* CONTENT PLACEHOLDER (so anchor works) */}
      <section id="faculty-list" className="facultyPage__container facultyPage__sectionPad">
        <h2 className="facultyPage__h2">Our Faculty</h2>
        <p className="facultyPage__p">
          Add your faculty cards/sections here.
        </p>
      </section>

      {/* CTA PLACEHOLDER */}
      <section id="enquire" className="facultyPage__cta">
        <div className="facultyPage__container">
          <div className="facultyPage__ctaInner">
            <div>
              <h3 className="facultyPage__ctaTitle">Want to know more?</h3>
              <p className="facultyPage__ctaSub">
                Get admission support, course details, and guidance from our team.
              </p>
            </div>

            <div className="facultyPage__ctaBtns">
              <a className="facultyPage__btnPrimary" href="/apply">Apply Now</a>
              <a className="facultyPage__btnGhost" href="/brochure">Download Brochure</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
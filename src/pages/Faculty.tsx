import React, { useMemo, useState } from "react";
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

export default function Faculty() {
  const [heroImgOk, setHeroImgOk] = useState(true);

  const faculty = useMemo<FacultyMember[]>(
    () => [
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
      {
        id: "f4",
        name: "Ms. Sneha Reddy",
        designation: "Lecturer",
        dept: "Housekeeping",
        years: "8+ Years",
        bio: "Detail-oriented housekeeping specialist with expertise in guest room management and cleanliness.",
        img: "/images/faculty/f4.png",
        linkedin: "#",
        email: "mailto:info@example.com",
      },
    ],
    []
  );

  return (
    <div className="facultyPage">
      {/* HERO */}
      <section className="facultyPage__hero" aria-label="Faculty hero">
        <div className="facultyPage__container facultyPage__heroInner">
          <div className="facultyPage__heroLeft">
            <h1 className="facultyPage__heroTitle">
              Learn from <span className="facultyPage__hl">expert faculty</span>,{" "}
              <span className="facultyPage__hl">industry mentors</span>, and{" "}
              <span className="facultyPage__hl">practical guidance</span>.
            </h1>

            <p className="facultyPage__heroSub">
              INSPIRE Institute of Hotel Management faculty supports students with hands-on training,
              mentorship, and career-focused learning.
            </p>

            <div className="facultyPage__heroBtns">
              <a className="facultyPage__btnPrimary" href="#our-faculty">
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

      {/* OUR FACULTY */}
      <section id="our-faculty" className="facultyPage__wrap" aria-label="Our faculty">
        <div className="facultyPage__panel">
          <header className="facultyPage__head">
            <h2 className="facultyPage__title">Meet Our Faculty</h2>

            <div className="facultyPage__content">
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

          <div className="facultyPage__grid">
            {faculty.map((m) => (
              <article key={m.id} className="facultyPage__card">
                <div className="facultyPage__photo">
                  <img src={m.img} alt={m.name} loading="lazy" />
                  <div className="facultyPage__years">{m.years}</div>
                </div>

                <div className="facultyPage__body">
                  <h3 className="facultyPage__name">{m.name}</h3>
                  <div className="facultyPage__meta">{m.designation}</div>
                  <div className="facultyPage__dept">{m.dept}</div>

                  <p className="facultyPage__bio">{m.bio}</p>

                  <div className="facultyPage__actions" aria-label="Faculty links">
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
                    <a
                      className="facultyPage__iconBtn"
                      href={m.email || "#"}
                      aria-label="Email"
                      title="Email"
                    >
                      <MailIcon />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================
          OUR LABS (Reference-style)
      ================================ */}
      <section className="facultyLabs" id="labs" aria-label="Our Labs">
        <div className="facultyLabs__frame">
          <div className="facultyLabs__panel">
            <div className="facultyLabs__top">
              <div className="facultyLabs__left">
                <h2 className="facultyLabs__h2">Explore Our Industry-Standard Labs</h2>

                <p className="facultyLabs__sub">
                  Hands-on training facilities designed for practical hospitality learning.
                </p>

                <div className="facultyLabs__btnRow">
                  <a className="facultyLabs__btn facultyLabs__btnPrimary" href="#labs-grid">
                    View Labs
                  </a>
                  <a className="facultyLabs__btn facultyLabs__btnGhost" href="#enquire">
                    Enquire Now
                  </a>
                </div>
              </div>

              <div className="facultyLabs__right">
                <div className="facultyLabs__heroImgCard">
                  <img src="/labs/hero-lab.jpeg" alt="INSPIRE Labs" loading="lazy" />
                  <div className="facultyLabs__heroImgLabel">INSPIRE • Labs</div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="facultyLabs__statsBar" aria-label="Lab highlights">
              {[
                { ico: "🏛️", t: "6+ Labs", s: "Fully equipped learning spaces" },
                { ico: "⚙️", t: "Industry-Standard", s: "Modern tools for real-world tasks" },
                { ico: "🧑‍🍳", t: "Hands-on Training", s: "Practical experience in controlled setting" },
                { ico: "✅", t: "Certified Safety", s: "Strict adherence to hygiene standards" },
                { ico: "🧾", t: "Practices", s: "Protocols used across campuses" },
              ].map((x) => (
                <div key={x.t} className="facultyLabs__stat">
                  <span className="facultyLabs__ico">{x.ico}</span>
                  <div>
                    <div className="facultyLabs__statT">{x.t}</div>
                    <div className="facultyLabs__statS">{x.s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div id="labs-grid" className="facultyLabs__grid">
              {[
                {
                  title: "Food Production Lab",
                  desc: "Professional training kitchen equipped for culinary skills development.",
                  img: "/images/labs/lab1.jpg",
                  chips: ["Industry Tools", "Practice Stations"],
                },
                {
                  title: "Bakery & Patisserie Lab",
                  desc: "State-of-the-art bakery setup for learning baking and pastry making.",
                  img: "/images/labs/lab2.jpg",
                  chips: ["Industry Tools", "Practice Stations"],
                },
                {
                  title: "Front Office Simulation Lab",
                  desc: "Mock front office for guest service and hotel management training.",
                  img: "/images/labs/lab3.jpg",
                  chips: ["Industry Tools", "Safety Certified"],
                },
                {
                  title: "Housekeeping Practice Lab",
                  desc: "Hands-on housekeeping room for cleaning and room readiness training.",
                  img: "/images/labs/lab4.jpg",
                  chips: ["Safety Certified", "Practice Stations"],
                },
                {
                  title: "Food & Beverage Service Lab",
                  desc: "Training bar and dining area for service and mixology practice.",
                  img: "/images/labs/lab5.jpg",
                  chips: ["Industry Tools", "Service Setup"],
                },
              ].map((lab) => (
                <article key={lab.title} className="facultyLabs__card">
                  <div className="facultyLabs__cardImg">
                    <img src={lab.img} alt={lab.title} loading="lazy" />
                  </div>

                  <div className="facultyLabs__cardBody">
                    <h3 className="facultyLabs__cardTitle">{lab.title}</h3>
                    <p className="facultyLabs__cardDesc">{lab.desc}</p>

                    <div className="facultyLabs__chipRow" aria-label="Lab features">
                      {lab.chips.map((c) => (
                        <span key={c} className="facultyLabs__chip">
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* <div className="facultyLabs__iconRow" aria-label="Lab actions">
                      <span className="facultyLabs__miniIcon">🔗</span>
                      <span className="facultyLabs__miniIcon">📷</span>
                      <span className="facultyLabs__miniIcon">🗓️</span>
                      <span className="facultyLabs__miniIcon">ℹ️</span>
                    </div> */}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="enquire" className="facultyPage__cta" aria-label="Enquire CTA">
        <div className="facultyPage__container">
          <div className="facultyPage__ctaInner">
            <div>
              <h2 className="facultyPage__ctaTitle">Want to know more?</h2>
              <p className="facultyPage__ctaSub">
                Get admission support, course details, and guidance from our team.
              </p>
            </div>

            <div className="facultyPage__ctaBtns">
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
import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../config/siteConfig";

/**
 * Update:
 * ✅ Added a border line ABOVE "Made with ♥ SriyantraTech"
 * ✅ Credit stays centered and below the bottom row
 * ✅ Border line at top of bottom bar remains
 * ✅ Get Directions button included
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const initials = String(SITE?.name || "HMC")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const socials = {
    x: SITE?.socials?.x || SITE?.socials?.twitter || "#",
    instagram: SITE?.socials?.instagram || "#",
    facebook: SITE?.socials?.facebook || "#",
    linkedin: SITE?.socials?.linkedin || "#",
  };

  const mapsUrl =
    SITE?.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      SITE?.location || "Armoor, Nizamabad"
    )}`;

  const localSeoLinks = [
    { label: "Top Hotel Management College in Armoor", to: "/hotel-management-college-armoor" },
    { label: "Best Hotel Management College in Nizamabad", to: "/hotel-management-college-nizamabad" },
    { label: "Hotel Management College near Nirmal", to: "/hotel-management-college-nirmal" },
    { label: "Hotel Management College in Metpally", to: "/hotel-management-college-metpally" },
    { label: "Hotel Management College near Kamareddy", to: "/hotel-management-college-kamareddy" },
    { label: "Hotel Management College near Karimnagar", to: "/hotel-management-college-karimnagar" },
  ];

  return (
    <>
      <footer className="refFooter" aria-label="Footer">
        <div className="refFooter__container">
          <div className="refFooter__top">
            {/* LEFT */}
            <section className="refFooter__left" aria-label="College overview">
              <div className="refFooter__brandRow">
  <div className="refFooter__logoMark">
    <img 
      src="/images/logo.png"   // <-- change to your logo path
      alt={SITE?.name || "Hotel Management College"}
      className="refFooter__logoImage"
    />
  </div>

  <div className="refFooter__brandName">
    {SITE?.name || "Hotel Management College"}
  </div>
</div>


              <h2 className="refFooter__headline">
                The Foundation Of{" "}
                <span className="refFooter__headlineBold">
                  Hospitality Excellence.
                </span>
              </h2>

              <p className="refFooter__subtext">
                Build a career in hotel operations, culinary arts, travel & tourism,
                and guest experience—guided by industry mentors and hands-on
                training.
              </p>

              <div className="refFooter__ctaRow">
                <Link className="refFooter__cta" to="/contact#form">
                  Apply Now
                  <span className="refFooter__ctaIcon" aria-hidden="true">
                    →
                  </span>
                </Link>

                {/* Contact with icons */}
                <div className="refFooter__contactMini" aria-label="Quick contact">
                  <a
                    className="refFooter__contactLink refFooter__contactLink--icon"
                    href={SITE?.email ? `mailto:${SITE.email}` : "#"}
                  >
                    <span className="refFooter__miniIcon" aria-hidden="true">
                      <MailIcon />
                    </span>
                    <span className="refFooter__contactText">
                      {SITE?.email || "admissions@college.edu"}
                    </span>
                  </a>

                  <a
                    className="refFooter__contactLink refFooter__contactLink--icon"
                    href={SITE?.phone ? `tel:${SITE.phone}` : "#"}
                  >
                    <span className="refFooter__miniIcon" aria-hidden="true">
                      <PhoneIcon />
                    </span>
                    <span className="refFooter__contactText">
                      {SITE?.phone || "+1 (000) 000-0000"}
                    </span>
                  </a>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <section className="refFooter__right" aria-label="Footer navigation">
              <div className="refFooter__cols">
                {/* Quick Links */}
                <div className="refFooter__col">
                  <div className="refFooter__colTitle">Quick Links</div>

                  <Link className="refFooter__link" to="/about">
                    About College
                  </Link>
                  <Link className="refFooter__link" to="/courses">
                    Hotel Management Courses
                  </Link>
                  <Link className="refFooter__link" to="/placement">
                    Placements & Internships
                  </Link>
                  <Link className="refFooter__link" to="/placement">
                    Practical Training Labs
                  </Link>
                  <Link className="refFooter__link" to="/contact">
                    Contact Admissions
                  </Link>
                </div>

                <div className="refFooter__vDivider" aria-hidden="true" />

                {/* Locations */}
                <div className="refFooter__col">
                  <div className="refFooter__colTitle">Locations</div>

                  {localSeoLinks.map((item) => (
                    <Link key={item.to} className="refFooter__link" to={item.to}>
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="refFooter__vDivider" aria-hidden="true" />

                {/* Connect */}
                <div className="refFooter__col">
                  <div className="refFooter__colTitle">Connect</div>

                  <a
                    className="refFooter__socialLink"
                    href={socials.x}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="refFooter__socialSvg" aria-hidden="true">
                      <XIcon />
                    </span>
                    X (Twitter)
                  </a>

                  <a
                    className="refFooter__socialLink"
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="refFooter__socialSvg" aria-hidden="true">
                      <InstagramIcon />
                    </span>
                    Instagram
                  </a>

                  <a
                    className="refFooter__socialLink"
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="refFooter__socialSvg" aria-hidden="true">
                      <FacebookIcon />
                    </span>
                    Facebook
                  </a>

                  <a
                    className="refFooter__socialLink"
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="refFooter__socialSvg" aria-hidden="true">
                      <LinkedInIcon />
                    </span>
                    LinkedIn
                  </a>

                  {/* Campus + Get Directions */}
<div className="refFooter__address" aria-label="Address">
  <div className="refFooter__addressLabel">Campus</div>
  <div className="refFooter__addressText">
    1st Floor, Opp: MR Garden Rd, Parkit, Armur, Telangana 503224
  </div>

  <a
    className="refFooter__directionsBtn"
    href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Opp:+MR+Garden+Rd,+Parkit,+Armur,+Telangana+503224"
    target="_blank"
    rel="noreferrer"
  >
    <span className="refFooter__dirIcon" aria-hidden="true">
      <MapPinIcon />
    </span>
    Get Directions
  </a>
</div>

                </div>
              </div>
            </section>
          </div>

          {/* Bottom bar */}
          <div className="refFooter__bottom" aria-label="Footer bottom bar">
            <div className="refFooter__bottomRow">
              <div className="refFooter__bottomLinks">
                <Link className="refFooter__bottomLink" to="/privacy">
                  Privacy Policy
                </Link>
                <Link className="refFooter__bottomLink" to="/terms">
                  Terms of Use
                </Link>
                <Link className="refFooter__bottomLink" to="/cookies">
                  Cookie Consent
                </Link>
              </div>

              <div className="refFooter__copyright">
                © {year} {SITE?.name || "Hotel Management College"}. All rights
                reserved.
              </div>
            </div>

            {/* NEW: border above credit + centered credit */}
            <div className="refFooter__creditRow">
              <a
                className="refFooter__credit"
                href="https://sriyantratech.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Made with love by SriyantraTech"
              >
                Made with{" "}
                <span className="refFooter__heart" aria-hidden="true">
                  ♥
                </span>{" "}
                <span className="refFooter__creditBrand">SriyantraTech</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .refFooter{
          font-family: var(--font-main);
          background: #fff;
          color: rgba(0,0,0,.86);
          // border-top: 1px solid rgba(0,0,0,.10);
        }

        .refFooter__container{
          max-width: 1200px;
          margin: 0 auto;
          padding: 34px 22px 18px;
        }

        .refFooter__top{
          display: grid;
          grid-template-columns: 1.05fr 1.95fr;
          gap: 36px;
          align-items: start;
        }

        .refFooter__brandRow{
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .refFooter__logoMark{
          width: 50px;
          height: 50px;
          // border-radius: 8px;
          display: grid;
          place-items: center;
          font-weight: 900;
          letter-spacing: .4px;
          // border: 1px solid rgba(0,0,0,.14);
          // background: rgba(0,0,0,.04);
          user-select: none;
          flex: 0 0 auto;
        }

        .refFooter__brandName{
          font-size: 18px;
          font-weight: 650;
          letter-spacing: .2px;
        }

        .refFooter__headline{
          margin: 18px 0 0;
          font-size: 34px;
          line-height: 1.12;
          font-weight: 400;
          letter-spacing: -.2px;
        }

        .refFooter__headlineBold{ font-weight: 700; }

        .refFooter__subtext{
          margin: 14px 0 0;
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(0,0,0,.62);
          max-width: 52ch;
        }

        .refFooter__ctaRow{
          margin-top: 18px;
          display: grid;
          gap: 12px;
        }

        .refFooter__cta{
          width: fit-content;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 0;
          border: 2px solid #1f2a7a;
          color: #fff;
          background: #1f2a7a;
          font-weight: 650;
          font-size: 14px;
          letter-spacing: .2px;
          transition: transform .14s ease, filter .14s ease;
        }

        .refFooter__cta:hover{
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        .refFooter__ctaIcon{
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 2px solid rgba(255,255,255,.65);
          color: #fff;
          background: rgba(255,255,255,.10);
          font-weight: 900;
        }

        .refFooter__contactMini{
          display: grid;
          gap: 10px;
        }

        .refFooter__contactLink{
          color: rgba(0,0,0,.66);
          text-decoration: none;
        }

        .refFooter__contactLink:hover{
          color: rgba(0,0,0,.86);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .refFooter__contactLink--icon{
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          width: fit-content;
        }

        .refFooter__miniIcon{
          width: 26px;
          height: 26px;
          border-radius: 7px;
          display: inline-grid;
          place-items: center;
          // border: 1px solid rgba(0,0,0,.12);
          // background: rgba(0,0,0,.04);
          color: rgba(0,0,0,.76);
          flex: 0 0 auto;
        }

        .refFooter__miniIcon svg{ width: 16px; height: 16px; display: block; }

        .refFooter__cols{
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          column-gap: 22px;
          align-items: start;
        }

        .refFooter__vDivider{
          width: 1px;
          height: 100%;
          min-height: 160px;
          background: rgba(0,0,0,.12);
        }

        .refFooter__colTitle{
          font-size: 18px;
          font-weight: 700;
          color: rgba(0,0,0,.80);
          margin: 4px 0 12px;
        }

        .refFooter__link{
          display: block;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 550;
          color: rgba(0,0,0,.62);
          padding: 8px 0;
          line-height: 1.35;
          transition: color .14s ease, transform .14s ease;
          overflow-wrap: anywhere;
        }

        .refFooter__link:hover{
          color: rgba(0,0,0,.86);
          transform: translateX(1px);
        }

        .refFooter__socialLink{
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 700;
          color: rgba(0,0,0,.62);
          padding: 8px 0;
          transition: color .14s ease, transform .14s ease;
        }

        .refFooter__socialLink:hover{
          color: rgba(0,0,0,.86);
          transform: translateX(1px);
        }

        .refFooter__socialSvg{
          width: 20px;
          height: 20px;
          display: inline-grid;
          place-items: center;
          flex: 0 0 auto;
          color: rgba(0,0,0,.78);
        }

        .refFooter__socialSvg svg{ width: 18px; height: 18px; display: block; }

        .refFooter__address{
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,.10);
        }

        .refFooter__addressLabel{
          font-size: 16px;
          font-weight: 700;
          color: rgba(0,0,0,.72);
        }

        .refFooter__addressText{
          margin-top: 6px;
          font-size: 13px;
          font-weight: 650;
          color: rgba(0,0,0,.60);
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .refFooter__directionsBtn{
          margin-top: 12px;
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 5px;
          border: 1px solid rgba(31,42,122,.22);
          background: rgba(31,42,122,.06);
          color: rgba(31,42,122,.95);
          font-size: 13px;
          font-weight: 900;
          transition: transform .14s ease, background .14s ease, border-color .14s ease;
        }

        .refFooter__directionsBtn:hover{
          transform: translateY(-1px);
          background: rgba(31,42,122,.09);
          border-color: rgba(31,42,122,.30);
        }

        .refFooter__dirIcon{
          width: 18px;
          height: 18px;
          display: inline-grid;
          place-items: center;
        }

        .refFooter__dirIcon svg{ width: 18px; height: 18px; display: block; }

        /* Bottom */
        .refFooter__bottom{
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid rgba(0,0,0,.12);
          display: grid;
          gap: 10px;
        }

        .refFooter__bottomRow{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: center;
        }

        .refFooter__bottomLinks{
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          align-items: center;
        }

        .refFooter__bottomLink{
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          color: rgba(0,0,0,.58);
          transition: color .14s ease;
          padding: 6px 0;
        }

        .refFooter__bottomLink:hover{
          color: rgba(0,0,0,.86);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .refFooter__copyright{
          text-align: right;
          font-size: 13px;
          font-weight: 600;
          color: rgba(0,0,0,.58);
        }

        /* CREDIT ROW with border ABOVE it */
        .refFooter__creditRow{
          display: flex;
          justify-content: center;
          border-top: 1px solid rgba(0,0,0,.12); /* ✅ NEW border above credit */
          padding-top: 10px;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .refFooter__credit{
          text-decoration: none;
          font-size: 15px;
          font-weight: 550;
          color: rgba(0,0,0,.86);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color .14s ease, transform .14s ease;
          padding: 2px 0;
        }

        // .refFooter__credit:hover{
        //   color: rgba(0,0,0,.86);
        //   transform: translateY(-1px);
        // }

        .refFooter__heart{
          color: #e11d48;
          font-weight: 1000;
          line-height: 1;
        }

        .refFooter__creditBrand{ font-weight: 700; }

        .refFooter__cta:focus-visible,
        .refFooter__link:focus-visible,
        .refFooter__socialLink:focus-visible,
        .refFooter__bottomLink:focus-visible,
        .refFooter__contactLink:focus-visible,
        .refFooter__credit:focus-visible,
        .refFooter__directionsBtn:focus-visible{
          outline: 3px solid rgba(31,42,122,.25);
          outline-offset: 3px;
        }

        @media (max-width: 980px){
          .refFooter__top{ grid-template-columns: 1fr; }
          .refFooter__cols{ grid-template-columns: 1fr 1fr; gap: 18px; }
          .refFooter__vDivider{ display: none; }

          .refFooter__col{
            // border: 1px solid rgba(0,0,0,.08);
            // background: rgba(0,0,0,.015);
            // border-radius: 14px;
            padding: 14px 14px 10px;
          }

          .refFooter__col:nth-child(2){ grid-column: 1 / -1; }

          .refFooter__bottomRow{
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
          }

          .refFooter__copyright{ text-align: center; }
        }

        @media (max-width: 560px){
          .refFooter__container{ padding: 28px 16px 16px; }
          .refFooter__headline{ font-size: 28px; }
          .refFooter__cta{ width: 100%; }
          .refFooter__cols{ grid-template-columns: 1fr; }
          .refFooter__col:nth-child(2){ grid-column: auto; }
          .refFooter__bottomLinks{ justify-content: center; gap: 14px; }
        }

        @media (prefers-reduced-motion: reduce){
          .refFooter__cta,
          .refFooter__link,
          .refFooter__socialLink,
          .refFooter__bottomLink,
          .refFooter__contactLink,
          .refFooter__credit,
          .refFooter__directionsBtn{
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

/* Icons */
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.8h15c.8 0 1.5.7 1.5 1.5v9.4c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5V8.3c0-.8.7-1.5 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5.3 8.1 12 13l6.7-4.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .7 3.1.9.5.1.8.5.8 1v3.5c0 .5-.4.9-.9 1C10 22 2 14 3 4.4c.1-.5.5-.9 1-.9h3.5c.5 0 .9.3 1 .8.2 1.1.5 2.1.9 3.1.1.4 0 .9-.2 1.2L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 3h3l-7.5 8.5L22 21h-6l-4.5-6L6 21H3l8-9L2 3h6l4 5 6-5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 3.8h9.6A3.4 3.4 0 0 1 20.2 7.2v9.6a3.4 3.4 0 0 1-3.4 3.4H7.2a3.4 3.4 0 0 1-3.4-3.4V7.2a3.4 3.4 0 0 1 3.4-3.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 16.2A4.2 4.2 0 1 0 12 7.8a4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M17.3 6.9h.01"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.5v-3h2.5v-2.3c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h3l-.5 3h-2.5v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.2 2.4-2.4 4.9-2.4 5.2 0 6.2 3.4 6.2 7.8V24h-5v-7.3c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V24H8z" />
    </svg>
  );
}

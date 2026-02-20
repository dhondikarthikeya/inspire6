import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../config/siteConfig";

const MENU = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/faculty", label: "Faculty" },
  { to: "/courses", label: "Courses" },
  { to: "/admissions", label: "Admissions" },
  { to: "/placement", label: "Placement" },
  { to: "/gallery", label: "Gallery" },
  
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  // iOS-safe scroll lock
  const scrollYRef = useRef(0);

  // ✅ controls whether we restore old scroll position when unlocking body scroll
  // - true: user closed the menu normally (keep their position)
  // - false: menu closed due to navigation (do NOT restore; let the new page start at top)
  const restoreScrollOnUnlockRef = useRef(true);

  // Close drawer on route change (navigation)
  useEffect(() => {
    restoreScrollOnUnlockRef.current = false; // ✅ do not restore old Y on nav
    setOpen(false);
  }, [location.pathname]);

  // Lock background scroll when menu open (works on mobile + iOS)
  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY || 0;

    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      const y = scrollYRef.current;

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";

      // ✅ only restore scroll if menu was closed normally (not via navigation)
      if (restoreScrollOnUnlockRef.current) {
        window.scrollTo(0, y);
      }

      // reset for next open/close cycle
      restoreScrollOnUnlockRef.current = true;
    };
  }, [open]);

  // Close with ESC (treat as normal close => restore position)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        restoreScrollOnUnlockRef.current = true;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Focus close button when opened
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  // Hide header on scroll down (not immediately), show on scroll up
  // ✅ IMPORTANT: do NOT hide header while menu is open
  useEffect(() => {
    lastYRef.current = window.scrollY || 0;

    const HIDE_OFFSET = 120;
    const DELTA_TRIGGER = 12;

    const onScroll = () => {
      if (open) return; // keep header visible when drawer is open
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;
        const delta = y - lastY;

        if (y < HIDE_OFFSET) {
          setHideHeader(false);
        } else if (Math.abs(delta) > DELTA_TRIGGER) {
          if (delta > 0) setHideHeader(true);
          else setHideHeader(false);
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      {/* FIXED HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,.08)",
          transform: hideHeader ? "translateY(-110%)" : "translateY(0)",
          transition: "transform .22s ease",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "6px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* LOGO */}
          <Link
            to="/"
            onClick={() => {
              // treat as navigation close; route effect will set restore false
              setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "#111",
              minWidth: 0,
            }}
          >
            <div className="logoWrap">
              <img
                src="/images/logo.png"
                alt={`${SITE.name} logo`}
                className="logoImg"
              />
            </div>

            {/* Name + location */}
            <div className="brandWrap">
              <div className="brandText">{SITE.name}</div>
              <div className="brandLocation">Armoor, Nizamabad</div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktopNav" aria-label="Primary navigation">
            {MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => {
                  // navigation will close via route effect; just close UI
                  setOpen(false);
                }}
                className={({ isActive }) =>
                  `desktopLink ${isActive ? "active" : ""}`
                }
                style={{
                  padding: "9px 6px",
                  textDecoration: "none",
                  fontWeight: 450,
                  fontSize: 16,
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* MENU BUTTON */}
          <button
            className="menuBtn"
            onClick={() => {
              restoreScrollOnUnlockRef.current = true; // normal open/close cycle
              setOpen(true);
            }}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span className="hamburger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <div
          className={`overlay ${open ? "show" : ""}`}
          onClick={() => {
            restoreScrollOnUnlockRef.current = true; // normal close => restore
            setOpen(false);
          }}
          role="presentation"
        >
          <aside
            className={`drawer ${open ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {/* Drawer header */}
            <div className="drawerHeader">
              <div className="drawerBrand">
                <div className="drawerLogoWrap">
                  <img
                    src="/images/logo.png"
                    alt={`${SITE.name} logo`}
                    className="drawerLogoImg"
                  />
                </div>
                <div className="drawerTitleWrap">
                  <div className="drawerTitle">{SITE.name}</div>
                  <div className="drawerSubtitle">Armoor, Nizamabad</div>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                className="iconBtn"
                onClick={() => {
                  restoreScrollOnUnlockRef.current = true; // normal close => restore
                  setOpen(false);
                }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Menu items */}
            <nav className="drawerNav" aria-label="Mobile navigation">
              {MENU.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => {
                    // navigation close: do NOT restore old scroll
                    restoreScrollOnUnlockRef.current = false;
                    setOpen(false);
                  }}
                  className={({ isActive }) =>
                    `drawerItem ${isActive ? "active" : ""}`
                  }
                >
                  <span className="drawerItemLabel">{item.label}</span>
                  <span className="chev" aria-hidden="true">
                    ›
                  </span>
                </NavLink>
              ))}
            </nav>

            {/* Footer CTA */}
            <div className="drawerFooter">
              <Link
                className="ctaPrimary"
                to="/contact#form"
                onClick={() => {
                  restoreScrollOnUnlockRef.current = false;
                  setOpen(false);
                }}
              >
                Apply Now
              </Link>
              <a
                className="ctaGhost"
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  // opening external link: keep position
                  restoreScrollOnUnlockRef.current = true;
                  setOpen(false);
                }}
              >
                WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {/* STYLES */}
        <style>{`
          .desktopNav { display: flex; gap: 14px; align-items: center; }

          .brandWrap{
            display: flex;
            flex-direction: column;
            min-width: 0;
          }
          .brandText{
            font-weight: 550;
            font-size: 24px;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #111;
            min-width: 0;
          }
          .brandLocation{
            font-weight: 500;
            font-size: 14px;
            color: rgba(0,0,0,.65);
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          @media (max-width: 1024px){
            .brandText{
              font-size: 18px;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              max-width: 220px;
            }
            .brandLocation{
              font-size: 13px;
              max-width: 220px;
            }
          }

          /* Desktop links: blue text on hover + BLACK underline */
          .desktopLink {
            color: #111;
            position: relative;
            display: inline-block;
            padding-bottom: 2px;
            transition: color .18s ease;
          }
          .desktopLink::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -2px;
            width: 100%;
            height: 3px;
            background: #111;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform .18s ease;
            border-radius: 8px 8px 0px 0px;
          }
          .desktopLink:hover { color: #2563eb; }
          .desktopLink:hover::after { transform: scaleX(1); }
          .desktopLink.active { color: #2563eb; }
          .desktopLink.active::after { transform: scaleX(1); }

          /* Logo image containers */
          .logoWrap {
            width: 85px;
            height: 75px;
            display: grid;
            place-items: center;
            overflow: hidden;
            flex: 0 0 auto;
          }
          .logoImg {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* Menu button: hidden by default (desktop) */
          .menuBtn {
            display: none;
            width: 44px;
            height: 44px;
            border-radius: 5px;
            border: 1px solid rgba(0,0,0,.10);
            background: #fff;
            cursor: pointer;
            align-items: center;
            justify-content: center;
          }

          /* SHOW hamburger ONLY on tablet + mobile */
          @media (max-width: 1024px) {
            .desktopNav { display: none; }
            .menuBtn { display: inline-flex; }
          }

          .hamburger { width: 18px; display: grid; gap: 4px; }
          .hamburger span {
            height: 2px;
            background: #111;
            border-radius: 999px;
            display: block;
          }

          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, .45);
            opacity: 0;
            pointer-events: none;
            transition: opacity .18s ease;
            z-index: 999;
            overscroll-behavior: contain;
            touch-action: none;
          }
          .overlay.show {
            opacity: 1;
            pointer-events: auto;
          }

          .drawer {
            position: fixed;
            top: 0;
            right: 0;
            height: 100dvh;
            width: min(360px, 92vw);
            background: #fff;
            box-shadow: -18px 0 50px rgba(0,0,0,.18);
            transform: translateX(14px);
            opacity: 0;
            transition: transform .2s ease, opacity .2s ease;
            display: flex;
            flex-direction: column;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            overscroll-behavior: contain;
            touch-action: pan-y;
          }
          .drawer.open {
            transform: translateX(0);
            opacity: 1;
          }

          .drawerHeader {
            padding: 16px 16px 12px 16px;
            border-bottom: 1px solid rgba(0,0,0,.07);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .drawerBrand {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
          }

          .drawerLogoWrap {
            width: 50px;
            height: 50px;
            background: #fff;
            display: grid;
            place-items: center;
            overflow: hidden;
            flex: 0 0 auto;
          }
          .drawerLogoImg {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .drawerTitleWrap { min-width: 0; }
          .drawerTitle {
            font-weight: 700;
            line-height: 1.15;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #0f172a;
          }
          .drawerSubtitle {
            font-size: 12px;
            color: rgba(15, 23, 42, .65);
            margin-top: 2px;
          }

          .iconBtn {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            border: 1px solid rgba(0,0,0,.10);
            background: #fff;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            display: grid;
            place-items: center;
            transition: transform .15s ease, background .15s ease;
          }
          .iconBtn:active { transform: scale(.98); }
          .iconBtn:hover { background: rgba(0,0,0,.04); }

          .drawerNav {
            padding: 12px 12px 0 12px;
            overflow: auto;
            flex: 1 1 auto;
            -webkit-overflow-scrolling: touch;
          }

          .drawerItem {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 14px 14px 12px 14px;
            text-decoration: none;
            font-weight: 550;
            color: #111;
            margin-bottom: 10px;
            position: relative;
            transition: color .18s ease;
          }
          .drawerItem::after {
            content: "";
            position: absolute;
            left: 14px;
            right: 14px;
            bottom: 6px;
            height: 3.5px;
            background: #111;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform .18s ease;
            border-radius: 10px 10px 0px 0px;
          }
          .drawerItem:hover { color: #2563eb; }
          .drawerItem:hover::after { transform: scaleX(1); }
          .drawerItem.active { color: #2563eb; }
          .drawerItem.active::after { transform: scaleX(1); }

          .drawerItemLabel { font-size: 15px; }
          .chev { opacity: .55; font-size: 18px; }

          .drawerFooter {
            padding: 14px 16px 16px 16px;
            border-top: 1px solid rgba(0,0,0,.07);
            display: grid;
            gap: 10px;
          }

          .ctaPrimary, .ctaGhost {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 44px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 650;
            letter-spacing: .2px;
          }
          .ctaPrimary {
            background: linear-gradient(135deg,#2563eb,#ffb347);
            color: #fff;
            box-shadow: 0 12px 26px rgba(255,140,0,.22);
          }
          .ctaGhost {
            background: #fff;
            color: #0f172a;
            border: 1px solid rgba(15, 23, 42, .12);
          }
        `}</style>
      </header>

      {/* Spacer so content doesn't hide behind fixed header */}
      <div style={{ height: 72 }} />
    </>
  );
}

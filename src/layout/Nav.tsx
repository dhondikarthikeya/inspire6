import { NavLink, NavLinkProps } from "react-router-dom";

const linkStyle: NavLinkProps["style"] = ({ isActive }) => ({
  padding: "10px 16px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  color: isActive ? "#ff8c00" : "#111",
  transition: "all .2s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

export default function Nav() {
  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/courses", label: "Courses" },
    { to: "/admissions", label: "Admissions" },
    { to: "/facilities", label: "Facilities" },
    { to: "/gallery", label: "Gallery" },
    // { to: "/notices", label: "Notices" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="navLinks">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={linkStyle}
            className="navItem"
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <style>{`
        /* Desktop Layout */
        .navLinks {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* Hover effect */
        .navItem:hover {
          color: #ff8c00 !important;
          background: rgba(255,140,0,.06);
        }

        /* Animated underline */
        .navItem::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 0%;
          height: 2px;
          background: #ff8c00;
          transition: all .25s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .navItem:hover::after {
          width: 60%;
        }

        /* Mobile Layout */
        @media (max-width: 1024px) {
          .navLinks {
            flex-direction: column;
            gap: 12px;
            width: 100%;
          }

          .navLinks a {
            width: 100%;
            border-radius: 14px;
            padding: 14px 18px !important;
            background: #fff;
            border: 1px solid rgba(0,0,0,.06);
            justify-content: space-between;
          }

          .navLinks a:hover {
            transform: translateX(6px);
            background: rgba(255,140,0,.05);
          }

          /* Remove underline animation on mobile */
          .navItem::after {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopInstant from "../components/ScrollToTopInstant";
import whatsappIcon from "../assets/whatsapp.avif";

export default function SiteLayout() {
  const message =
    "Hi Inspire ICHM–Armoor, Name: - Phone: - Course: Advanced Diploma In Hotel Management Please share eligibility, fees & admission steps.";

  const phone = "918188855564"; 
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <Header />

      <ScrollRestoration getKey={(location) => location.pathname} />
      <ScrollToTopInstant />

      <main style={{ minHeight: "70vh", overflow: "visible" }}>
        <Outlet />
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 9999,
        }}
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp Chat"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            transition: "transform 0.3s ease",
          }}
        />
      </a>
    </>
  );
}
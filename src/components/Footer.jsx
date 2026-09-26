import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [clockString, setClockString] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const dateText = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const timeText = now.toLocaleTimeString();
      setClockString(`${timeText} · ${dateText}`);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4 g-lg-5">
          {/* Brand & Mission Column */}
          <div className="col-lg-4 mb-2 mb-lg-0">
            <Link to="/" className="d-inline-block mb-3">
              <img className="footer-logo" src="/assets/Images/logo.png?v=4" alt="FreshFind logo" />
            </Link>
            <p className="text-light opacity-75 mb-3" style={{ lineHeight: "1.65", fontSize: "0.93rem" }}>
              Discover local farmers markets, seasonal produce, and authentic farm stalls across Karachi in one simple, unified place.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-2 py-1 small">
                <i className="bi bi-geo-alt-fill text-warning me-1"></i>Karachi, Sindh
              </span>
              <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-2 py-1 small">
                <i className="bi bi-patch-check-fill text-success me-1"></i>Verified Local Stalls
              </span>
            </div>
            <div className="small text-light opacity-75">
              <div className="mb-1">
                <i className="bi bi-envelope-fill text-warning me-2"></i>contact@freshfind.example
              </div>
              <div>
                <i className="bi bi-telephone-fill text-success me-2"></i>+92 (21) 111-FRESH (Demo)
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5>Explore</h5>
            <div className="d-grid gap-2 mt-3 footer-links">
              <Link to="/markets">Market Directory</Link>
              <Link to="/produce">Produce Guide</Link>
              <Link to="/seasonal">Seasonal Guide</Link>
              <Link to="/bookmarks">Saved Bookmarks</Link>
              <Link to="/find-market">Find a Market</Link>
            </div>
          </div>

          {/* About & Support Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5>Quick Links</h5>
            <div className="d-grid gap-2 mt-3 footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/highlights">Market Highlights</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/feedback">Feedback Form</Link>
              <Link to="/contact">Contact Support</Link>
            </div>
          </div>

          {/* Connect & Community Column */}
          <div className="col-md-6 col-lg-4">
            <h5>Stay Connected</h5>
            <p className="mt-3 text-light opacity-75 small mb-3">
              Recommend fresh seasonal produce or your favorite neighborhood farmers market to friends &amp; family.
            </p>
            <div className="socials d-flex gap-2 mb-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
            <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div className="small fw-semibold text-white mb-1">
                <i className="bi bi-chat-heart text-warning me-1"></i>Got Market Feedback?
              </div>
              <p className="text-light opacity-75 small mb-2" style={{ fontSize: "0.82rem" }}>
                Help us verify stalls and improve produce details in your neighborhood.
              </p>
              <Link to="/feedback" className="btn btn-outline-green btn-sm w-100 py-1" style={{ fontSize: "0.82rem" }}>
                <i className="bi bi-pencil-square me-1"></i>Submit Feedback
              </Link>
            </div>
          </div>
        </div>

        {/* Clean Single Bottom Divider and Balanced Info Row */}
        <hr className="border-white border-opacity-10 my-4" />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="small text-light opacity-75">
            &copy; 2026 FreshFind &mdash; Discover Local Farmers Markets &amp; Seasonal Produce.
          </div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "0.82rem",
              color: "#d7e5da"
            }}
          >
            <i className="bi bi-clock-history text-warning"></i>
            <span>{clockString}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

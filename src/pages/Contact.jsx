import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import Breadcrumb from "../components/Breadcrumb";
import marketsData from "../data/markets.json";
import { calculateDistance, formatDistance } from "../utils/distance";
import { useToast } from "../components/Toast";

const KARACHI_HUB = {
  name: "FreshFind Support & Operations Hub",
  address: "I.I. Chundrigar Road, Karachi, Sindh, Pakistan",
  lat: 24.8607,
  lng: 67.0011,
  phone: "+92 (21) 111-FRESH (37374)",
  email: "contact@freshfind.example"
};

function isValidName(v) {
  return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test((v || "").trim());
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

export default function Contact() {
  const { addToast } = useToast();
  const allMarkets = marketsData.markets || [];

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Map & Geo state
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userCircleRef = useRef(null);
  const routingLineRef = useRef(null);
  const marketMarkersRef = useRef([]);

  const [geoStatus, setGeoStatus] = useState({
    visible: false,
    loading: false,
    message: "",
    coords: ""
  });
  const [nearestMarket, setNearestMarket] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [KARACHI_HUB.lat, KARACHI_HUB.lng],
          zoom: 12,
          scrollWheelZoom: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Custom DivIcon for Hub
        const hubIcon = L.divIcon({
          className: "custom-leaflet-pin-wrapper",
          html: '<div class="custom-hub-pin"><i class="bi bi-star-fill"></i></div>',
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36]
        });

        const hubPopupHtml = `
          <div class="p-2" style="max-width: 260px;">
            <span class="badge bg-gold text-dark mb-1"><i class="bi bi-building me-1"></i>Main Support Hub</span>
            <h6 class="fw-bold mb-1 text-dark">${KARACHI_HUB.name}</h6>
            <p class="small text-secondary mb-2">${KARACHI_HUB.address}</p>
            <div class="small text-muted mb-2">
              <div><i class="bi bi-telephone text-success me-1"></i>${KARACHI_HUB.phone}</div>
              <div><i class="bi bi-envelope text-primary me-1"></i>${KARACHI_HUB.email}</div>
            </div>
            <span class="badge bg-success-subtle text-success border border-success-subtle small">Operations HQ</span>
          </div>
        `;

        L.marker([KARACHI_HUB.lat, KARACHI_HUB.lng], { icon: hubIcon })
          .addTo(map)
          .bindPopup(hubPopupHtml);

        // Custom DivIcon for Markets
        const marketIcon = L.divIcon({
          className: "custom-leaflet-pin-wrapper",
          html: '<div class="custom-market-pin"><i class="bi bi-shop"></i></div>',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -32]
        });

        // Add Market Markers
        const markers = [];
        allMarkets.forEach((m) => {
          if (typeof m.latitude === "number" && typeof m.longitude === "number") {
            const popupHtml = `
              <div class="p-2" style="max-width: 250px;">
                <span class="badge bg-success text-white mb-1"><i class="bi bi-shop me-1"></i>${m.location}</span>
                <h6 class="fw-bold mb-1 text-dark">${m.name}</h6>
                <div class="small text-secondary mb-2">${m.address || m.location}</div>
                <div class="small text-muted mb-2">
                  <div><i class="bi bi-calendar-event me-1"></i><strong>Days:</strong> ${m.days}</div>
                  <div><i class="bi bi-clock me-1"></i><strong>Hours:</strong> ${m.hours}</div>
                </div>
                <a href="/markets/${m.id}" class="btn btn-outline-green btn-sm w-100 mt-1">
                  <i class="bi bi-arrow-right-circle me-1"></i>View Market Details
                </a>
              </div>
            `;

            const marker = L.marker([m.latitude, m.longitude], { icon: marketIcon })
              .addTo(map)
              .bindPopup(popupHtml);

            markers.push(marker);
          }
        });

        marketMarkersRef.current = markers;
        mapInstanceRef.current = map;
      } catch (err) {
        console.error("Leaflet initialization error:", err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [allMarkets]);

  // Geolocation trigger
  const handleGeolocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your current browser.");
      return;
    }

    setGeoStatus({
      visible: true,
      loading: true,
      message: "Requesting GPS coordinates from browser...",
      coords: ""
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 25);

        setGeoStatus({
          visible: true,
          loading: false,
          message: "Live Geolocation Active: Position detected successfully.",
          coords: `Lat: ${userLat.toFixed(4)}°, Lon: ${userLon.toFixed(4)}° (±${accuracy}m)`
        });

        const map = mapInstanceRef.current;
        if (!map) return;

        // Custom User Pin
        const userIcon = L.divIcon({
          className: "custom-user-pin-wrapper",
          html: '<div class="user-geo-pulse"></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          popupAnchor: [0, -12]
        });

        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
        if (userCircleRef.current) map.removeLayer(userCircleRef.current);

        userMarkerRef.current = L.marker([userLat, userLon], {
          icon: userIcon,
          zIndexOffset: 1000
        }).addTo(map);

        userMarkerRef.current.bindPopup(`
          <div class="p-2 text-center">
            <span class="badge bg-primary text-white mb-1"><i class="bi bi-person-fill me-1"></i>Your Current Location</span>
            <div class="small fw-semibold mt-1">Accuracy: within ~${accuracy} meters</div>
          </div>
        `);

        userCircleRef.current = L.circle([userLat, userLon], {
          radius: accuracy,
          color: "#0d6efd",
          fillColor: "#0d6efd",
          fillOpacity: 0.12,
          weight: 1
        }).addTo(map);

        // Find nearest market
        let closest = null;
        let shortestDist = Infinity;

        allMarkets.forEach((m) => {
          if (typeof m.latitude === "number" && typeof m.longitude === "number") {
            const d = calculateDistance(userLat, userLon, m.latitude, m.longitude);
            if (d < shortestDist) {
              shortestDist = d;
              closest = m;
            }
          }
        });

        if (routingLineRef.current) map.removeLayer(routingLineRef.current);

        if (closest) {
          setNearestMarket(closest);
          setNearestDistance(shortestDist);

          routingLineRef.current = L.polyline(
            [[userLat, userLon], [closest.latitude, closest.longitude]],
            { color: "#2c6b47", weight: 3, dashArray: "6, 8", opacity: 0.8 }
          ).addTo(map);

          const bounds = L.latLngBounds([
            [userLat, userLon],
            [closest.latitude, closest.longitude]
          ]);
          map.fitBounds(bounds, { padding: [60, 60], animate: true });
        } else {
          map.setView([userLat, userLon], 14, { animate: true });
        }
      },
      (err) => {
        setGeoStatus({
          visible: true,
          loading: false,
          message:
            err.code === 1
              ? "Location permission was denied by the browser."
              : "Could not retrieve your position. Please check GPS settings.",
          coords: ""
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetHub = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([KARACHI_HUB.lat, KARACHI_HUB.lng], 13, { animate: true });
    }
  };

  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const points = [[KARACHI_HUB.lat, KARACHI_HUB.lng]];
    marketMarkersRef.current.forEach((m) => {
      points.push(m.getLatLng());
    });
    if (userMarkerRef.current) {
      points.push(userMarkerRef.current.getLatLng());
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50], animate: true });
  };

  // Contact Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "This field is required.";
    } else if (!isValidName(form.name)) {
      newErrors.name = "Please enter a valid name (letters only, min 2 chars).";
    }

    if (!form.email.trim()) {
      newErrors.email = "This field is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "This field is required.";
    }

    if (!form.message.trim()) {
      newErrors.message = "This field is required.";
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });

    if (Object.keys(newErrors).length === 0) {
      addToast("Your message has been sent successfully! (Demo simulation — no server dispatch)", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTouched({});
      setErrors({});
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Contact Us", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Get in Touch</span>
          <h1 className="mt-3">Contact FreshFind</h1>
          <p className="section-sub mb-0">
            Have a question about markets, produce availability, or partnership opportunities? Reach out to us below.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="row g-5">
            {/* Contact Information Column */}
            <div className="col-lg-5">
              <span className="badge-soft">Direct Reach</span>
              <h2 className="section-title mt-3">We're Here to Help</h2>
              <p className="text-secondary">
                Use the details below to contact our team directly for platform questions, market registrations, or media queries.
              </p>

              <div className="d-grid gap-3 mt-4">
                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <strong>Email Us</strong>
                    <div className="text-secondary">
                      <a href="mailto:hello@freshfind.example" className="text-decoration-none text-success">
                        hello@freshfind.example
                      </a>{" "}
                      <span className="badge bg-secondary-subtle text-secondary small">Demo</span>
                    </div>
                  </div>
                </div>

                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <strong>Call Us</strong>
                    <div className="text-secondary">
                      <a href="tel:+923000000000" className="text-decoration-none text-success">
                        +92 (300) 000-0000
                      </a>{" "}
                      <span className="badge bg-secondary-subtle text-secondary small">Demo</span>
                    </div>
                  </div>
                </div>

                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <strong>Office Address</strong>
                    <div className="text-secondary">
                      Shahrah-e-Faisal / Clifton Promenade, Karachi, Sindh, Pakistan
                    </div>
                  </div>
                </div>

                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <strong>Operating Hours</strong>
                    <div className="text-secondary small">
                      Monday &ndash; Friday: 09:00 AM &ndash; 06:00 PM (PKT)
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-light border small text-muted mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-chat-heart text-success fs-5"></i>
                <div>
                  Looking to rate your website experience or suggest a market? Check out our dedicated{" "}
                  <Link to="/feedback" className="text-success fw-bold text-decoration-underline">
                    Feedback Page
                  </Link>
                  .
                </div>
              </div>
            </div>

            {/* Contact Us Form Column */}
            <div className="col-lg-7">
              <div className="info-card p-4 p-lg-5 shadow-sm border rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge-soft">
                    <i className="bi bi-envelope-paper me-1"></i>Contact Us Form
                  </span>
                  <span className="small text-muted">* Required fields</span>
                </div>
                <h2 className="h3 mt-2 mb-1 fw-bold">Send Us a Message</h2>
                <p className="text-secondary small mb-4">
                  Leave your details and message, and our team will get back to you promptly.
                </p>

                <form onSubmit={handleFormSubmit} noValidate>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="contactName">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${touched.name ? (errors.name ? "is-invalid" : "is-valid") : ""}`}
                        id="contactName"
                        placeholder="e.g. Bilal Ahmed"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="contactEmail">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${touched.email ? (errors.email ? "is-invalid" : "is-valid") : ""}`}
                        id="contactEmail"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Subject */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="contactSubject">
                        Subject / Inquiry <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${touched.subject ? (errors.subject ? "is-invalid" : "is-valid") : ""}`}
                        id="contactSubject"
                        placeholder="How can we assist you?"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                      {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" htmlFor="contactMessage">
                        Your Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className={`form-control ${touched.message ? (errors.message ? "is-invalid" : "is-valid") : ""}`}
                        id="contactMessage"
                        rows="5"
                        placeholder="Write your questions or inquiries here..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      ></textarea>
                      {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-4">
                      <button className="btn btn-green w-100 py-2 fs-6 fw-bold" type="submit">
                        <i className="bi bi-send-fill me-2"></i>Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Geolocation Map Section */}
          <div className="info-card p-4 p-md-5 mt-5 shadow-sm border rounded-4" id="office-location-map">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <span className="badge-soft mb-2">
                  <i className="bi bi-geo-alt-fill me-1"></i>Interactive Geolocation Map
                </span>
                <h3 className="h4 fw-bold mb-1">Our Location &amp; Live Geolocation Hub</h3>
                <p className="text-secondary small mb-0">
                  Discover our Karachi Support &amp; Operations Hub and locate your nearest farmers market with real-time GPS.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  onClick={handleGeolocateMe}
                  disabled={geoStatus.loading}
                >
                  {geoStatus.loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Locating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-crosshair me-1"></i>Locate My Position
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetHub}
                >
                  <i className="bi bi-building me-1"></i>Karachi Hub
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleFitAll}
                >
                  <i className="bi bi-shop me-1"></i>All Markets
                </button>
              </div>
            </div>

            {/* Geolocation Status Alert */}
            {geoStatus.visible && (
              <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span>
                    <i className="bi bi-geo-fill me-1"></i>
                    {geoStatus.message}
                  </span>
                  {geoStatus.coords && (
                    <span className="badge bg-light text-dark border">{geoStatus.coords}</span>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Map Canvas */}
            <div className="rounded-4 overflow-hidden shadow-sm border mt-2 position-relative">
              <div ref={mapContainerRef} style={{ height: "420px", width: "100%", zIndex: 1 }}></div>
            </div>

            {/* Nearest Market Readout when GPS active */}
            {nearestMarket && (
              <div className="mt-4 p-3 rounded-4 bg-light border">
                <div className="row align-items-center g-3">
                  <div className="col-md-7">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-success text-white">
                        <i className="bi bi-compass me-1"></i>Nearest Market to You
                      </span>
                      <span className="badge bg-warning-subtle text-dark border border-warning-subtle fw-bold">
                        {formatDistance(nearestDistance)}
                      </span>
                    </div>
                    <h5 className="h6 fw-bold mb-1">{nearestMarket.name}</h5>
                    <div className="text-secondary small">
                      {nearestMarket.location} &bull; {nearestMarket.days} &bull; {nearestMarket.hours}
                    </div>
                  </div>
                  <div className="col-md-5 d-flex justify-content-md-end gap-2">
                    <Link to={`/markets/${nearestMarket.id}`} className="btn btn-outline-green btn-sm">
                      <i className="bi bi-eye me-1"></i>View Details
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${nearestMarket.latitude},${nearestMarket.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-green btn-sm"
                    >
                      <i className="bi bi-cursor-fill me-1"></i>Get Directions
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-2 text-secondary small">
              <div>
                <i className="bi bi-pin-map-fill text-danger me-1"></i>FreshFind Hub: I.I. Chundrigar Road, Karachi, Sindh (24.8607° N, 67.0011° E)
              </div>
              <div>
                <i className="bi bi-shield-check text-success me-1"></i>Interactive OpenStreetMap &amp; Leaflet Geolocation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-soft">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge-soft">Frequently asked</span>
            <h2 className="section-title mt-3">Before you contact us</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <h3 className="h5">Want to find a market?</h3>
                <p className="text-secondary mb-0">
                  Use the Find Market page to filter by neighborhood area, operating day and seasonal produce.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <h3 className="h5">Want to save favorites?</h3>
                <p className="text-secondary mb-0">
                  Browse the Market Directory and Produce Guide, then keep a note of your favorites in Bookmarks.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <h3 className="h5">Looking to send feedback?</h3>
                <p className="text-secondary mb-0">
                  Visit our dedicated{" "}
                  <Link to="/feedback" className="text-success fw-bold">
                    Feedback page
                  </Link>{" "}
                  to submit ratings and suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

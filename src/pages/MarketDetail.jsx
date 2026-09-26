import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import L from "leaflet";
import Breadcrumb from "../components/Breadcrumb";
import marketsData from "../data/markets.json";
import { isBookmarked, toggleBookmark, getBookmarkNote } from "../utils/storage";
import { generateMarketDetailsDoc, downloadTextFile } from "../utils/exportDoc";
import { getProduceMeta } from "../utils/produceMeta";
import { calculateDistance, formatDistance } from "../utils/distance";
import { useModals } from "../context/ModalContext";
import { useToast } from "../components/Toast";

const WEEK_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MarketDetail() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const { openShare } = useModals();
  const { addToast } = useToast();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const marketMarkerRef = useRef(null);

  const [distanceInfo, setDistanceInfo] = useState(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const allMarkets = marketsData.markets || [];

  // Determine market ID from route param, URL hash, or query param
  const activeId = (
    paramId ||
    location.hash.replace("#", "") ||
    new URLSearchParams(location.search).get("id") ||
    "clifton"
  ).toLowerCase();

  const market = allMarkets.find((m) => m.id.toLowerCase() === activeId) || allMarkets[0];

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (market) {
      setSaved(isBookmarked("markets", market.id));
      document.title = `${market.name} | FreshFind`;
      setDistanceInfo(null);
      setGeoError(null);
    }
  }, [market]);

  if (!market) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Market not found.</div>
        <Link to="/markets" className="btn btn-green mt-3">
          Back to Markets
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    const nowSaved = toggleBookmark("markets", market.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
  };

  const handleShareClick = () => {
    const shareUrl = `/markets/${market.id}`;
    openShare(
      market.name,
      `Discover ${market.name} in ${market.location} on FreshFind!`,
      shareUrl
    );
  };

  const handleDownloadDoc = () => {
    const note = getBookmarkNote("markets", market.id);
    const content = generateMarketDetailsDoc(market, note);
    downloadTextFile(`FreshFind_${market.name.replace(/\s+/g, "_")}.txt`, content);
    addToast("Market details summary downloaded!", "success");
  };

  const days = market.daysList ? market.daysList.join(", ") : market.days;
  const openDays = market.daysList || [];
  const mapQuery = encodeURIComponent(`${market.name}, ${market.location}, Karachi, Sindh`);

  const addressDisplay = market.address || `${market.location}, Karachi, Sindh (Demo Location)`;
  const phoneDisplay = market.phone || "+92 (21) 111-FRESH (Demo)";
  const emailDisplay = market.email || "market@freshfind.example (Demo)";
  const websiteDisplay = market.website || "https://freshfind.example (Demo)";
  const socialFb = market.social && market.social.facebook ? market.social.facebook : "FreshFindDemo";
  const socialIg = market.social && market.social.instagram ? market.social.instagram : "@freshfind_demo";

  const marketLat = typeof market.latitude === "number" ? market.latitude : 24.8607;
  const marketLng = typeof market.longitude === "number" ? market.longitude : 67.0011;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Teardown previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [marketLat, marketLng],
        zoom: 14,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom DivIcon for Market
      const marketIcon = L.divIcon({
        className: "custom-leaflet-pin-wrapper",
        html: '<div class="custom-market-pin"><i class="bi bi-shop"></i></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -34]
      });

      const popupHtml = `
        <div class="p-2" style="max-width: 250px;">
          <span class="badge bg-success text-white mb-1"><i class="bi bi-shop me-1"></i>${market.location}</span>
          <h6 class="fw-bold mb-1 text-dark">${market.name}</h6>
          <div class="small text-secondary mb-2">${addressDisplay}</div>
          <div class="small text-muted mb-2">
            <div><i class="bi bi-calendar-event me-1"></i><strong>Days:</strong> ${days}</div>
            <div><i class="bi bi-clock me-1"></i><strong>Hours:</strong> ${market.hours}</div>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${marketLat},${marketLng}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-green btn-sm w-100 mt-1">
            <i class="bi bi-signpost-split me-1"></i>Get Turn-by-Turn Directions
          </a>
        </div>
      `;

      const marker = L.marker([marketLat, marketLng], { icon: marketIcon })
        .addTo(map)
        .bindPopup(popupHtml)
        .openPopup();

      marketMarkerRef.current = marker;
      mapInstanceRef.current = map;

      // Ensure proper tile sizing after mount
      const resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      return () => clearTimeout(resizeTimer);
    } catch (err) {
      console.error("Leaflet map initialization error:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [market.id, marketLat, marketLng, addressDisplay, days]);

  const handleFindMyDistance = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your current browser.");
      addToast("Geolocation is not supported by your browser.", "warning");
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const distKm = calculateDistance(uLat, uLng, marketLat, marketLng);
        setDistanceInfo(distKm);
        setLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          const userIcon = L.divIcon({
            className: "custom-user-pin-wrapper",
            html: '<div class="user-geo-pulse"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, -12]
          });

          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }

          userMarkerRef.current = L.marker([uLat, uLng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div class="p-1 fw-bold text-primary"><i class="bi bi-person-fill me-1"></i>Your Current Location</div>')
            .openPopup();

          map.fitBounds([
            [uLat, uLng],
            [marketLat, marketLng]
          ], { padding: [50, 50], maxZoom: 15 });
        }

        addToast(`Distance to ${market.name}: ${formatDistance(distKm)}`, "success");
      },
      (err) => {
        setLocating(false);
        let msg = "Could not retrieve your location. Please check location permissions.";
        if (err.code === 1) msg = "Location permission denied. Please allow location access in your browser.";
        setGeoError(msg);
        addToast(msg, "warning");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([marketLat, marketLng], 14);
      if (marketMarkerRef.current) {
        marketMarkerRef.current.openPopup();
      }
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Market Directory", url: "/markets" },
          { label: market.name, active: true }
        ]}
      />

      <main className="detail-section">
        <div className="container">
          {/* Cover Hero Banner */}
          <div className="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
            <div className="detail-cover-content p-4 p-md-5">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <span className="badge bg-white text-success fw-bold px-3 py-2">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {market.location}
                </span>
                <span className="badge bg-dark bg-opacity-50 text-white px-3 py-2">
                  <i className="bi bi-shop me-1"></i>
                  {market.type || "Outdoor"} Market
                </span>
                {market.organic && (
                  <span className="badge bg-success text-white px-3 py-2">
                    <i className="bi bi-flower1 me-1"></i>Organic Available
                  </span>
                )}
              </div>
              <h1 className="display-5 fw-bold text-white mb-2">{market.name}</h1>
              <p className="lead text-white-50 mb-0">{market.description}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge-soft">
                <i className="bi bi-star-fill me-1" style={{ color: "var(--gold-500)" }}></i>
                {market.rating ? market.rating.toFixed(1) : "4.5"} rating
              </span>
              <span className="badge-soft">
                <i className="bi bi-calendar-check me-1"></i>
                {market.days}
              </span>
              <span className="badge-soft">
                <i className="bi bi-clock me-1"></i>
                {market.hours}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                type="button"
                className={`bookmark-btn ${saved ? "saved" : ""}`}
                title={saved ? "Remove bookmark" : "Save bookmark"}
                onClick={handleBookmarkToggle}
              >
                <i className={`bi ${saved ? "bi-bookmark-star-fill" : "bi-bookmark"}`}></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                title="Download market details as formatted text document"
                onClick={handleDownloadDoc}
              >
                <i className="bi bi-download me-1"></i>Download Details
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm share-trigger-btn"
                title="Share this market"
                onClick={handleShareClick}
              >
                <i className="bi bi-share me-1"></i>Share Market
              </button>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Contact Information Card */}
            <div className="col-lg-5">
              <div className="detail-card p-4 h-100 shadow-sm border">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-telephone-inbound-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Market Contact Information</h3>
                </div>
                <p className="text-secondary small mb-3">Verified contact and location details for market visitors:</p>

                <ul className="list-unstyled mb-4 d-grid gap-3">
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-danger fs-5">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Location &amp; Address</div>
                      <div className="text-secondary small">{addressDisplay}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-success fs-5">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Phone Number</div>
                      <div className="small">
                        <a href={`tel:${phoneDisplay.replace(/[^0-9+]/g, "")}`} className="text-decoration-none text-success fw-semibold">
                          {phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-primary fs-5">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Email Address</div>
                      <div className="small">
                        <a href={`mailto:${emailDisplay}`} className="text-decoration-none text-primary">
                          {emailDisplay}
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-warning fs-5">
                      <i className="bi bi-clock-fill"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Operating Hours</div>
                      <div className="text-secondary small">{market.hours}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-info fs-5">
                      <i className="bi bi-calendar3"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Available Days</div>
                      <div className="text-secondary small">{market.days}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-secondary fs-5">
                      <i className="bi bi-globe2"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Website</div>
                      <div className="small">
                        <a href={websiteDisplay} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                          {websiteDisplay}
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-danger fs-5">
                      <i className="bi bi-share-fill"></i>
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">Social Media</div>
                      <div className="small text-secondary d-flex gap-3 mt-1">
                        <span className="text-primary">
                          <i className="bi bi-facebook me-1"></i>
                          {socialFb}
                        </span>
                        <span className="text-danger">
                          <i className="bi bi-instagram me-1"></i>
                          {socialIg}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="alert alert-light border small text-muted mb-0 py-2">
                  <i className="bi bi-info-circle me-1"></i>Demo/placeholder contact fields for project demonstration.
                </div>
              </div>
            </div>

            {/* Weekly Operating Schedule Table */}
            <div className="col-lg-7">
              <div className="detail-card p-4 h-100 shadow-sm border d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="product-icon">
                      <i className="bi bi-calendar-week-fill"></i>
                    </div>
                    <h3 className="h5 mb-0 fw-bold">Weekly Operating Schedule</h3>
                  </div>
                  <p className="text-secondary small mb-3">Check which days stalls are active and planning hours:</p>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle schedule-table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Day of the Week</th>
                          <th>Opening Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WEEK_ORDER.map((day) => {
                          const isOpen = openDays.includes(day);
                          return (
                            <tr key={day} className={isOpen ? "today-row table-success fw-semibold" : ""}>
                              <td>
                                {isOpen ? (
                                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                                ) : (
                                  <i className="bi bi-dash-circle text-muted me-2"></i>
                                )}
                                {day}
                              </td>
                              <td>{isOpen ? market.hours : <span className="text-muted">Closed</span>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typically Available Produce Section */}
          <div className="detail-card p-4 p-md-5 mb-4 shadow-sm border">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <span className="badge-soft mb-2">
                  <i className="bi bi-basket2 me-1"></i>Seasonal Stalls
                </span>
                <h3 className="h4 fw-bold mb-1">Typically Available Produce</h3>
                <p className="text-secondary small mb-0">Directly supplied by local growers and verified sellers at this market:</p>
              </div>
              <Link to="/produce" className="btn btn-outline-green btn-sm">
                <i className="bi bi-journal-bookmark me-1"></i>View Full Produce Guide
              </Link>
            </div>
            <div className="d-flex flex-wrap gap-3 pt-2">
              {(market.produce || []).map((item) => {
                const meta = getProduceMeta(item);
                return (
                  <div
                    key={item}
                    className="mini-produce-card p-2 px-3 d-flex align-items-center gap-2 border rounded-3 bg-white shadow-sm"
                  >
                    {meta.img ? (
                      <img
                        src={meta.img.startsWith("/") ? meta.img : `/${meta.img}`}
                        alt={item}
                        className="mini-produce-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/Images/hero.jpg";
                        }}
                      />
                    ) : (
                      <div className={`mini-produce-icon-box ${meta.color}`}>
                        <i className={`bi ${meta.icon}`}></i>
                      </div>
                    )}
                    <div>
                      <div className="fw-bold small">{item}</div>
                      <span className="badge bg-light text-secondary border small" style={{ fontSize: "0.7rem" }}>
                        <i className={`bi ${meta.icon} me-1`}></i>
                        {meta.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location & Area Map Section */}
          <div className="detail-card p-4 mb-4 shadow-sm border">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="product-icon">
                  <i className="bi bi-map-fill"></i>
                </div>
                <div>
                  <h3 className="h5 mb-0 fw-bold">Location &amp; Area Map</h3>
                  <div className="text-secondary small">{addressDisplay}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={handleFindMyDistance}
                  disabled={locating}
                >
                  {locating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Detecting GPS...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-crosshair me-1"></i>Calculate My Distance
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetMap}
                  title="Recenter on market pin"
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>Center Market
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${marketLat},${marketLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-green btn-sm"
                >
                  <i className="bi bi-geo-alt-fill me-1"></i>Get Directions
                </a>
              </div>
            </div>

            {distanceInfo !== null && (
              <div className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3">
                <div className="small">
                  <i className="bi bi-geo-fill text-success me-2"></i>
                  <strong>Approx Distance from your location:</strong> {formatDistance(distanceInfo)}
                </div>
                <span className="badge bg-success text-white">Live Geolocation</span>
              </div>
            )}

            {geoError && (
              <div className="alert alert-warning py-2 px-3 small mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {geoError}
              </div>
            )}

            {/* Interactive Leaflet Map Container */}
            <div
              ref={mapContainerRef}
              className="map-frame rounded-3 w-100 border"
              style={{
                height: "360px",
                minHeight: "340px",
                position: "relative",
                zIndex: 1,
                overflow: "hidden"
              }}
            ></div>

            <div className="d-flex flex-wrap justify-content-between align-items-center mt-2 small text-muted gap-2">
              <span>
                <i className="bi bi-pin-map me-1 text-danger"></i>
                Coordinates: {marketLat.toFixed(4)}° N, {marketLng.toFixed(4)}° E
              </span>
              <span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${marketLat}&mlon=${marketLng}#map=16/${marketLat}/${marketLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted text-decoration-none"
                >
                  View larger map on OpenStreetMap <i className="bi bi-box-arrow-up-right ms-1"></i>
                </a>
              </span>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="d-flex justify-content-between align-items-center pt-2 mb-4">
            <Link to="/markets" className="btn btn-outline-green">
              <i className="bi bi-arrow-left me-1"></i> Back to Market Directory
            </Link>
            <a href="#" className="btn btn-link text-success text-decoration-none" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              Back to top <i className="bi bi-arrow-up"></i>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useModals } from "../context/ModalContext";

import marketsData from "../data/markets.json";
import productsData from "../data/products.json";
import seasonalData from "../data/seasonal.json";

const PROJECT_PAGES = [
  { name: "Home", url: "/", desc: "FreshFind homepage with nearby market finder and highlights.", icon: "bi-house-door-fill", category: "Page" },
  { name: "About Us & Vision", url: "/about", desc: "Vision, mission, core values, and project team simulation.", icon: "bi-info-circle-fill", category: "Page" },
  { name: "Market Directory", url: "/markets", desc: "Browse, search, and filter all farmers markets across Karachi.", icon: "bi-shop", category: "Directory" },
  { name: "Produce Guide", url: "/produce", desc: "Farm-to-table catalog of vegetables, fruits, herbs and nutrition.", icon: "bi-basket2-fill", category: "Guide" },
  { name: "Seasonal Guide", url: "/seasonal", desc: "Discover crops by season (Summer, Winter, Spring, Autumn).", icon: "bi-sun-fill", category: "Guide" },
  { name: "Find Nearest Market", url: "/find-market", desc: "Locate active markets closest to your GPS coordinates.", icon: "bi-compass-fill", category: "Tool" },
  { name: "Market Highlights", url: "/highlights", desc: "Top rated weekend bazzars and popular community stalls.", icon: "bi-stars", category: "Page" },
  { name: "Saved Bookmarks", url: "/bookmarks", desc: "Manage saved markets, produce items, and personal notes.", icon: "bi-bookmark-star-fill", category: "Tool" },
  { name: "Feedback & Ratings", url: "/feedback", desc: "Share suggestions and review market experiences.", icon: "bi-chat-heart-fill", category: "Page" },
  { name: "Contact Us & Geolocation Hub", url: "/contact", desc: "Karachi support hub, contact form, and interactive Leaflet map.", icon: "bi-geo-alt-fill", category: "Page" },
  { name: "How FreshFind Works", url: "/how-it-works", desc: "Quick walkthrough of finding markets and seasonal crops.", icon: "bi-question-circle-fill", category: "Guide" }
];

const POPULAR_SEARCHES = [
  "Clifton",
  "Mango",
  "Tomato",
  "Organic",
  "Winter",
  "Spinach",
  "Weekend",
  "Karachi"
];

function highlightMatch(text, query) {
  if (!text || !query) return text || "";
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <strong key={index} className="text-success">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function Navbar() {
  const { openAuth } = useModals();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (/ or Ctrl+K / Cmd+K)
  useEffect(() => {
    function handleKeyDown(e) {
      const isInput = ["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable;
      if (!isInput && (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"))) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
          setIsSearchOpen(true);
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close nav collapse on route change
  useEffect(() => {
    setIsNavCollapsed(true);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const q = searchQuery.trim().toLowerCase();

  // Filter Search Datasets
  const matchedMarkets = q
    ? (marketsData.markets || [])
        .filter((m) => {
          const name = (m.name || "").toLowerCase();
          const loc = (m.location || "").toLowerCase();
          const desc = (m.description || "").toLowerCase();
          const prod = (m.produce || []).some((p) => p.toLowerCase().includes(q));
          const days = (m.days || "").toLowerCase();
          return name.includes(q) || loc.includes(q) || desc.includes(q) || prod || days.includes(q);
        })
        .slice(0, 4)
    : [];

  const matchedProduce = q
    ? (productsData.products || [])
        .filter((p) => {
          const name = (p.name || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          const season = (p.season || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          return name.includes(q) || cat.includes(q) || season.includes(q) || desc.includes(q);
        })
        .slice(0, 4)
    : [];

  const matchedSeasonal = q
    ? (seasonalData.seasonalProduce || [])
        .filter((s) => {
          const name = (s.name || "").toLowerCase();
          const season = (s.season || "").toLowerCase();
          const months = (s.months || "").toLowerCase();
          const notes = (s.flavorNotes || "").toLowerCase();
          const desc = (s.description || "").toLowerCase();
          return (
            name.includes(q) ||
            season.includes(q) ||
            months.includes(q) ||
            notes.includes(q) ||
            desc.includes(q)
          );
        })
        .slice(0, 4)
    : [];

  const matchedPages = q
    ? PROJECT_PAGES.filter((pg) => {
        const name = pg.name.toLowerCase();
        const desc = pg.desc.toLowerCase();
        const cat = pg.category.toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q);
      }).slice(0, 3)
    : [];

  const totalMatches =
    matchedMarkets.length + matchedProduce.length + matchedSeasonal.length + matchedPages.length;

  const handleSearchResultClick = (url) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(url);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!q) return;

      if (matchedMarkets.length > 0) {
        handleSearchResultClick(`/markets/${matchedMarkets[0].id}`);
      } else if (matchedProduce.length > 0) {
        handleSearchResultClick(`/produce/${matchedProduce[0].id}`);
      } else if (matchedSeasonal.length > 0) {
        handleSearchResultClick(`/seasonal/${matchedSeasonal[0].id}`);
      } else if (matchedPages.length > 0) {
        handleSearchResultClick(matchedPages[0].url);
      } else {
        handleSearchResultClick(`/markets?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    }
  };

  const isMarketsActive =
    location.pathname.startsWith("/markets") || location.pathname === "/market-detail";
  const isProduceActive =
    location.pathname.startsWith("/produce") || location.pathname === "/produce-detail";
  const isSeasonalActive =
    location.pathname.startsWith("/seasonal") || location.pathname === "/seasonal-detail";

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container py-2">
        <div className="brand-group">
          <Link to="/" className="navbar-brand py-0 me-lg-4 d-flex align-items-center">
            <img className="navbar-logo" src="/assets/Images/logo.png?v=4" alt="FreshFind logo" />
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="nav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`} id="nav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/markets"
                className={() => `nav-link ${isMarketsActive ? "active" : ""}`}
              >
                Markets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/produce"
                className={() => `nav-link ${isProduceActive ? "active" : ""}`}
              >
                Produce Guide
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/seasonal"
                className={() => `nav-link ${isSeasonalActive ? "active" : ""}`}
              >
                Seasonal Guide
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/bookmarks" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Bookmarks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/feedback" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Feedback
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Global Project Search Bar */}
          <div className="navbar-search-wrapper position-relative ms-lg-2 my-2 my-lg-0" ref={searchWrapperRef}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-success pe-1">
                <i className="bi bi-search"></i>
              </span>
              <input
                ref={searchInputRef}
                type="search"
                className="form-control border-start-0 border-end-0 ps-1"
                placeholder="Search FreshFind..."
                aria-label="Search markets and produce across FreshFind"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                className="btn btn-outline-secondary border-start-0 bg-white text-muted px-2 py-0 d-none d-xl-inline-block search-kbd-badge"
                type="button"
                title="Press / or Ctrl+K to search"
                onClick={() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    setIsSearchOpen(true);
                  }
                }}
              >
                <kbd className="bg-light text-muted border px-1" style={{ fontSize: "0.65rem" }}>
                  /
                </kbd>
              </button>
            </div>

            {/* Global Live Search Results Dropdown */}
            {isSearchOpen && (
              <div
                className="global-search-dropdown shadow-lg rounded-4 border bg-white position-absolute start-0 w-100"
                style={{ display: "block", top: "100%", zIndex: 1060 }}
              >
                {!q ? (
                  /* Default suggestions when query is empty */
                  <div>
                    <div className="px-3 pt-2 pb-2 border-bottom">
                      <div className="small fw-bold text-muted mb-2">
                        <i className="bi bi-fire text-danger me-1"></i>Popular Searches
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {POPULAR_SEARCHES.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className="badge bg-light text-dark border global-search-tag btn p-1"
                            onClick={() => {
                              setSearchQuery(tag);
                              setIsSearchOpen(true);
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-light border-bottom small text-muted d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-grid-3x3-gap-fill text-success me-1"></i>Quick Jump
                      </span>
                      <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                        Global Project Index
                      </span>
                    </div>
                    <div className="py-1">
                      <div
                        className="global-search-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchResultClick("/markets")}
                      >
                        <div className="global-search-icon bg-success-subtle text-success">
                          <i className="bi bi-shop"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">Browse All Markets</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            View verified farmers markets across Karachi
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </div>

                      <div
                        className="global-search-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchResultClick("/seasonal")}
                      >
                        <div className="global-search-icon bg-warning-subtle text-dark">
                          <i className="bi bi-calendar3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">Seasonal Harvest Calendar</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Summer, Winter, Spring &amp; Autumn peak picks
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </div>

                      <div
                        className="global-search-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchResultClick("/produce")}
                      >
                        <div className="global-search-icon bg-primary-subtle text-primary">
                          <i className="bi bi-basket2"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">Produce Nutrition Guide</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Vegetables, fruits, herbs and farm sources
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </div>

                      <div
                        className="global-search-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchResultClick("/contact")}
                      >
                        <div className="global-search-icon bg-danger-subtle text-danger">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">Live Geolocation Map</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Detect your GPS coordinates and nearest market
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </div>
                    </div>
                  </div>
                ) : totalMatches === 0 ? (
                  /* No results found state */
                  <div className="p-4 text-center">
                    <div className="display-6 text-muted mb-2">
                      <i className="bi bi-search"></i>
                    </div>
                    <h6 className="fw-bold mb-1">No direct matches for "{searchQuery}"</h6>
                    <p className="small text-secondary mb-3">
                      Try searching with a broader term such as a neighborhood, vegetable, fruit, or season.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-green btn-sm"
                        onClick={() =>
                          handleSearchResultClick(`/markets?search=${encodeURIComponent(searchQuery)}`)
                        }
                      >
                        Search in Markets Directory
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleSearchResultClick("/produce")}
                      >
                        View Produce Guide
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Search results list */
                  <div>
                    <div className="px-3 py-2 bg-light border-bottom d-flex justify-content-between align-items-center small">
                      <span className="fw-bold text-success">
                        <i className="bi bi-check2-circle me-1"></i>Found {totalMatches} results
                      </span>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Press Enter to open top result
                      </span>
                    </div>

                    {/* Markets Group */}
                    {matchedMarkets.length > 0 && (
                      <div>
                        <div className="global-search-header">
                          <i className="bi bi-shop text-success me-1"></i>Farmers Markets (
                          {matchedMarkets.length})
                        </div>
                        {matchedMarkets.map((m) => (
                          <div
                            key={m.id}
                            className="global-search-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearchResultClick(`/markets/${m.id}`)}
                          >
                            <div className="global-search-icon bg-success-subtle text-success">
                              <i className="bi bi-shop"></i>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold small text-truncate">
                                  {highlightMatch(m.name, searchQuery)}
                                </div>
                                <span className="badge bg-light text-secondary border small ms-2">
                                  {m.location}
                                </span>
                              </div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                <i className="bi bi-calendar3 me-1"></i>
                                {m.days} &bull; <i className="bi bi-star-fill text-warning me-1"></i>
                                {m.rating || "4.5"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Produce Guide Group */}
                    {matchedProduce.length > 0 && (
                      <div>
                        <div className="global-search-header border-top mt-1">
                          <i className="bi bi-basket2 text-primary me-1"></i>Produce Guide (
                          {matchedProduce.length})
                        </div>
                        {matchedProduce.map((p) => (
                          <div
                            key={p.id}
                            className="global-search-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearchResultClick(`/produce/${p.id}`)}
                          >
                            <div className="global-search-icon bg-light overflow-hidden">
                              {p.image ? (
                                <img
                                  src={p.image.startsWith("/") ? p.image : `/${p.image}`}
                                  alt={p.name}
                                  className="w-100 h-100 object-fit-cover rounded-2"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/Images/hero.jpg";
                                  }}
                                />
                              ) : (
                                <i className="bi bi-basket"></i>
                              )}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold small text-truncate">
                                  {highlightMatch(p.name, searchQuery)}
                                </div>
                                <span className="badge bg-success-subtle text-success border border-success-subtle small ms-2">
                                  {p.category}
                                </span>
                              </div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                <i className="bi bi-sun text-warning me-1"></i>Season: {p.season} &bull;{" "}
                                {p.description ? p.description.slice(0, 45) : ""}...
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Seasonal Guide Group */}
                    {matchedSeasonal.length > 0 && (
                      <div>
                        <div className="global-search-header border-top mt-1">
                          <i className="bi bi-sun text-warning me-1"></i>Seasonal Guide (
                          {matchedSeasonal.length})
                        </div>
                        {matchedSeasonal.map((s) => (
                          <div
                            key={s.id}
                            className="global-search-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearchResultClick(`/seasonal/${s.id}`)}
                          >
                            <div className="global-search-icon bg-light overflow-hidden">
                              {s.image ? (
                                <img
                                  src={s.image.startsWith("/") ? s.image : `/${s.image}`}
                                  alt={s.name}
                                  className="w-100 h-100 object-fit-cover rounded-2"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/Images/hero.jpg";
                                  }}
                                />
                              ) : (
                                <i className="bi bi-sun"></i>
                              )}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold small text-truncate">
                                  {highlightMatch(s.name, searchQuery)}
                                </div>
                                <span className="badge bg-warning-subtle text-dark border border-warning-subtle small ms-2">
                                  {s.season}
                                </span>
                              </div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                <i className="bi bi-calendar-check text-success me-1"></i>Peak: {s.months}{" "}
                                &bull; {s.flavorNotes || "Fresh local harvest"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Project Pages Group */}
                    {matchedPages.length > 0 && (
                      <div>
                        <div className="global-search-header border-top mt-1">
                          <i className="bi bi-compass text-secondary me-1"></i>Project Pages &amp; Tools (
                          {matchedPages.length})
                        </div>
                        {matchedPages.map((pg) => (
                          <div
                            key={pg.name}
                            className="global-search-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearchResultClick(pg.url)}
                          >
                            <div className="global-search-icon bg-secondary-subtle text-secondary">
                              <i className={`bi ${pg.icon}`}></i>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold small text-truncate">
                                  {highlightMatch(pg.name, searchQuery)}
                                </div>
                                <span className="badge bg-light text-muted border small ms-2">
                                  {pg.category}
                                </span>
                              </div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                {pg.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="navbar-actions ms-lg-2">
            <button
              type="button"
              className="btn btn-green btn-icon-auth"
              onClick={() => openAuth("signup")}
              title="Sign Up / Account"
              aria-label="Sign Up"
            >
              <i className="bi bi-person-plus-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

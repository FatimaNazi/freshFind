import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import MarketCard from "../components/MarketCard";
import marketsData from "../data/markets.json";
import { calculateDistance, formatDistance } from "../utils/distance";

export default function Home() {
  const allMarkets = marketsData.markets || [];

  // Geolocation state for Hero section
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [nearestMarket, setNearestMarket] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let closest = null;
        let minDistance = Infinity;

        allMarkets.forEach((m) => {
          if (typeof m.latitude === "number" && typeof m.longitude === "number") {
            const dist = calculateDistance(userLat, userLon, m.latitude, m.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closest = m;
            }
          }
        });

        setGeoLoading(false);
        if (closest) {
          setNearestMarket(closest);
          setNearestDistance(minDistance);
        } else {
          setGeoError("Could not find any nearby active markets.");
        }
      },
      (err) => {
        setGeoLoading(false);
        setGeoError(
          err.code === 1
            ? "Location permission was denied. Showing default active markets."
            : "Could not retrieve your location. Showing default active markets."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetNearest = () => {
    setNearestMarket(null);
    setNearestDistance(null);
    setGeoError("");
  };

  const popularMarkets = allMarkets.slice(0, 3);
  const highlightedMarkets = allMarkets.slice(0, 3);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", active: true }]} />

      {/* Hero Section */}
      <header className="hero hero-immersive">
        <div className="hero-image">
          <img src="/assets/Images/hero.jpg" alt="Fresh local market" />
        </div>
        <div className="hero-overlay"></div>

        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1>
                Find fresh markets.<br />
                <span className="text-gold">Track what matters.</span>
              </h1>
              <p>
                FreshFind helps you discover nearby farmers markets, follow what's in season and track
                down the exact produce you're looking for all matched to your neighborhood and schedule.
              </p>
              <Link to="/markets" className="btn btn-gold btn-lg mt-2">
                Explore Markets
              </Link>
            </div>

            <div className="col-lg-6">
              <div className="active-markets-panel" id="activeMarketsPanel">
                <div className="amp-head d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="amp-live-dot"></span>
                    <span className="fw-bold">Active Markets</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-gold amp-geo-btn"
                    title="Detect nearest market using browser location"
                    onClick={handleFindNearest}
                    disabled={geoLoading}
                  >
                    {geoLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Locating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-geo-alt-fill me-1"></i>Find Nearest Market
                      </>
                    )}
                  </button>
                </div>

                {geoError && (
                  <div className="alert alert-warning py-2 px-3 small mx-3 mt-3 mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {geoError}
                  </div>
                )}

                {nearestMarket ? (
                  <div className="p-3">
                    <div className="nearest-market-card p-3 rounded-3 bg-white text-dark shadow-sm border border-warning">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-gold text-dark fw-bold">
                          <i className="bi bi-geo-alt-fill me-1"></i>Nearest Market to You
                        </span>
                        <span className="badge bg-success text-white">
                          <i className="bi bi-compass me-1"></i>
                          {formatDistance(nearestDistance)}
                        </span>
                      </div>
                      <h4 className="h5 fw-bold mb-1 text-dark">{nearestMarket.name}</h4>
                      <div className="text-secondary small mb-2">
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {nearestMarket.location} &bull; {nearestMarket.address || "Karachi"}
                      </div>
                      <div className="market-meta small mb-3 text-muted">
                        <div>
                          <i className="bi bi-calendar-event me-1"></i>
                          <strong>Days:</strong> {nearestMarket.days}
                        </div>
                        <div>
                          <i className="bi bi-clock me-1"></i>
                          <strong>Hours:</strong> {nearestMarket.hours}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleResetNearest}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1"></i>All Active Markets
                        </button>
                        <Link to={`/markets/${nearestMarket.id}`} className="btn btn-gold btn-sm fw-bold">
                          View Market Details <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="amp-list">
                    <Link className="amp-item" to="/markets/clifton">
                      <div className="amp-item-top">
                        <span className="amp-name">Clifton Weekend Market</span>
                        <span className="amp-status is-live">
                          <span className="amp-dot"></span>
                          Saturday &amp; Sunday
                        </span>
                      </div>
                      <div className="amp-meta">
                        <span>
                          <i className="bi bi-geo-alt"></i> Clifton
                        </span>
                        <span>
                          <i className="bi bi-basket2"></i> 4 item types
                        </span>
                      </div>
                    </Link>

                    <Link className="amp-item" to="/markets/gulshan">
                      <div className="amp-item-top">
                        <span className="amp-name">Gulshan Fresh Street</span>
                        <span className="amp-status is-live">
                          <span className="amp-dot"></span>
                          Tue, Thu &amp; Sat
                        </span>
                      </div>
                      <div className="amp-meta">
                        <span>
                          <i className="bi bi-geo-alt"></i> Gulshan-e-Iqbal
                        </span>
                        <span>
                          <i className="bi bi-basket2"></i> 4 item types
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Popular Markets Section */}
      <section className="section pt-5" id="popular-markets">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="badge-soft">Popular markets</span>
              <h2 className="section-title mt-3">Markets people are discovering</h2>
              <p className="section-sub mb-0">
                Explore popular neighborhood markets and open their full details.
              </p>
            </div>
            <Link to="/markets" className="btn btn-outline-green">
              View all markets
            </Link>
          </div>
          <div className="row g-4">
            {popularMarkets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Picks Spotlight Section */}
      <section className="section section-soft">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="badge-soft">Seasonal picks</span>
              <h2 className="section-title display-6 mt-3">Fresh ideas for this week</h2>
              <p className="section-sub">
                Browse the Seasonal Guide to discover common seasonal items and the markets where you can look for them.
              </p>
              <Link to="/seasonal" className="btn btn-green">
                Explore Seasonal
              </Link>
            </div>
            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/mango.png"
                          alt="Mangoes"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Fruits</span>
                      <h3 className="h5 mt-3">Mangoes</h3>
                      <p className="small text-secondary mb-0">
                        A popular seasonal fruit with several local varieties.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/seasonal/sindhri-mango" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/mint.png"
                          alt="Fresh Mint"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Herbs</span>
                      <h3 className="h5 mt-3">Fresh Mint</h3>
                      <p className="small text-secondary mb-0">
                        Useful for chutneys, drinks, salads and garnishes.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/mint" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/tomato.png"
                          alt="Tomatoes"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Vegetables</span>
                      <h3 className="h5 mt-3">Tomatoes</h3>
                      <p className="small text-secondary mb-0">
                        An everyday kitchen staple commonly found at local markets.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/tomato" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/yougurt.png"
                          alt="Fresh Yogurt"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Dairy</span>
                      <h3 className="h5 mt-3">Fresh Yogurt</h3>
                      <p className="small text-secondary mb-0">
                        A versatile fresh dairy item for meals and drinks.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/yogurt" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produce Guide Spotlight Section */}
      <section className="section" id="produce-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 order-lg-2">
              <span className="badge-soft">Produce Guide</span>
              <h2 className="section-title display-6 mt-3">Essential fresh produce for your kitchen</h2>
              <p className="section-sub">
                Discover farm-fresh vegetables, organic fruits, aromatic herbs and daily staples with availability info and local market connections.
              </p>
              <Link to="/produce" className="btn btn-green">
                Explore Produce Guide
              </Link>
            </div>
            <div className="col-lg-7 order-lg-1">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/spinach.png"
                          alt="Spinach"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Vegetables</span>
                      <h3 className="h5 mt-3">Fresh Spinach</h3>
                      <p className="small text-secondary mb-0">
                        Leafy greens best enjoyed fresh and commonly sold in bunches.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/spinach" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/potato.png"
                          alt="Potatoes"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Vegetables</span>
                      <h3 className="h5 mt-3">Potatoes</h3>
                      <p className="small text-secondary mb-0">
                        A versatile staple commonly available from local growers and produce sellers.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/potato" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/banana.png"
                          alt="Bananas"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Fruits</span>
                      <h3 className="h5 mt-3">Bananas</h3>
                      <p className="small text-secondary mb-0">
                        Naturally sweet everyday fruit grown across Sindh farm belts.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/banana" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="info-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="product-icon mb-3">
                        <img
                          src="/assets/Images/green chilie.png"
                          alt="Chili"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <span className="badge-soft">Herbs &amp; Spices</span>
                      <h3 className="h5 mt-3">Green Chilies</h3>
                      <p className="small text-secondary mb-0">
                        Piquant fresh chilies adding vibrant local flavor to any recipe.
                      </p>
                    </div>
                    <div className="pt-3 border-top mt-3">
                      <Link to="/produce/chili" className="btn btn-outline-green btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Highlights Section */}
      <section className="section section-soft" id="market-highlights">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="badge-soft">
                <i className="bi bi-star-fill text-warning me-1"></i> Market Highlights
              </span>
              <h2 className="section-title mt-3">Featured Market Highlights</h2>
              <p className="section-sub mb-0">
                Handpicked farmers markets with unique artisan stalls, live harvest offerings and weekend specials.
              </p>
            </div>
            <Link to="/highlights" className="btn btn-outline-green">
              View all highlights <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {highlightedMarkets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

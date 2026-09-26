import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import seasonalData from "../data/seasonal.json";
import marketsData from "../data/markets.json";
import { isBookmarked, toggleBookmark } from "../utils/storage";
import { useModals } from "../context/ModalContext";
import { useToast } from "../components/Toast";

function getSeasonBadge(season) {
  switch (season) {
    case "Summer":
      return (
        <span className="badge bg-warning text-dark">
          <i className="bi bi-sun-fill me-1"></i>Summer Special
        </span>
      );
    case "Winter":
      return (
        <span className="badge bg-info text-white">
          <i className="bi bi-snow me-1"></i>Winter Harvest
        </span>
      );
    case "Spring":
      return (
        <span className="badge bg-success text-white">
          <i className="bi bi-flower1 me-1"></i>Spring Bloom
        </span>
      );
    case "Autumn":
      return (
        <span className="badge bg-danger text-white">
          <i className="bi bi-tree-fill me-1"></i>Autumn Harvest
        </span>
      );
    default:
      return (
        <span className="badge bg-primary text-white">
          <i className="bi bi-arrow-repeat me-1"></i>Year-Round Staple
        </span>
      );
  }
}

export default function SeasonalDetail() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const { openShare } = useModals();
  const { addToast } = useToast();

  const allSeasonal = seasonalData.seasonalProduce || [];
  const allMarkets = marketsData.markets || [];

  const rawId = (
    paramId ||
    location.hash.replace("#", "") ||
    new URLSearchParams(location.search).get("id") ||
    "sindhri-mango"
  ).toLowerCase();

  // Normalize IDs with hyphens / underscores
  const item =
    allSeasonal.find(
      (s) =>
        s.id.toLowerCase() === rawId ||
        s.id.toLowerCase().replace(/_/g, "-") === rawId.replace(/_/g, "-")
    ) || allSeasonal[0];

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (item) {
      setSaved(isBookmarked("produce", item.id));
      document.title = `${item.name} | FreshFind Seasonal Guide`;
    }
  }, [item]);

  if (!item) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Seasonal item not found.</div>
        <Link to="/seasonal" className="btn btn-green mt-3">
          Back to Seasonal Guide
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    const nowSaved = toggleBookmark("produce", item.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
  };

  const handleShareClick = () => {
    const shareUrl = `/seasonal/${item.id}`;
    openShare(
      `${item.name} - FreshFind Seasonal Guide`,
      `Discover ${item.name} during its peak season (${item.months}) on FreshFind!`,
      shareUrl
    );
  };

  const seasonBadge = getSeasonBadge(item.season);
  const flavorTags = (item.flavorNotes || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const marketNames = item.markets || [];

  let relatedItems = allSeasonal
    .filter((s) => s.id !== item.id && s.season === item.season)
    .slice(0, 3);
  if (relatedItems.length < 2) {
    relatedItems = allSeasonal.filter((s) => s.id !== item.id).slice(0, 3);
  }

  const imageSrc = item.image
    ? item.image.startsWith("/")
      ? item.image
      : `/${item.image}`
    : "/assets/Images/hero.jpg";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Seasonal Guide", url: "/seasonal" },
          { label: item.name, active: true }
        ]}
      />

      <main className="detail-section">
        <div className="container">
          {/* Hero Seasonal Cover */}
          <div className="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
            <div className="detail-cover-content p-4 p-md-5">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                {seasonBadge}
                <span className="badge bg-dark bg-opacity-50 text-white px-3 py-2">
                  <i className="bi bi-calendar-event me-1"></i>Peak: {item.months}
                </span>
                {item.status && (
                  <span className="badge bg-white text-dark px-3 py-2">
                    <i className="bi bi-award-fill text-warning me-1"></i>
                    {item.status}
                  </span>
                )}
              </div>
              <h1 className="display-5 fw-bold text-white mb-2">{item.name}</h1>
              <p className="lead text-white-50 mb-0">{item.description}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge-soft">
                <i className="bi bi-calendar-check me-1"></i>
                {item.season}
              </span>
              <span className="badge-soft">
                <i className="bi bi-clock-history me-1"></i>
                {item.months}
              </span>
              <span className="badge-soft">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {marketNames.length} Seasonal Markets
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
                className="btn btn-outline-secondary btn-sm share-trigger-btn"
                title="Share seasonal pick"
                onClick={handleShareClick}
              >
                <i className="bi bi-share me-1"></i>Share Seasonal Pick
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Image & Flavor Profile */}
            <div className="col-lg-5 d-flex flex-column gap-4">
              {/* Main Product Photo */}
              <div className="detail-card p-3 text-center overflow-hidden">
                <img
                  src={imageSrc}
                  alt={item.alt || item.name}
                  className="w-100 rounded-3 shadow-sm object-fit-cover"
                  style={{ maxHeight: "320px" }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/Images/hero.jpg";
                  }}
                />
                <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                  <span className="small text-muted">
                    <i className="bi bi-flower2 me-1"></i>Harvested in {item.season}
                  </span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle small">
                    {item.months}
                  </span>
                </div>
              </div>

              {/* Seasonal Harvest Timeline */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-calendar3-range-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Seasonal Timeline</h3>
                </div>
                <ul className="list-unstyled mb-0 d-grid gap-3 small">
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-warning fs-5">
                      <i className="bi bi-sun-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Best Season:</strong>
                      <div className="text-secondary">{item.season}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-success fs-5">
                      <i className="bi bi-calendar2-week-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Peak Months:</strong>
                      <div className="text-secondary">{item.months}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-info fs-5">
                      <i className="bi bi-flag-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Harvest Status:</strong>
                      <div className="text-secondary">{item.status || "Seasonal Harvest"}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-danger fs-5">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Growing Region:</strong>
                      <div className="text-secondary">Malir Valley, Mirpur Khas &amp; Sindh Agricultural Belts</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Flavor & Tasting Notes */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-stars"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Flavor &amp; Tasting Profile</h3>
                </div>
                {item.flavorNotes && (
                  <p className="small text-secondary mb-3">
                    <i className="bi bi-quote me-1 text-warning fs-5"></i>
                    {item.flavorNotes}
                  </p>
                )}
                <div className="mb-3">
                  <strong className="small text-dark d-block mb-2">Tasting Notes:</strong>
                  <div>
                    {flavorTags.map((tag) => (
                      <span key={tag} className="badge bg-light text-dark border me-1 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="alert alert-light border small text-muted mb-0 py-2">
                  <i className="bi bi-lightbulb-fill text-warning me-1"></i>
                  Seasonal produce is harvested naturally ripe on the branch, resulting in higher sugar Brix levels and deeper aromatic oils.
                </div>
              </div>
            </div>

            {/* Right Column: Details, Recipes & Markets */}
            <div className="col-lg-7 d-flex flex-column gap-4">
              {/* Seasonal Overview Card */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-journal-check"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Seasonal Profile: {item.name}</h3>
                </div>
                <p className="text-secondary mb-3">{item.description}</p>
                <p className="text-secondary small mb-0">
                  Purchasing produce during <strong>{item.season} ({item.months})</strong> ensures optimal freshness, peak nutritional content, and economical market prices due to abundant local harvests. By choosing seasonal varieties, you directly support local growers across Sindh during their active harvest windows.
                </p>
              </div>

              {/* Farmers Markets Stocking This Seasonal Pick */}
              <div className="detail-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="product-icon">
                      <i className="bi bi-shop"></i>
                    </div>
                    <h3 className="h5 mb-0 fw-bold">Farmers Markets Stocking {item.name}</h3>
                  </div>
                  <Link to="/seasonal" className="btn btn-outline-green btn-sm">
                    Seasonal Guide
                  </Link>
                </div>
                <p className="small text-secondary mb-3">
                  Check out these verified neighborhood markets to find authentic <strong>{item.name}</strong> from regional farmers:
                </p>
                <div className="row g-3">
                  {marketNames.length > 0 ? (
                    marketNames.map((mName) => {
                      const marketObj = allMarkets.find(
                        (m) => m.name.toLowerCase() === mName.toLowerCase()
                      );
                      const targetId = marketObj ? marketObj.id : "clifton";
                      const locationText = marketObj ? marketObj.location : "Karachi";
                      const daysText = marketObj ? marketObj.days : "Weekend Stall";
                      const hoursText = marketObj ? marketObj.hours : "Morning – Afternoon";

                      return (
                        <div key={mName} className="col-md-6 mb-3">
                          <div className="detail-stall-card p-3 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                <h4 className="h6 fw-bold mb-0">{mName}</h4>
                                <span className="badge bg-light text-success border">
                                  <i className="bi bi-geo-alt-fill me-1"></i>
                                  {locationText}
                                </span>
                              </div>
                              <div className="small text-secondary mb-2">
                                <div>
                                  <i className="bi bi-calendar-event me-1"></i>
                                  {daysText}
                                </div>
                                <div>
                                  <i className="bi bi-clock me-1"></i>
                                  {hoursText}
                                </div>
                              </div>
                            </div>
                            <div className="pt-2 border-top mt-2">
                              <Link to={`/markets/${targetId}`} className="btn btn-outline-green btn-sm w-100">
                                <i className="bi bi-shop me-1"></i>View Market Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <p className="text-secondary mb-0">Seasonal market stall schedule updating soon.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Kitchen Inspiration & Freshness Tips */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-cup-hot-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Kitchen Inspiration &amp; Freshness Tips</h3>
                </div>
                <div className="d-grid gap-3 small text-secondary">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Seasonal Ripeness:</strong> Look for firm texture and natural aroma near the stem. Avoid bruised surfaces or artificially polished peels.
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Preservation:</strong> Best enjoyed within 3 to 5 days of purchase from local farmers markets to preserve peak vitamins and aromatic juices.
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Culinary Pairings:</strong> Pairs wonderfully with regional spices, mint, freshly squeezed citrus, and homemade yogurt dressings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Items in This Season */}
          <div className="detail-card p-4 p-md-5 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge-soft">
                  <i className="bi bi-calendar3 text-warning me-1"></i>
                  {item.season} Harvest
                </span>
                <h3 className="h4 fw-bold mt-2 mb-0">More {item.season} Produce</h3>
              </div>
              <Link to="/seasonal" className="btn btn-outline-green btn-sm">
                View All Seasons
              </Link>
            </div>
            <div className="row g-4">
              {relatedItems.map((sItem) => {
                const sItemImg = sItem.image
                  ? sItem.image.startsWith("/")
                    ? sItem.image
                    : `/${sItem.image}`
                  : "/assets/Images/hero.jpg";
                return (
                  <div key={sItem.id} className="col-md-4">
                    <div className="product-card h-100 p-3 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="produce-thumb mb-3 rounded-3 overflow-hidden bg-light" style={{ height: "150px" }}>
                          <img
                            src={sItemImg}
                            alt={sItem.alt || sItem.name}
                            className="w-100 h-100 object-fit-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/Images/hero.jpg";
                            }}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-light text-dark border small">{sItem.season}</span>
                          <span className="badge-soft small">{sItem.category}</span>
                        </div>
                        <h5 className="h6 fw-bold mb-1">{sItem.name}</h5>
                        <div className="small text-success mb-2">
                          <i className="bi bi-calendar-check me-1"></i>
                          {sItem.months}
                        </div>
                        <p className="small text-secondary mb-2">
                          {sItem.description ? sItem.description.slice(0, 75) : ""}...
                        </p>
                      </div>
                      <div className="pt-2 border-top mt-2">
                        <Link to={`/seasonal/${sItem.id}`} className="btn btn-outline-green btn-sm w-100">
                          <i className="bi bi-eye me-1"></i>View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <Link to="/seasonal" className="btn btn-outline-green">
              <i className="bi bi-arrow-left me-1"></i> Back to Seasonal Guide
            </Link>
            <a
              href="#"
              className="btn btn-link text-success text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Back to top <i className="bi bi-arrow-up"></i>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

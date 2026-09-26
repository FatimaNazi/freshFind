import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isBookmarked, toggleBookmark } from "../utils/storage";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";

function getSeasonBadge(season) {
  switch (season) {
    case "Summer":
      return (
        <span className="badge bg-warning text-dark">
          <i className="bi bi-sun-fill me-1"></i>Summer
        </span>
      );
    case "Winter":
      return (
        <span className="badge bg-info text-white">
          <i className="bi bi-snow me-1"></i>Winter
        </span>
      );
    case "Spring":
      return (
        <span className="badge bg-success text-white">
          <i className="bi bi-flower1 me-1"></i>Spring
        </span>
      );
    case "Autumn":
      return (
        <span className="badge bg-danger text-white">
          <i className="bi bi-tree-fill me-1"></i>Autumn
        </span>
      );
    default:
      return (
        <span className="badge bg-primary text-white">
          <i className="bi bi-arrow-repeat me-1"></i>Year-Round
        </span>
      );
  }
}

export default function SeasonalCard({ item, onBookmarkChange }) {
  const { openShare } = useModals();
  const { addToast } = useToast();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked("produce", item.id));
  }, [item.id]);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleBookmark("produce", item.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
    if (onBookmarkChange) onBookmarkChange("produce", item.id, nowSaved);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `/seasonal/${item.id}`;
    openShare(
      `${item.name} - Seasonal Guide`,
      `Discover ${item.name} in season during ${item.months} on FreshFind!`,
      shareUrl
    );
  };

  const marketList = (item.markets || []).join(", ");
  const imageSrc = item.image
    ? item.image.startsWith("/")
      ? item.image
      : `/${item.image}`
    : "/assets/Images/hero.jpg";

  return (
    <div className="col-md-6 col-xl-4" data-season-card={item.id} data-season={item.season}>
      <article className="product-card h-100 position-relative shadow-sm border rounded-4 overflow-hidden d-flex flex-column justify-content-between">
        <div>
          <button
            type="button"
            className={`bookmark-btn position-absolute top-0 end-0 m-3 ${saved ? "saved" : ""}`}
            aria-pressed={saved}
            title={saved ? "Remove bookmark" : "Save bookmark"}
            onClick={handleBookmarkToggle}
            style={{ zIndex: 2 }}
          >
            <i className={`bi ${saved ? "bi-bookmark-star-fill" : "bi-bookmark"}`}></i>
          </button>

          <div className="produce-thumb">
            <img
              src={imageSrc}
              alt={item.alt || item.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/Images/hero.jpg";
              }}
            />
          </div>

          <div className="p-4 pb-2">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-2 flex-wrap">
              <div>{getSeasonBadge(item.season)}</div>
              <span className="badge-soft">{item.category}</span>
            </div>
            <h3 className="h5 fw-bold mb-1">{item.name}</h3>
            <div className="small text-success fw-semibold mb-2">
              <i className="bi bi-calendar2-week me-1"></i>Best Months: {item.months}
              {item.status && (
                <> &bull; <span className="badge bg-light text-secondary border">{item.status}</span></>
              )}
            </div>
            <p className="text-secondary small mb-2">{item.description}</p>
            {item.flavorNotes && (
              <div className="alert alert-light border small py-1 px-2 mb-2 text-muted">
                <i className="bi bi-magic me-1 text-warning"></i>
                <strong>Flavor:</strong> {item.flavorNotes}
              </div>
            )}
            <p className="small text-secondary mb-3">
              <strong>
                <i className="bi bi-shop me-1"></i>Found at:
              </strong>{" "}
              {marketList || "Verified seasonal stalls"}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
            <Link className="btn btn-outline-green btn-sm" to={`/seasonal/${item.id}`}>
              <i className="bi bi-eye me-1"></i>View Details
            </Link>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary share-trigger-btn"
                title="Share seasonal item"
                onClick={handleShareClick}
              >
                <i className="bi bi-share"></i>
              </button>
              <span className="price-chip">
                {item.markets ? item.markets.length : 0} markets
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isBookmarked, toggleBookmark } from "../utils/storage";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";

export default function MarketCard({ market, onBookmarkChange }) {
  const { openShare } = useModals();
  const { addToast } = useToast();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked("markets", market.id));
  }, [market.id]);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleBookmark("markets", market.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
    if (onBookmarkChange) onBookmarkChange("markets", market.id, nowSaved);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `/markets/${market.id}`;
    openShare(
      market.name,
      `Check out ${market.name} in ${market.location} on FreshFind!`,
      shareUrl
    );
  };

  const days = market.daysList ? market.daysList.join(", ") : market.days;
  const categories = market.categoryList ? market.categoryList.join(" · ") : market.categories;
  const thumbClass = market.thumbClass || "market-a";
  const imageSrc = market.image ? `/assets/${market.image}` : "/assets/Images/hero.jpg";

  return (
    <div className="col-md-6 col-xl-4" data-market-card={market.id}>
      <article className="market-card h-100 position-relative d-flex flex-column justify-content-between">
        <div>
          <div className={`thumb ${thumbClass} position-relative`}>
            <button
              type="button"
              className={`bookmark-btn position-absolute top-0 end-0 m-2 ${saved ? "saved" : ""}`}
              aria-pressed={saved}
              title={saved ? "Remove bookmark" : "Save bookmark"}
              onClick={handleBookmarkToggle}
            >
              <i className={`bi ${saved ? "bi-bookmark-star-fill" : "bi-bookmark"}`}></i>
            </button>
            <div className="illustration">
              <img
                src={imageSrc}
                alt={market.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/Images/hero.jpg";
                }}
              />
            </div>
          </div>

          <div className="card-body-custom">
            <div className="d-flex justify-content-between gap-2 align-items-start">
              <span className="badge-soft">{market.location}</span>
              <span className="small text-muted">{market.type || ""}</span>
            </div>
            <h4 className="mt-3 mb-2">{market.name}</h4>
            <p className="text-secondary">{market.description}</p>
            <div className="market-meta mb-2">
              <span>
                <i className="bi bi-calendar-event me-1"></i> {days}
              </span>
              <span>
                <i className="bi bi-clock me-1"></i> {market.hours}
              </span>
            </div>
            <div className="market-meta mb-3">
              <span>
                <i className="bi bi-star-fill me-1" style={{ color: "var(--gold-500)" }}></i>{" "}
                {market.rating ? market.rating.toFixed(1) : "4.5"}
              </span>
              {market.organic && (
                <span>
                  <i className="bi bi-flower1 me-1 text-success"></i> Organic
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card-body-custom pt-0">
          <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
            <Link className="btn btn-outline-green btn-sm" to={`/markets/${market.id}`}>
              View details
            </Link>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary share-trigger-btn"
                title="Share this market"
                onClick={handleShareClick}
              >
                <i className="bi bi-share"></i>
              </button>
              <span className="price-chip">{categories}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

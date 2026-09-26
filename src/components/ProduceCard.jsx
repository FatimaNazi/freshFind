import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isBookmarked, toggleBookmark } from "../utils/storage";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";

export default function ProduceCard({ product, onBookmarkChange }) {
  const { openShare } = useModals();
  const { addToast } = useToast();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked("produce", product.id));
  }, [product.id]);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleBookmark("produce", product.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
    if (onBookmarkChange) onBookmarkChange("produce", product.id, nowSaved);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `/produce/${product.id}`;
    openShare(
      `${product.name} - FreshFind Produce Guide`,
      `Learn where to find fresh ${product.name} on FreshFind!`,
      shareUrl
    );
  };

  const marketList = (product.markets || []).join(", ");
  const imageSrc = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : "/assets/Images/hero.jpg";

  return (
    <div className="col-md-6 col-xl-4" data-produce-card={product.id} data-category={product.category}>
      <article className="product-card h-100 position-relative d-flex flex-column justify-content-between">
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
              alt={product.alt || product.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/Images/hero.jpg";
              }}
            />
          </div>

          <div className="p-4 pb-2">
            <span className="badge-soft d-inline-block mb-2">{product.category}</span>
            <h3 className="h5 mb-2">{product.name}</h3>
            <p className="text-secondary small">{product.description}</p>
            <p className="small mb-1">
              <strong>Typical season:</strong> {product.season}
            </p>
            <p className="small text-secondary mb-3">
              <strong>Found at:</strong> {marketList || "Local community stalls"}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
            <Link className="btn btn-outline-green btn-sm" to={`/produce/${product.id}`}>
              <i className="bi bi-eye me-1"></i>View Details
            </Link>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary share-trigger-btn"
                title="Share produce"
                onClick={handleShareClick}
              >
                <i className="bi bi-share"></i>
              </button>
              <span className="price-chip">
                {product.markets ? product.markets.length : 0} markets
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

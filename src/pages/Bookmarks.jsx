import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import marketsData from "../data/markets.json";
import productsData from "../data/products.json";
import seasonalData from "../data/seasonal.json";
import {
  getBookmarks,
  toggleBookmark,
  getBookmarkNote
} from "../utils/storage";
import {
  generateMarketDetailsDoc,
  generateProduceGuideDoc,
  generateAllBookmarksDoc,
  downloadTextFile
} from "../utils/exportDoc";
import { useModals } from "../context/ModalContext";
import { useToast } from "../components/Toast";

export default function Bookmarks() {
  const { openShare, openNote } = useModals();
  const { addToast } = useToast();

  const allMarkets = marketsData.markets || [];
  const seasonalList = (seasonalData.seasonalProduce || []).map((item) => ({
    ...item,
    isSeasonal: true
  }));
  const regularList = (productsData.products || []).map((item) => ({
    ...item,
    isSeasonal: false
  }));
  const allProduceMap = new Map();
  regularList.forEach((item) => allProduceMap.set(String(item.id), item));
  seasonalList.forEach((item) => allProduceMap.set(String(item.id), item));
  const allProducts = Array.from(allProduceMap.values());

  const [savedMarketIds, setSavedMarketIds] = useState([]);
  const [savedProduceIds, setSavedProduceIds] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // "all" | "markets" | "produce"
  const [, setNoteRefreshTrigger] = useState(0);

  const loadBookmarks = () => {
    setSavedMarketIds(getBookmarks("markets"));
    setSavedProduceIds(getBookmarks("produce"));
  };

  useEffect(() => {
    loadBookmarks();
    const handleBookmarkChange = () => {
      loadBookmarks();
    };
    window.addEventListener("bookmarks:changed", handleBookmarkChange);
    return () => {
      window.removeEventListener("bookmarks:changed", handleBookmarkChange);
    };
  }, []);

  const savedMarkets = allMarkets.filter((m) => savedMarketIds.includes(String(m.id)));
  const savedProducts = allProducts.filter((p) => savedProduceIds.includes(String(p.id)));
  const totalCount = savedMarkets.length + savedProducts.length;

  const handleRemoveBookmark = (type, id) => {
    toggleBookmark(type, id);
    loadBookmarks();
    addToast("Removed from bookmarks.", "info");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved bookmarks?")) {
      localStorage.removeItem("ff_bookmarked_markets");
      localStorage.removeItem("ff_bookmarked_produce");
      loadBookmarks();
      addToast("All bookmarks cleared.", "info");
    }
  };

  const handleDownloadAll = () => {
    if (totalCount === 0) {
      addToast("No bookmarks to download.", "warning");
      return;
    }
    const content = generateAllBookmarksDoc(savedMarkets, savedProducts);
    downloadTextFile("FreshFind_My_Bookmarks_and_Notes.txt", content);
    addToast("All bookmarks exported successfully!", "success");
  };

  const handleExportFormattedList = () => {
    if (totalCount === 0) {
      addToast("No bookmarks to export.", "warning");
      return;
    }
    const content = generateAllBookmarksDoc(savedMarkets, savedProducts);
    downloadTextFile("FreshFind_Bookmarks_List.txt", content);
    addToast("Formatted list exported successfully!", "success");
  };

  const handleEditNote = (type, id, itemName) => {
    openNote(type, id, itemName, () => {
      setNoteRefreshTrigger((prev) => prev + 1);
    });
  };

  const handleDownloadMarket = (market) => {
    const note = getBookmarkNote("markets", market.id);
    const content = generateMarketDetailsDoc(market, note);
    downloadTextFile(`FreshFind_${market.name.replace(/\s+/g, "_")}.txt`, content);
    addToast("Market details downloaded!", "success");
  };

  const handleDownloadProduce = (product) => {
    const note = getBookmarkNote("produce", product.id);
    const content = generateProduceGuideDoc(product, note);
    downloadTextFile(`FreshFind_${product.name.replace(/\s+/g, "_")}_Guide.txt`, content);
    addToast("Produce guide downloaded!", "success");
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Bookmarks", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Personal Collection</span>
          <h1 className="mt-3">My Bookmarks &amp; Notes</h1>
          <p className="section-sub mb-0">
            Keep track of your favorite local markets and fresh seasonal produce with custom shopping notes and export tools.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          {/* Header Control Toolbar */}
          <div className="bookmark-toolbar p-3 p-md-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <h2 className="h4 fw-bold mb-0 text-success d-flex align-items-center gap-2">
                    <i className="bi bi-bookmark-star-fill text-warning"></i>
                    <span>Saved Collection</span>
                  </h2>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">
                    {totalCount} {totalCount === 1 ? "item" : "items"} saved
                  </span>
                </div>
                <p className="text-secondary small mb-0">
                  Review your saved farmers markets and fresh seasonal produce with personal session notes.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button
                  type="button"
                  className="btn btn-green btn-sm d-flex align-items-center gap-1 shadow-sm"
                  title="Download all saved items into a single document"
                  onClick={handleDownloadAll}
                  disabled={totalCount === 0}
                >
                  <i className="bi bi-file-earmark-arrow-down-fill"></i>
                  <span>Download All</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-green btn-sm d-flex align-items-center gap-1"
                  title="Export as clean formatted text list"
                  onClick={handleExportFormattedList}
                  disabled={totalCount === 0}
                >
                  <i className="bi bi-file-text"></i>
                  <span>Export List</span>
                </button>
                {totalCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    title="Clear all bookmarks"
                    onClick={handleClearAll}
                  >
                    <i className="bi bi-trash3"></i>
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            {totalCount > 0 && (
              <div className="d-flex flex-wrap gap-2 pt-3 mt-3 border-top align-items-center justify-content-between">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="small fw-semibold text-muted me-1">
                    <i className="bi bi-funnel-fill text-success me-1"></i>Filter view:
                  </span>
                  <button
                    type="button"
                    className={`btn btn-category-pill btn-sm ${filterTab === "all" ? "active" : ""}`}
                    onClick={() => setFilterTab("all")}
                  >
                    <i className="bi bi-grid-fill me-1"></i>All Items ({totalCount})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-category-pill btn-sm ${filterTab === "markets" ? "active" : ""}`}
                    onClick={() => setFilterTab("markets")}
                  >
                    <i className="bi bi-shop me-1"></i>Markets ({savedMarkets.length})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-category-pill btn-sm ${filterTab === "produce" ? "active" : ""}`}
                    onClick={() => setFilterTab("produce")}
                  >
                    <i className="bi bi-basket2 me-1"></i>Produce ({savedProducts.length})
                  </button>
                </div>

                <div className="small text-muted d-flex align-items-center gap-1">
                  <i className="bi bi-info-circle-fill text-success"></i>
                  <span>Personal notes are preserved for your active session</span>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {totalCount === 0 && (
            <div className="empty-state p-5 text-center bg-white rounded-4 border shadow-sm">
              <div className="fs-1 text-muted mb-2">
                <i className="bi bi-bookmark-x text-warning"></i>
              </div>
              <h3 className="h4 fw-bold">No bookmarks yet</h3>
              <p className="text-secondary mb-4">
                Explore our verified Market Directory or Produce Guide and click the bookmark star to build your personalized shopping list.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/markets" className="btn btn-green shadow-sm">
                  <i className="bi bi-shop me-1"></i>Browse Markets
                </Link>
                <Link to="/produce" className="btn btn-outline-green">
                  <i className="bi bi-basket me-1"></i>Explore Produce
                </Link>
              </div>
            </div>
          )}

          {/* Bookmarked Markets Section */}
          {savedMarkets.length > 0 && (filterTab === "all" || filterTab === "markets") && (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0 text-success d-flex align-items-center gap-2">
                  <i className="bi bi-shop"></i>
                  <span>Bookmarked Markets ({savedMarkets.length})</span>
                </h3>
                <Link to="/markets" className="small text-success text-decoration-none fw-semibold">
                  + Explore more markets
                </Link>
              </div>

              <div className="row g-4">
                {savedMarkets.map((market) => {
                  const note = getBookmarkNote("markets", market.id);
                  const days = market.daysList ? market.daysList.join(", ") : market.days;
                  const thumbClass = market.thumbClass || "market-a";
                  const imageSrc = market.image ? `/assets/${market.image}` : "/assets/Images/hero.jpg";

                  return (
                    <div key={market.id} className="col-md-6 col-lg-4">
                      <article className="market-card bookmark-item-card h-100 position-relative d-flex flex-column justify-content-between bg-white border shadow-sm">
                        <div>
                          {/* Image Thumbnail with Overlay Badges */}
                          <div className={`bookmark-market-thumb ${thumbClass}`}>
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

                            {/* Top-Right Bookmark Button */}
                            <button
                              type="button"
                              className="bookmark-btn position-absolute top-0 end-0 m-2 saved"
                              aria-pressed="true"
                              title="Remove bookmark"
                              onClick={() => handleRemoveBookmark("markets", market.id)}
                              style={{ zIndex: 3 }}
                            >
                              <i className="bi bi-bookmark-star-fill text-warning"></i>
                            </button>

                            {/* Overlay Badges on Image */}
                            <div className="position-absolute bottom-0 start-0 m-3 d-flex gap-2 flex-wrap" style={{ zIndex: 3 }}>
                              <span className="badge-soft">{market.location}</span>
                              {market.type && (
                                <span className="badge bg-dark bg-opacity-75 text-white border-0 fw-normal">
                                  {market.type}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Content Body */}
                          <div className="card-body-custom pb-2">
                            <h4 className="h5 fw-bold mb-2 text-dark">{market.name}</h4>
                            <p className="text-secondary small mb-3">{market.description}</p>

                            <div className="market-meta mb-2 small">
                              <span>
                                <i className="bi bi-calendar-event me-1 text-success"></i>
                                {days}
                              </span>
                              <span>
                                <i className="bi bi-clock me-1 text-success"></i>
                                {market.hours}
                              </span>
                            </div>

                            <div className="market-meta mb-3 small">
                              <span>
                                <i className="bi bi-star-fill me-1" style={{ color: "var(--gold-500)" }}></i>
                                {market.rating ? market.rating.toFixed(1) : "4.5"}
                              </span>
                              {market.organic && (
                                <span>
                                  <i className="bi bi-flower1 me-1 text-success"></i> Organic Stalls
                                </span>
                              )}
                            </div>

                            {/* Integrated Personal Note Box */}
                            <div className="bookmark-note-box p-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold small text-success d-flex align-items-center gap-1">
                                  <i className="bi bi-journal-bookmark-fill text-success"></i>Personal Note
                                  <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: "0.68rem" }}>
                                    Session
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-success text-decoration-none fw-semibold"
                                  onClick={() => handleEditNote("markets", market.id, market.name)}
                                >
                                  {note ? (
                                    <>
                                      <i className="bi bi-pencil-square me-1"></i>Edit
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-plus-circle me-1"></i>Add Note
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className={`note-display small ${note ? "text-dark" : "text-muted fst-italic"}`}>
                                {note || 'No note added yet. Click "Add Note" to write a reminder for this session.'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="card-body-custom pt-0 pb-3">
                          <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
                            <Link to={`/markets/${market.id}`} className="btn btn-outline-green btn-sm fw-semibold">
                              <i className="bi bi-eye me-1"></i>View Details
                            </Link>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                title="Download Market Summary Sheet"
                                onClick={() => handleDownloadMarket(market)}
                              >
                                <i className="bi bi-download"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                title="Share Market"
                                onClick={() =>
                                  openShare(
                                    market.name,
                                    `Check out ${market.name} in ${market.location} on FreshFind!`,
                                    `/markets/${market.id}`
                                  )
                                }
                              >
                                <i className="bi bi-share"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                title="Remove from Bookmarks"
                                onClick={() => handleRemoveBookmark("markets", market.id)}
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bookmarked Produce Section */}
          {savedProducts.length > 0 && (filterTab === "all" || filterTab === "produce") && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0 text-success d-flex align-items-center gap-2">
                  <i className="bi bi-basket2"></i>
                  <span>Bookmarked Produce ({savedProducts.length})</span>
                </h3>
                <Link to="/produce" className="small text-success text-decoration-none fw-semibold">
                  + Explore more produce
                </Link>
              </div>

              <div className="row g-4">
                {savedProducts.map((product) => {
                  const note = getBookmarkNote("produce", product.id);
                  const imageSrc = product.image
                    ? product.image.startsWith("/")
                      ? product.image
                      : `/${product.image}`
                    : "/assets/Images/hero.jpg";

                  return (
                    <div key={product.id} className="col-md-6 col-lg-4">
                      <article className="product-card bookmark-item-card h-100 position-relative d-flex flex-column justify-content-between bg-white border shadow-sm">
                        <div>
                          {/* Image Thumbnail with Overlay Badges */}
                          <div className="produce-thumb position-relative">
                            <button
                              type="button"
                              className="bookmark-btn position-absolute top-0 end-0 m-2 saved"
                              aria-pressed="true"
                              title="Remove bookmark"
                              onClick={() => handleRemoveBookmark("produce", product.id)}
                              style={{ zIndex: 3 }}
                            >
                              <i className="bi bi-bookmark-star-fill text-warning"></i>
                            </button>

                            <img
                              src={imageSrc}
                              alt={product.alt || product.name}
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/Images/hero.jpg";
                              }}
                            />

                            {/* Overlay Badges */}
                            <div className="position-absolute bottom-0 start-0 m-3 d-flex gap-2 flex-wrap" style={{ zIndex: 3 }}>
                              <span className="badge-soft">{product.category}</span>
                              <span className="badge bg-light text-dark border">
                                {product.season}
                              </span>
                            </div>
                          </div>

                          {/* Card Content Body */}
                          <div className="p-4 pb-2">
                            <h4 className="h5 fw-bold mb-2 text-dark">{product.name}</h4>
                            <p className="text-secondary small mb-3">{product.description}</p>
                            <p className="small text-secondary mb-3">
                              <i className="bi bi-shop me-1 text-success"></i>
                              <strong>Found at:</strong> {(product.markets || []).join(", ") || "Local community stalls"}
                            </p>

                            {/* Integrated Personal Note Box */}
                            <div className="bookmark-note-box p-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold small text-success d-flex align-items-center gap-1">
                                  <i className="bi bi-journal-bookmark-fill text-success"></i>Personal Note
                                  <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: "0.68rem" }}>
                                    Session
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-success text-decoration-none fw-semibold"
                                  onClick={() => handleEditNote("produce", product.id, product.name)}
                                >
                                  {note ? (
                                    <>
                                      <i className="bi bi-pencil-square me-1"></i>Edit
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-plus-circle me-1"></i>Add Note
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className={`note-display small ${note ? "text-dark" : "text-muted fst-italic"}`}>
                                {note || 'No note added yet. Click "Add Note" to write a reminder for this session.'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="px-4 pb-3">
                          <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
                            <Link
                              to={product.isSeasonal ? `/seasonal/${product.id}` : `/produce/${product.id}`}
                              className="btn btn-outline-green btn-sm fw-semibold"
                            >
                              <i className="bi bi-eye me-1"></i>View Details
                            </Link>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                title="Download Produce Guide"
                                onClick={() => handleDownloadProduce(product)}
                              >
                                <i className="bi bi-download"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                title="Share Produce"
                                onClick={() =>
                                  openShare(
                                    product.name,
                                    `Check out seasonal ${product.name} on FreshFind!`,
                                    product.isSeasonal ? `/seasonal/${product.id}` : `/produce/${product.id}`
                                  )
                                }
                              >
                                <i className="bi bi-share"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                title="Remove from Bookmarks"
                                onClick={() => handleRemoveBookmark("produce", product.id)}
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

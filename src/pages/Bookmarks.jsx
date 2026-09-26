import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import marketsData from "../data/markets.json";
import productsData from "../data/products.json";
import {
  getBookmarks,
  toggleBookmark,
  getBookmarkNote,
  saveBookmarkNote,
  deleteBookmarkNote
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
  const allProducts = productsData.products || [];

  const [savedMarketIds, setSavedMarketIds] = useState([]);
  const [savedProduceIds, setSavedProduceIds] = useState([]);
  const [, setNoteRefreshTrigger] = useState(0);

  const loadBookmarks = () => {
    setSavedMarketIds(getBookmarks("markets"));
    setSavedProduceIds(getBookmarks("produce"));
  };

  useEffect(() => {
    loadBookmarks();
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
            Keep track of your favorite markets and seasonal produce. Attach session notes and download your custom guides anytime.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          {/* Header Toolbar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 bg-white rounded-3 shadow-sm border mb-4">
            <div>
              <h2 className="h5 mb-0 fw-bold">
                <i className="bi bi-bookmark-star-fill text-warning me-2"></i>Saved Items
              </h2>
              <p className="text-secondary small mb-0">
                {totalCount} {totalCount === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-green btn-sm"
                title="Download all saved items into a single document"
                onClick={handleDownloadAll}
              >
                <i className="bi bi-file-earmark-arrow-down me-1"></i>Download All Bookmarks
              </button>
              <button
                type="button"
                className="btn btn-outline-green btn-sm"
                title="Export as clean formatted text list"
                onClick={handleExportFormattedList}
              >
                <i className="bi bi-file-text me-1"></i>Export Formatted List
              </button>
              {totalCount > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  title="Clear all bookmarks"
                  onClick={handleClearAll}
                >
                  <i className="bi bi-trash3 me-1"></i>Clear All
                </button>
              )}
            </div>
          </div>

          {/* Session Notice */}
          <div className="alert alert-light border small text-muted d-flex align-items-center gap-2 mb-4 py-2">
            <i className="bi bi-info-circle-fill text-success fs-5"></i>
            <span>
              Bookmarks are saved in browser storage. <strong>Personal notes</strong> attached to items are{" "}
              <em>session-only</em> and will reset when you close the browser session.
            </span>
          </div>

          {/* Empty State */}
          {totalCount === 0 && (
            <div className="empty-state p-5 text-center bg-white rounded-4 border shadow-sm">
              <div className="fs-1 text-muted mb-2">
                <i className="bi bi-bookmark-x"></i>
              </div>
              <h3 className="h4 fw-bold">No bookmarks yet</h3>
              <p className="text-secondary mb-4">
                Browse our Market Directory or Produce Guide and bookmark entries to create your personalized shopping list.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/markets" className="btn btn-green">
                  <i className="bi bi-shop me-1"></i>Browse Markets
                </Link>
                <Link to="/produce" className="btn btn-outline-green">
                  <i className="bi bi-basket me-1"></i>Explore Produce
                </Link>
              </div>
            </div>
          )}

          {/* Bookmarked Markets Section */}
          {savedMarkets.length > 0 && (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0">
                  <i className="bi bi-shop me-2 text-success"></i>Bookmarked Markets ({savedMarkets.length})
                </h3>
                <Link to="/markets" className="small text-success text-decoration-none">
                  + Find more markets
                </Link>
              </div>
              <div className="row g-4">
                {savedMarkets.map((market) => {
                  const note = getBookmarkNote("markets", market.id);
                  const days = market.daysList ? market.daysList.join(", ") : market.days;

                  return (
                    <div key={market.id} className="col-md-6 col-xl-6">
                      <article className="market-card bookmark-item-card h-100 p-3 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                            <div>
                              <span className="badge-soft me-2">{market.location}</span>
                              {market.type && (
                                <span className="badge bg-light text-muted border">{market.type}</span>
                              )}
                              <h4 className="h5 mt-2 mb-1">{market.name}</h4>
                              <div className="small text-muted mb-2">
                                <i className="bi bi-calendar-event me-1"></i>
                                {days} &bull; <i className="bi bi-clock me-1"></i>
                                {market.hours}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Remove from bookmarks"
                              onClick={() => handleRemoveBookmark("markets", market.id)}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>

                          <p className="small text-secondary mb-3">{market.description}</p>

                          {/* Personal Note Box */}
                          <div className="bookmark-note-box p-3 rounded mb-3 bg-light border">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold small text-success">
                                <i className="bi bi-journal-text me-1"></i>Personal Note{" "}
                                <span className="badge bg-secondary-subtle text-secondary fw-normal">
                                  Session only
                                </span>
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-link p-0 text-success text-decoration-none"
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
                              {note ||
                                'No personal note added yet. Click "Add Note" to write a reminder for this session.'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                          <Link to={`/markets/${market.id}`} className="btn btn-sm btn-outline-green">
                            <i className="bi bi-eye me-1"></i>View Details
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleDownloadMarket(market)}
                          >
                            <i className="bi bi-download me-1"></i>Download Details
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              openShare(
                                market.name,
                                `Check out ${market.name} on FreshFind!`,
                                `/markets/${market.id}`
                              )
                            }
                          >
                            <i className="bi bi-share me-1"></i>Share
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={() => handleRemoveBookmark("markets", market.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>Remove
                          </button>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bookmarked Produce Section */}
          {savedProducts.length > 0 && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0">
                  <i className="bi bi-basket2 me-2 text-success"></i>Bookmarked Produce ({savedProducts.length})
                </h3>
                <Link to="/produce" className="small text-success text-decoration-none">
                  + Explore more produce
                </Link>
              </div>
              <div className="row g-4">
                {savedProducts.map((product) => {
                  const note = getBookmarkNote("produce", product.id);

                  return (
                    <div key={product.id} className="col-md-6 col-xl-6">
                      <article className="product-card bookmark-item-card h-100 p-3 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                            <div>
                              <span className="badge-soft me-2">{product.category}</span>
                              <span className="badge bg-light text-muted border">{product.season}</span>
                              <h4 className="h5 mt-2 mb-1">{product.name}</h4>
                              <div className="small text-muted mb-2">
                                <i className="bi bi-shop me-1"></i>Found at:{" "}
                                {(product.markets || []).join(", ")}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Remove from bookmarks"
                              onClick={() => handleRemoveBookmark("produce", product.id)}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>

                          <p className="small text-secondary mb-3">{product.description}</p>

                          {/* Personal Note Box */}
                          <div className="bookmark-note-box p-3 rounded mb-3 bg-light border">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold small text-success">
                                <i className="bi bi-journal-text me-1"></i>Personal Note{" "}
                                <span className="badge bg-secondary-subtle text-secondary fw-normal">
                                  Session only
                                </span>
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-link p-0 text-success text-decoration-none"
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
                              {note ||
                                'No personal note added yet. Click "Add Note" to write a reminder for this session.'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                          <Link to={`/produce/${product.id}`} className="btn btn-sm btn-outline-green">
                            <i className="bi bi-eye me-1"></i>View Details
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleDownloadProduce(product)}
                          >
                            <i className="bi bi-download me-1"></i>Download Guide
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              openShare(
                                product.name,
                                `Check out seasonal ${product.name} on FreshFind!`,
                                `/produce/${product.id}`
                              )
                            }
                          >
                            <i className="bi bi-share me-1"></i>Share
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={() => handleRemoveBookmark("produce", product.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>Remove
                          </button>
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

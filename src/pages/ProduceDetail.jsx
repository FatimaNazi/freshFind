import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import productsData from "../data/products.json";
import marketsData from "../data/markets.json";
import { isBookmarked, toggleBookmark, getBookmarkNote } from "../utils/storage";
import { generateProduceGuideDoc, downloadTextFile } from "../utils/exportDoc";
import { useModals } from "../context/ModalContext";
import { useToast } from "../components/Toast";

function getStorageAdvice(category, name) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tomato")) return "Keep at room temperature away from direct sunlight; refrigerate only when fully ripe.";
  if (lower.includes("potato")) return "Store in a cool, dark, well-ventilated pantry away from onions.";
  if (lower.includes("spinach")) return "Wrap in dry paper towels and keep in the vegetable crisper (use within 3-4 days).";
  if (lower.includes("banana")) return "Store at room temperature hanging or unstacked; refrigerate peeled slices in airtight bags.";
  if (lower.includes("mango")) return "Keep at room temperature until fragrant and soft to gentle touch, then chill before eating.";
  if (lower.includes("mint")) return "Trim stems and place upright in a glass of water, or wrap loosely in a moist towel.";
  if (lower.includes("yogurt")) return "Keep refrigerated between 2°C – 4°C. Consume within 7 days of purchase.";
  if (lower.includes("chili")) return "Remove stems and store in an airtight container lined with tissue paper in the fridge.";
  if (category === "Vegetables") return "Store in the refrigerator crisper drawer with appropriate humidity control.";
  if (category === "Fruits") return "Ripen at room temperature, then store in the refrigerator to prolong shelf life.";
  if (category === "Herbs") return "Refrigerate in a breathable bag or place upright in shallow fresh water.";
  if (category === "Dairy") return "Store in the coldest part of your refrigerator, never in the door.";
  return "Keep in a cool, dry, dark pantry away from heat and moisture.";
}

function getNutritionHighlights(category, name) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tomato")) return "High in Lycopene, Vitamin C, Potassium, and Vitamin K.";
  if (lower.includes("potato")) return "Excellent source of Vitamin B6, complex carbs, Potassium, and Dietary Fiber.";
  if (lower.includes("spinach")) return "Rich in non-heme Iron, Calcium, Folate, and Vitamins A, C, and K.";
  if (lower.includes("mango")) return "Packed with Vitamin A, Vitamin C, digestive enzymes, and polyphenols.";
  if (lower.includes("banana")) return "Rich in natural electrolytes, Potassium, Vitamin B6, and prebiotic fiber.";
  if (lower.includes("mint")) return "Contains Menthol, Vitamin A, and powerful soothing antioxidants.";
  if (lower.includes("yogurt")) return "Rich in Probiotics, high-quality Protein, Calcium, and Vitamin B12.";
  if (lower.includes("chili")) return "Packed with Capsaicin, Vitamin C, Vitamin A, and metabolism-boosting carotenoids.";
  if (category === "Vegetables") return "Low calorie, nutrient-dense, high in dietary fiber and essential micronutrients.";
  if (category === "Fruits") return "Natural fruit sugars, high hydration, vitamins, and protective antioxidants.";
  if (category === "Herbs") return "Rich in essential oils, flavonoids, and anti-inflammatory compounds.";
  if (category === "Dairy") return "High in bioavailable calcium, complete proteins, and active beneficial cultures.";
  return "Wholesome, unrefined whole food packed with natural nourishment.";
}

function getCulinaryUses(name, category) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tomato")) return "Fresh kachumber salads, handi curries, shorba gravies, and homemade chutneys.";
  if (lower.includes("potato")) return "Aloo ki bhujia, biryani, samosa fillings, cutlets, and hearty vegetable stews.";
  if (lower.includes("spinach")) return "Palak gosht, saag paneer, dal palak, vegetable pakoras, and fresh parathas.";
  if (lower.includes("mango")) return "Chilled fresh slices, traditional mango lassi, aam panna, milkshakes, and desserts.";
  if (lower.includes("banana")) return "Morning smoothies, chaat bowls, fruit salads, quick snacks, and bakery breads.";
  if (lower.includes("mint")) return "Dahi pudina raita, refreshing lemonade, coriander-mint chutney, and biryani aroma garnishes.";
  if (lower.includes("yogurt")) return "Everyday meal accompaniments, marinating tikkas, creamy raitas, and chilled lassi.";
  if (lower.includes("chili")) return "Tempering dals, salan gravies, spicy chatpatay chutneys, and karahi seasoning.";
  return "Versatile farm ingredient for home cooking, seasonal recipes, and daily kitchen preparations.";
}

export default function ProduceDetail() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const { openShare } = useModals();
  const { addToast } = useToast();

  const allProducts = productsData.products || [];
  const allMarkets = marketsData.markets || [];

  const activeId = (
    paramId ||
    location.hash.replace("#", "") ||
    new URLSearchParams(location.search).get("id") ||
    "spinach"
  ).toLowerCase();

  const product = allProducts.find((p) => p.id.toLowerCase() === activeId) || allProducts[0];

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setSaved(isBookmarked("produce", product.id));
      document.title = `${product.name} | FreshFind Produce Guide`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Produce item not found.</div>
        <Link to="/produce" className="btn btn-green mt-3">
          Back to Produce Guide
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    const nowSaved = toggleBookmark("produce", product.id);
    setSaved(nowSaved);
    addToast(
      nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.",
      nowSaved ? "success" : "info"
    );
  };

  const handleShareClick = () => {
    const shareUrl = `/produce/${product.id}`;
    openShare(
      `${product.name} - FreshFind Produce Guide`,
      `Check out fresh ${product.name} and where to find it on FreshFind!`,
      shareUrl
    );
  };

  const handleDownloadGuide = () => {
    const note = getBookmarkNote("produce", product.id);
    const content = generateProduceGuideDoc(product, note);
    downloadTextFile(`FreshFind_${product.name.replace(/\s+/g, "_")}_Guide.txt`, content);
    addToast("Produce guide document downloaded!", "success");
  };

  const storageAdvice = getStorageAdvice(product.category, product.name);
  const nutrition = getNutritionHighlights(product.category, product.name);
  const culinary = getCulinaryUses(product.name, product.category);

  // Associated Markets
  const marketNames = product.markets || [];

  // Related Produce Items
  let relatedItems = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  if (relatedItems.length < 2) {
    relatedItems = allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  }

  const imageSrc = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : "/assets/Images/hero.jpg";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Produce Guide", url: "/produce" },
          { label: product.name, active: true }
        ]}
      />

      <main className="detail-section">
        <div className="container">
          {/* Hero Product Cover */}
          <div className="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
            <div className="detail-cover-content p-4 p-md-5">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <span className="badge bg-white text-success fw-bold px-3 py-2">
                  <i className="bi bi-basket2-fill me-1"></i>
                  {product.category}
                </span>
                <span className="badge bg-dark bg-opacity-50 text-white px-3 py-2">
                  <i className="bi bi-calendar3 me-1"></i>Season: {product.season}
                </span>
                <span className="badge bg-success text-white px-3 py-2">
                  <i className="bi bi-check2-circle me-1"></i>Local Harvest
                </span>
              </div>
              <h1 className="display-5 fw-bold text-white mb-2">{product.name}</h1>
              <p className="lead text-white-50 mb-0">{product.description}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge-soft">
                <i className="bi bi-tag-fill me-1"></i>
                {product.category}
              </span>
              <span className="badge-soft">
                <i className="bi bi-sun-fill text-warning me-1"></i>
                {product.season}
              </span>
              <span className="badge-soft">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {marketNames.length} Active Markets
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
                title="Download produce guide document"
                onClick={handleDownloadGuide}
              >
                <i className="bi bi-download me-1"></i>Download Guide
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm share-trigger-btn"
                title="Share produce"
                onClick={handleShareClick}
              >
                <i className="bi bi-share me-1"></i>Share Produce
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Image & Specifications */}
            <div className="col-lg-5 d-flex flex-column gap-4">
              {/* Main Product Photo */}
              <div className="detail-card p-3 text-center overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.alt || product.name}
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
                    <i className="bi bi-camera me-1"></i>Authentic Local Produce
                  </span>
                  <span className="badge bg-light text-secondary border small">{product.season}</span>
                </div>
              </div>

              {/* Quick Specifications Card */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-info-circle-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Produce Specifications</h3>
                </div>
                <ul className="list-unstyled mb-0 d-grid gap-3 small">
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-success fs-5">
                      <i className="bi bi-grid-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Produce Category:</strong>
                      <div className="text-secondary">{product.category}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-warning fs-5">
                      <i className="bi bi-calendar2-range-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Typical Season:</strong>
                      <div className="text-secondary">{product.season}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-info fs-5">
                      <i className="bi bi-box-seam-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Storage Advice:</strong>
                      <div className="text-secondary">{storageAdvice}</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3">
                    <div className="text-danger fs-5">
                      <i className="bi bi-egg-fried"></i>
                    </div>
                    <div>
                      <strong className="text-dark">Culinary Applications:</strong>
                      <div className="text-secondary">{culinary}</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Nutrition Highlights */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-heart-pulse-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Nutrition &amp; Wellness</h3>
                </div>
                <p className="small text-secondary mb-3">{nutrition}</p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    <i className="bi bi-check-lg me-1"></i>100% Farm Fresh
                  </span>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    <i className="bi bi-droplet me-1"></i>Nutrient Dense
                  </span>
                  <span className="badge bg-warning-subtle text-dark border border-warning-subtle">
                    <i className="bi bi-sun me-1"></i>Naturally Grown
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Available Markets */}
            <div className="col-lg-7 d-flex flex-column gap-4">
              {/* Overview Card */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-journal-text"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">About {product.name}</h3>
                </div>
                <p className="text-secondary mb-3">{product.description}</p>
                <p className="text-secondary small mb-0">
                  When sourcing produce through local farmers markets, you obtain items picked at peak maturity
                  rather than early-harvested varieties that lose flavor during extended transit. This directly
                  benefits both family nutrition and local farming communities across Sindh.
                </p>
              </div>

              {/* Available Markets Section */}
              <div className="detail-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="product-icon">
                      <i className="bi bi-shop-window"></i>
                    </div>
                    <h3 className="h5 mb-0 fw-bold">Markets Stocking This Produce</h3>
                  </div>
                  <Link to="/markets" className="btn btn-outline-green btn-sm">
                    All Markets Directory
                  </Link>
                </div>
                <p className="small text-secondary mb-3">
                  Visit these neighborhood farmers markets to purchase fresh <strong>{product.name}</strong>{" "}
                  directly from vetted local stalls:
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
                      <p className="text-secondary mb-0">Market availability schedule updating soon.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Farmers Market Buying Tips */}
              <div className="detail-card p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="product-icon">
                    <i className="bi bi-patch-check-fill"></i>
                  </div>
                  <h3 className="h5 mb-0 fw-bold">Market Shopper Tips for {product.name}</h3>
                </div>
                <div className="d-grid gap-3 small text-secondary">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-1-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Arrive early for best selection:</strong> Early morning stalls carry the crispest
                      harvests that haven't been exposed to peak midday heat.
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-2-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Ask the grower about the harvest date:</strong> Farm stalls often harvest produce less
                      than 24 hours prior to market opening.
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-3-circle-fill text-success fs-6 mt-1"></i>
                    <div>
                      <strong>Inspect weight &amp; aroma:</strong> Fresh produce feels pleasantly heavy for its size
                      and carries a clean, natural aroma near the stem.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Produce Section */}
          <div className="detail-card p-4 p-md-5 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge-soft">
                  <i className="bi bi-stars text-warning me-1"></i>Explore More
                </span>
                <h3 className="h4 fw-bold mt-2 mb-0">More in {product.category}</h3>
              </div>
              <Link to="/produce" className="btn btn-outline-green btn-sm">
                View Full Guide
              </Link>
            </div>
            <div className="row g-4">
              {relatedItems.map((item) => {
                const itemImg = item.image
                  ? item.image.startsWith("/")
                    ? item.image
                    : `/${item.image}`
                  : "/assets/Images/hero.jpg";
                return (
                  <div key={item.id} className="col-md-4">
                    <div className="product-card h-100 p-3 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="produce-thumb mb-3 rounded-3 overflow-hidden bg-light" style={{ height: "150px" }}>
                          <img
                            src={itemImg}
                            alt={item.alt || item.name}
                            className="w-100 h-100 object-fit-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/Images/hero.jpg";
                            }}
                          />
                        </div>
                        <span className="badge-soft mb-2">{item.category}</span>
                        <h5 className="h6 fw-bold mt-1 mb-1">{item.name}</h5>
                        <p className="small text-secondary mb-2">
                          {item.description ? item.description.slice(0, 75) : ""}...
                        </p>
                      </div>
                      <div className="pt-2 border-top mt-2">
                        <Link to={`/produce/${item.id}`} className="btn btn-outline-green btn-sm w-100">
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
            <Link to="/produce" className="btn btn-outline-green">
              <i className="bi bi-arrow-left me-1"></i> Back to Produce Guide
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

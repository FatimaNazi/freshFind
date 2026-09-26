// Produce Detail Page Script - FreshFind
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("produce-detail-container");
  if (!container) return;

  var allProducts = [];
  var allMarkets = [];

  Promise.all([
    fetch("assets/products.json").then(function (r) { return r.json(); }),
    fetch("assets/markets.json").then(function (r) { return r.json(); })
  ])
    .then(function (results) {
      allProducts = results[0].products || [];
      allMarkets = results[1].markets || [];
      renderProduceDetail();
    })
    .catch(function (error) {
      console.error("Produce detail loading error:", error);
      container.innerHTML = '<div class="alert alert-danger p-4 rounded-4"><i class="bi bi-exclamation-triangle-fill me-2"></i>Unable to load produce data. Please check back later.</div>';
    });

  window.addEventListener("hashchange", renderProduceDetail);

  function getStorageAdvice(category, name) {
    var lower = (name || "").toLowerCase();
    if (lower.indexOf("tomato") !== -1) return "Keep at room temperature away from direct sunlight; refrigerate only when fully ripe.";
    if (lower.indexOf("potato") !== -1) return "Store in a cool, dark, well-ventilated pantry away from onions.";
    if (lower.indexOf("spinach") !== -1) return "Wrap in dry paper towels and keep in the vegetable crisper (use within 3-4 days).";
    if (lower.indexOf("banana") !== -1) return "Store at room temperature hanging or unstacked; refrigerate peeled slices in airtight bags.";
    if (lower.indexOf("mango") !== -1) return "Keep at room temperature until fragrant and soft to gentle touch, then chill before eating.";
    if (lower.indexOf("mint") !== -1) return "Trim stems and place upright in a glass of water, or wrap loosely in a moist towel.";
    if (lower.indexOf("yogurt") !== -1) return "Keep refrigerated between 2°C – 4°C. Consume within 7 days of purchase.";
    if (lower.indexOf("chili") !== -1) return "Remove stems and store in an airtight container lined with tissue paper in the fridge.";
    if (category === "Vegetables") return "Store in the refrigerator crisper drawer with appropriate humidity control.";
    if (category === "Fruits") return "Ripen at room temperature, then store in the refrigerator to prolong shelf life.";
    if (category === "Herbs") return "Refrigerate in a breathable bag or place upright in shallow fresh water.";
    if (category === "Dairy") return "Store in the coldest part of your refrigerator, never in the door.";
    return "Keep in a cool, dry, dark pantry away from heat and moisture.";
  }

  function getNutritionHighlights(category, name) {
    var lower = (name || "").toLowerCase();
    if (lower.indexOf("tomato") !== -1) return "High in Lycopene, Vitamin C, Potassium, and Vitamin K.";
    if (lower.indexOf("potato") !== -1) return "Excellent source of Vitamin B6, complex carbs, Potassium, and Dietary Fiber.";
    if (lower.indexOf("spinach") !== -1) return "Rich in non-heme Iron, Calcium, Folate, and Vitamins A, C, and K.";
    if (lower.indexOf("mango") !== -1) return "Packed with Vitamin A, Vitamin C, digestive enzymes, and polyphenols.";
    if (lower.indexOf("banana") !== -1) return "Rich in natural electrolytes, Potassium, Vitamin B6, and prebiotic fiber.";
    if (lower.indexOf("mint") !== -1) return "Contains Menthol, Vitamin A, and powerful soothing antioxidants.";
    if (lower.indexOf("yogurt") !== -1) return "Rich in Probiotics, high-quality Protein, Calcium, and Vitamin B12.";
    if (lower.indexOf("chili") !== -1) return "Packed with Capsaicin, Vitamin C, Vitamin A, and metabolism-boosting carotenoids.";
    if (category === "Vegetables") return "Low calorie, nutrient-dense, high in dietary fiber and essential micronutrients.";
    if (category === "Fruits") return "Natural fruit sugars, high hydration, vitamins, and protective antioxidants.";
    if (category === "Herbs") return "Rich in essential oils, flavonoids, and anti-inflammatory compounds.";
    if (category === "Dairy") return "High in bioavailable calcium, complete proteins, and active beneficial cultures.";
    return "Wholesome, unrefined whole food packed with natural nourishment.";
  }

  function getCulinaryUses(name, category) {
    var lower = (name || "").toLowerCase();
    if (lower.indexOf("tomato") !== -1) return "Fresh kachumber salads, handi curries, shorba gravies, and homemade chutneys.";
    if (lower.indexOf("potato") !== -1) return "Aloo ki bhujia, biryani, samosa fillings, cutlets, and hearty vegetable stews.";
    if (lower.indexOf("spinach") !== -1) return "Palak gosht, saag paneer, dal palak, vegetable pakoras, and fresh parathas.";
    if (lower.indexOf("mango") !== -1) return "Chilled fresh slices, traditional mango lassi, aam panna, milkshakes, and desserts.";
    if (lower.indexOf("banana") !== -1) return "Morning smoothies, chaat bowls, fruit salads, quick snacks, and bakery breads.";
    if (lower.indexOf("mint") !== -1) return "Dahi pudina raita, refreshing lemonade, coriander-mint chutney, and biryani aroma garnishes.";
    if (lower.indexOf("yogurt") !== -1) return "Everyday meal accompaniments, marinating tikkas, creamy raitas, and chilled lassi.";
    if (lower.indexOf("chili") !== -1) return "Tempering dals, salan gravies, spicy chatpatay chutneys, and karahi seasoning.";
    return "Versatile farm ingredient for home cooking, seasonal recipes, and daily kitchen preparations.";
  }

  function renderProduceDetail() {
    if (!allProducts.length) return;

    var id = location.hash.replace("#", "").trim();
    if (!id) {
      var params = new URLSearchParams(window.location.search);
      id = params.get("id") || "";
    }

    var product = allProducts.find(function (p) {
      return p.id.toLowerCase() === id.toLowerCase();
    });

    if (!product) {
      product = allProducts[0];
    }

    // Update document title and breadcrumb
    document.title = product.name + " | FreshFind Produce Guide";
    var breadcrumbTitle = document.getElementById("breadcrumb-produce-title");
    if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

    var storageAdvice = getStorageAdvice(product.category, product.name);
    var nutrition = getNutritionHighlights(product.category, product.name);
    var culinary = getCulinaryUses(product.name, product.category);

    // Map associated markets
    var marketCardsHtml = "";
    var marketNames = product.markets || [];

    if (marketNames.length > 0) {
      marketCardsHtml = marketNames.map(function (mName) {
        var marketObj = allMarkets.find(function (m) {
          return m.name.toLowerCase() === mName.toLowerCase();
        });

        var targetHash = marketObj ? marketObj.id : "clifton";
        var locationText = marketObj ? marketObj.location : "Karachi";
        var daysText = marketObj ? marketObj.days : "Weekend Stall";
        var hoursText = marketObj ? marketObj.hours : "Morning – Afternoon";

        return `
          <div class="col-md-6 mb-3">
            <div class="detail-stall-card p-3 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <h4 class="h6 fw-bold mb-0">${mName}</h4>
                  <span class="badge bg-light text-success border"><i class="bi bi-geo-alt-fill me-1"></i>${locationText}</span>
                </div>
                <div class="small text-secondary mb-2">
                  <div><i class="bi bi-calendar-event me-1"></i>${daysText}</div>
                  <div><i class="bi bi-clock me-1"></i>${hoursText}</div>
                </div>
              </div>
              <div class="pt-2 border-top mt-2">
                <a href="market-detail.html#${targetHash}" class="btn btn-outline-green btn-sm w-100">
                  <i class="bi bi-shop me-1"></i>View Market Details
                </a>
              </div>
            </div>
          </div>
        `;
      }).join("");
    } else {
      marketCardsHtml = '<div class="col-12"><p class="text-secondary mb-0">Market availability schedule updating soon.</p></div>';
    }

    // Related Produce Items (same category)
    var relatedItems = allProducts.filter(function (p) {
      return p.id !== product.id && p.category === product.category;
    }).slice(0, 3);

    if (relatedItems.length < 2) {
      relatedItems = allProducts.filter(function (p) { return p.id !== product.id; }).slice(0, 3);
    }

    var relatedHtml = relatedItems.map(function (item) {
      return `
        <div class="col-md-4">
          <div class="product-card h-100 p-3 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
            <div>
              <div class="produce-thumb mb-3 rounded-3 overflow-hidden" style="height:140px;">
                <img src="${item.image}" alt="${item.alt}" class="w-100 h-100 object-fit-cover" loading="lazy" onerror="this.style.display='none'">
              </div>
              <span class="badge-soft mb-2">${item.category}</span>
              <h5 class="h6 fw-bold mt-1 mb-1">${item.name}</h5>
              <p class="small text-secondary mb-2">${item.description.slice(0, 75)}...</p>
            </div>
            <div class="pt-2 border-top mt-2">
              <a href="produce-detail.html#${item.id}" class="btn btn-outline-green btn-sm w-100">
                <i class="bi bi-eye me-1"></i>View Details
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <!-- Hero Product Cover -->
      <div class="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
        <div class="detail-cover-content p-4 p-md-5">
          <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span class="badge bg-white text-success fw-bold px-3 py-2">
              <i class="bi bi-basket2-fill me-1"></i>${product.category}
            </span>
            <span class="badge bg-dark bg-opacity-50 text-white px-3 py-2">
              <i class="bi bi-calendar3 me-1"></i>Season: ${product.season}
            </span>
            <span class="badge bg-success text-white px-3 py-2">
              <i class="bi bi-check2-circle me-1"></i>Local Harvest
            </span>
          </div>
          <h1 class="display-5 fw-bold text-white mb-2">${product.name}</h1>
          <p class="lead text-white-50 mb-0">${product.description}</p>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <span class="badge-soft"><i class="bi bi-tag-fill me-1"></i>${product.category}</span>
          <span class="badge-soft"><i class="bi bi-sun-fill text-warning me-1"></i>${product.season}</span>
          <span class="badge-soft"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${(product.markets ? product.markets.length : 0)} Active Markets</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          ${bookmarkButtonHtml("produce", product.id)}
          <button type="button" class="btn btn-outline-secondary btn-sm share-trigger-btn"
                  data-share-title="${encodeURIComponent(product.name + ' - FreshFind Produce Guide')}"
                  data-share-text="${encodeURIComponent('Check out fresh ' + product.name + ' and where to find it on FreshFind!')}"
                  data-share-url="produce-detail.html#${product.id}">
            <i class="bi bi-share me-1"></i>Share Produce
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Image & Specifications -->
        <div class="col-lg-5 d-flex flex-column gap-4">
          <!-- Main Product Photo -->
          <div class="detail-card p-3 text-center overflow-hidden">
            <img src="${product.image}" alt="${product.alt}" class="w-100 rounded-3 shadow-sm object-fit-cover" style="max-height: 320px;" loading="lazy" onerror="this.src='assets/Images/hero.jpg'">
            <div class="d-flex justify-content-between align-items-center mt-3 px-2">
              <span class="small text-muted"><i class="bi bi-camera me-1"></i>Authentic Local Produce</span>
              <span class="badge bg-light text-secondary border small">${product.season}</span>
            </div>
          </div>

          <!-- Quick Specifications Card -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-info-circle-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Produce Specifications</h3>
            </div>
            <ul class="list-unstyled mb-0 d-grid gap-3 small">
              <li class="d-flex align-items-start gap-3">
                <div class="text-success fs-5"><i class="bi bi-grid-fill"></i></div>
                <div>
                  <strong class="text-dark">Produce Category:</strong>
                  <div class="text-secondary">${product.category}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-warning fs-5"><i class="bi bi-calendar2-range-fill"></i></div>
                <div>
                  <strong class="text-dark">Typical Season:</strong>
                  <div class="text-secondary">${product.season}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-info fs-5"><i class="bi bi-box-seam-fill"></i></div>
                <div>
                  <strong class="text-dark">Storage Advice:</strong>
                  <div class="text-secondary">${storageAdvice}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-danger fs-5"><i class="bi bi-egg-fried"></i></div>
                <div>
                  <strong class="text-dark">Culinary Applications:</strong>
                  <div class="text-secondary">${culinary}</div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Nutrition Highlights -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-heart-pulse-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Nutrition &amp; Wellness</h3>
            </div>
            <p class="small text-secondary mb-3">${nutrition}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-lg me-1"></i>100% Farm Fresh</span>
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-droplet me-1"></i>Nutrient Dense</span>
              <span class="badge bg-warning-subtle text-dark border border-warning-subtle"><i class="bi bi-sun me-1"></i>Naturally Grown</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Details & Available Markets -->
        <div class="col-lg-7 d-flex flex-column gap-4">
          <!-- Overview Card -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-journal-text"></i></div>
              <h3 class="h5 mb-0 fw-bold">About ${product.name}</h3>
            </div>
            <p class="text-secondary mb-3">${product.description}</p>
            <p class="text-secondary small mb-0">
              When sourcing produce through local farmers markets, you obtain items picked at peak maturity rather than early-harvested varieties that lose flavor during extended transit. This directly benefits both family nutrition and local farming communities across Sindh.
            </p>
          </div>

          <!-- Available Markets Section -->
          <div class="detail-card p-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div class="d-flex align-items-center gap-2">
                <div class="product-icon"><i class="bi bi-shop-window"></i></div>
                <h3 class="h5 mb-0 fw-bold">Markets Stocking This Produce</h3>
              </div>
              <a href="markets.html" class="btn btn-outline-green btn-sm">All Markets Directory</a>
            </div>
            <p class="small text-secondary mb-3">
              Visit these neighborhood farmers markets to purchase fresh <strong>${product.name}</strong> directly from vetted local stalls:
            </p>
            <div class="row g-3">
              ${marketCardsHtml}
            </div>
          </div>

          <!-- Farmers Market Buying Tips -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-patch-check-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Market Shopper Tips for ${product.name}</h3>
            </div>
            <div class="d-grid gap-3 small text-secondary">
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-1-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Arrive early for best selection:</strong> Early morning stalls carry the crispest harvests that haven't been exposed to peak midday heat.</div>
              </div>
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-2-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Ask the grower about the harvest date:</strong> Farm stalls often harvest produce less than 24 hours prior to market opening.</div>
              </div>
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-3-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Inspect weight &amp; aroma:</strong> Fresh produce feels pleasantly heavy for its size and carries a clean, natural aroma near the stem.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Produce Section -->
      <div class="detail-card p-4 p-md-5 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="badge-soft"><i class="bi bi-stars text-warning me-1"></i>Explore More</span>
            <h3 class="h4 fw-bold mt-2 mb-0">More in ${product.category}</h3>
          </div>
          <a href="produce.html" class="btn btn-outline-green btn-sm">View Full Guide</a>
        </div>
        <div class="row g-4">
          ${relatedHtml}
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <a href="produce.html" class="btn btn-outline-green"><i class="bi bi-arrow-left me-1"></i> Back to Produce Guide</a>
        <a href="#" class="btn btn-link text-success text-decoration-none">Back to top <i class="bi bi-arrow-up"></i></a>
      </div>
    `;
  }
});

// Seasonal Produce Detail Page Script - FreshFind
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("seasonal-detail-container");
  if (!container) return;

  var allSeasonalItems = [];
  var allMarkets = [];

  Promise.all([
    fetch("assets/seasonal.json").then(function (r) { return r.json(); }),
    fetch("assets/markets.json").then(function (r) { return r.json(); })
  ])
    .then(function (results) {
      allSeasonalItems = results[0].seasonalProduce || [];
      allMarkets = results[1].markets || [];
      renderSeasonalDetail();
    })
    .catch(function (error) {
      console.error("Seasonal detail loading error:", error);
      container.innerHTML = '<div class="alert alert-danger p-4 rounded-4"><i class="bi bi-exclamation-triangle-fill me-2"></i>Unable to load seasonal data. Please check back later.</div>';
    });

  window.addEventListener("hashchange", renderSeasonalDetail);

  function getSeasonBadge(season) {
    switch (season) {
      case "Summer":
        return '<span class="badge bg-warning text-dark"><i class="bi bi-sun-fill me-1"></i>Summer Special</span>';
      case "Winter":
        return '<span class="badge bg-info text-white"><i class="bi bi-snow me-1"></i>Winter Harvest</span>';
      case "Spring":
        return '<span class="badge bg-success text-white"><i class="bi bi-flower1 me-1"></i>Spring Bloom</span>';
      case "Autumn":
        return '<span class="badge bg-danger text-white"><i class="bi bi-tree-fill me-1"></i>Autumn Harvest</span>';
      default:
        return '<span class="badge bg-primary text-white"><i class="bi bi-arrow-repeat me-1"></i>Year-Round Staple</span>';
    }
  }

  function getFlavorTags(flavorNotes) {
    if (!flavorNotes) return "";
    var parts = flavorNotes.split(",");
    return parts.map(function (p) {
      return '<span class="badge bg-light text-dark border me-1 mb-1">' + p.trim() + '</span>';
    }).join("");
  }

  function renderSeasonalDetail() {
    if (!allSeasonalItems.length) return;

    var id = location.hash.replace("#", "").trim();
    if (!id) {
      var params = new URLSearchParams(window.location.search);
      id = params.get("id") || "";
    }

    var item = allSeasonalItems.find(function (s) {
      return s.id.toLowerCase() === id.toLowerCase();
    });

    if (!item) {
      item = allSeasonalItems[0];
    }

    // Update document title and breadcrumb
    document.title = item.name + " | FreshFind Seasonal Guide";
    var breadcrumbTitle = document.getElementById("breadcrumb-seasonal-title");
    if (breadcrumbTitle) breadcrumbTitle.textContent = item.name;

    var seasonBadge = getSeasonBadge(item.season);
    var flavorTags = getFlavorTags(item.flavorNotes);

    // Map associated markets
    var marketCardsHtml = "";
    var marketNames = item.markets || [];

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
      marketCardsHtml = '<div class="col-12"><p class="text-secondary mb-0">Seasonal market stall schedule updating soon.</p></div>';
    }

    // Related items from the same season
    var relatedItems = allSeasonalItems.filter(function (s) {
      return s.id !== item.id && s.season === item.season;
    }).slice(0, 3);

    if (relatedItems.length < 2) {
      relatedItems = allSeasonalItems.filter(function (s) { return s.id !== item.id; }).slice(0, 3);
    }

    var relatedHtml = relatedItems.map(function (sItem) {
      return `
        <div class="col-md-4">
          <div class="product-card h-100 p-3 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
            <div>
              <div class="produce-thumb mb-3 rounded-3 overflow-hidden" style="height:140px;">
                <img src="${sItem.image}" alt="${sItem.alt}" class="w-100 h-100 object-fit-cover" loading="lazy" onerror="this.style.display='none'">
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-light text-dark border small">${sItem.season}</span>
                <span class="badge-soft small">${sItem.category}</span>
              </div>
              <h5 class="h6 fw-bold mb-1">${sItem.name}</h5>
              <div class="small text-success mb-2"><i class="bi bi-calendar-check me-1"></i>${sItem.months}</div>
              <p class="small text-secondary mb-2">${sItem.description.slice(0, 75)}...</p>
            </div>
            <div class="pt-2 border-top mt-2">
              <a href="seasonal-detail.html#${sItem.id}" class="btn btn-outline-green btn-sm w-100">
                <i class="bi bi-eye me-1"></i>View Details
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <!-- Hero Seasonal Cover -->
      <div class="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
        <div class="detail-cover-content p-4 p-md-5">
          <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            ${seasonBadge}
            <span class="badge bg-dark bg-opacity-50 text-white px-3 py-2">
              <i class="bi bi-calendar-event me-1"></i>Peak: ${item.months}
            </span>
            ${item.status ? '<span class="badge bg-white text-dark px-3 py-2"><i class="bi bi-award-fill text-warning me-1"></i>' + item.status + '</span>' : ''}
          </div>
          <h1 class="display-5 fw-bold text-white mb-2">${item.name}</h1>
          <p class="lead text-white-50 mb-0">${item.description}</p>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <span class="badge-soft"><i class="bi bi-calendar-check me-1"></i>${item.season}</span>
          <span class="badge-soft"><i class="bi bi-clock-history me-1"></i>${item.months}</span>
          <span class="badge-soft"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${(item.markets ? item.markets.length : 0)} Seasonal Markets</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          ${bookmarkButtonHtml("produce", item.id)}
          <button type="button" class="btn btn-outline-secondary btn-sm share-trigger-btn"
                  data-share-title="${encodeURIComponent(item.name + ' - FreshFind Seasonal Guide')}"
                  data-share-text="${encodeURIComponent('Discover ' + item.name + ' during its peak season (' + item.months + ') on FreshFind!')}"
                  data-share-url="seasonal-detail.html#${item.id}">
            <i class="bi bi-share me-1"></i>Share Seasonal Pick
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Image & Flavor Profile -->
        <div class="col-lg-5 d-flex flex-column gap-4">
          <!-- Main Product Photo -->
          <div class="detail-card p-3 text-center overflow-hidden">
            <img src="${item.image}" alt="${item.alt}" class="w-100 rounded-3 shadow-sm object-fit-cover" style="max-height: 320px;" loading="lazy" onerror="this.src='assets/Images/hero.jpg'">
            <div class="d-flex justify-content-between align-items-center mt-3 px-2">
              <span class="small text-muted"><i class="bi bi-flower2 me-1"></i>Harvested in ${item.season}</span>
              <span class="badge bg-success-subtle text-success border border-success-subtle small">${item.months}</span>
            </div>
          </div>

          <!-- Seasonal Harvest Timeline -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-calendar3-range-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Seasonal Timeline</h3>
            </div>
            <ul class="list-unstyled mb-0 d-grid gap-3 small">
              <li class="d-flex align-items-start gap-3">
                <div class="text-warning fs-5"><i class="bi bi-sun-fill"></i></div>
                <div>
                  <strong class="text-dark">Best Season:</strong>
                  <div class="text-secondary">${item.season}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-success fs-5"><i class="bi bi-calendar2-week-fill"></i></div>
                <div>
                  <strong class="text-dark">Peak Months:</strong>
                  <div class="text-secondary">${item.months}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-info fs-5"><i class="bi bi-flag-fill"></i></div>
                <div>
                  <strong class="text-dark">Harvest Status:</strong>
                  <div class="text-secondary">${item.status || "Seasonal Harvest"}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-danger fs-5"><i class="bi bi-geo-alt-fill"></i></div>
                <div>
                  <strong class="text-dark">Growing Region:</strong>
                  <div class="text-secondary">Malir Valley, Mirpur Khas &amp; Sindh Agricultural Belts</div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Flavor & Tasting Notes -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-stars"></i></div>
              <h3 class="h5 mb-0 fw-bold">Flavor &amp; Tasting Profile</h3>
            </div>
            ${item.flavorNotes ? '<p class="small text-secondary mb-3"><i class="bi bi-quote me-1 text-warning fs-5"></i>' + item.flavorNotes + '</p>' : ''}
            <div class="mb-3">
              <strong class="small text-dark d-block mb-2">Tasting Notes:</strong>
              <div>${flavorTags}</div>
            </div>
            <div class="alert alert-light border small text-muted mb-0 py-2">
              <i class="bi bi-lightbulb-fill text-warning me-1"></i>
              Seasonal produce is harvested naturally ripe on the branch, resulting in higher sugar Brix levels and deeper aromatic oils.
            </div>
          </div>
        </div>

        <!-- Right Column: Details, Recipes & Markets -->
        <div class="col-lg-7 d-flex flex-column gap-4">
          <!-- Seasonal Overview Card -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-journal-check"></i></div>
              <h3 class="h5 mb-0 fw-bold">Seasonal Profile: ${item.name}</h3>
            </div>
            <p class="text-secondary mb-3">${item.description}</p>
            <p class="text-secondary small mb-0">
              Purchasing produce during <strong>${item.season} (${item.months})</strong> ensures optimal freshness, peak nutritional content, and economical market prices due to abundant local harvests. By choosing seasonal varieties, you directly support local growers across Sindh during their active harvest windows.
            </p>
          </div>

          <!-- Farmers Markets Stocking This Seasonal Pick -->
          <div class="detail-card p-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div class="d-flex align-items-center gap-2">
                <div class="product-icon"><i class="bi bi-shop"></i></div>
                <h3 class="h5 mb-0 fw-bold">Farmers Markets Stocking ${item.name}</h3>
              </div>
              <a href="seasonal.html" class="btn btn-outline-green btn-sm">Seasonal Guide</a>
            </div>
            <p class="small text-secondary mb-3">
              Check out these verified neighborhood markets to find authentic <strong>${item.name}</strong> from regional farmers:
            </p>
            <div class="row g-3">
              ${marketCardsHtml}
            </div>
          </div>

          <!-- Freshness, Storage & Kitchen Inspiration -->
          <div class="detail-card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-cup-hot-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Kitchen Inspiration &amp; Freshness Tips</h3>
            </div>
            <div class="d-grid gap-3 small text-secondary">
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Seasonal Ripeness:</strong> Look for firm texture and natural aroma near the stem. Avoid bruised surfaces or artificially polished peels.</div>
              </div>
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Preservation:</strong> Best enjoyed within 3 to 5 days of purchase from local farmers markets to preserve peak vitamins and aromatic juices.</div>
              </div>
              <div class="d-flex align-items-start gap-2">
                <i class="bi bi-check-circle-fill text-success fs-6 mt-1"></i>
                <div><strong>Culinary Pairings:</strong> Pairs wonderfully with regional spices, mint, freshly squeezed citrus, and homemade yogurt dressings.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- More Items in This Season -->
      <div class="detail-card p-4 p-md-5 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="badge-soft"><i class="bi bi-calendar3 text-warning me-1"></i>${item.season} Harvest</span>
            <h3 class="h4 fw-bold mt-2 mb-0">More ${item.season} Produce</h3>
          </div>
          <a href="seasonal.html" class="btn btn-outline-green btn-sm">View All Seasons</a>
        </div>
        <div class="row g-4">
          ${relatedHtml}
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <a href="seasonal.html" class="btn btn-outline-green"><i class="bi bi-arrow-left me-1"></i> Back to Seasonal Guide</a>
        <a href="#" class="btn btn-link text-success text-decoration-none">Back to top <i class="bi bi-arrow-up"></i></a>
      </div>
    `;
  }
});

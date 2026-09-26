document.addEventListener("DOMContentLoaded", function () {
  var directoryList = document.getElementById("market-list");
  var detailContainer = document.getElementById("market-detail");

  if (directoryList) initMarketDirectory(directoryList);
  if (detailContainer) initMarketDetail(detailContainer);
});

// Produce category icon & asset mapping helper
function getProduceMeta(itemName) {
  var name = (itemName || "").toLowerCase();
  if (name.indexOf("tomato") !== -1) {
    return { category: "Vegetables", icon: "bi-basket", img: "assets/Images/tomato.jpg", color: "text-danger" };
  }
  if (name.indexOf("potato") !== -1) {
    return { category: "Vegetables", icon: "bi-basket", img: "assets/Images/potato.jpg", color: "text-warning" };
  }
  if (name.indexOf("spinach") !== -1) {
    return { category: "Vegetables", icon: "bi-flower2", img: "assets/Images/spinach.jpg", color: "text-success" };
  }
  if (name.indexOf("chili") !== -1 || name.indexOf("chilies") !== -1) {
    return { category: "Vegetables", icon: "bi-fire", img: "assets/Images/chili.jpg", color: "text-danger" };
  }
  if (name.indexOf("mango") !== -1) {
    return { category: "Fruits", icon: "bi-apple", img: "assets/Images/mango.jpg", color: "text-warning" };
  }
  if (name.indexOf("banana") !== -1) {
    return { category: "Fruits", icon: "bi-apple", img: "assets/Images/banana.jpg", color: "text-warning" };
  }
  if (name.indexOf("mint") !== -1) {
    return { category: "Herbs", icon: "bi-flower1", img: "assets/Images/mint.jpg", color: "text-success" };
  }
  if (name.indexOf("yogurt") !== -1 || name.indexOf("dairy") !== -1) {
    return { category: "Dairy", icon: "bi-cup-hot", img: "assets/Images/yogurt.jpg", color: "text-primary" };
  }
  if (name.indexOf("bread") !== -1 || name.indexOf("bakery") !== -1) {
    return { category: "Bakery", icon: "bi-cake2", img: "assets/Images/potato.jpg", color: "text-warning" };
  }
  if (name.indexOf("egg") !== -1 || name.indexOf("poultry") !== -1 || name.indexOf("meat") !== -1) {
    return { category: "Meat", icon: "bi-shop", img: "assets/Images/yogurt.jpg", color: "text-danger" };
  }
  if (name.indexOf("spice") !== -1 || name.indexOf("masala") !== -1) {
    return { category: "Spices", icon: "bi-fire", img: "assets/Images/chili.jpg", color: "text-danger" };
  }
  if (name.indexOf("honey") !== -1 || name.indexOf("pantry") !== -1) {
    return { category: "Pantry", icon: "bi-flower3", img: "assets/Images/mango.jpg", color: "text-warning" };
  }
  return { category: "Produce", icon: "bi-basket", img: "", color: "text-success" };
}

function initMarketDirectory(listEl) {
  var countEl = document.getElementById("market-count");
  var searchAreaInput = document.getElementById("search-area");
  var locationSelect = document.getElementById("filter-location");
  var dayTypeSelect = document.getElementById("filter-day-type");
  var produceSelect = document.getElementById("filter-produce");
  var organicCheckbox = document.getElementById("filter-organic");
  var sortSelect = document.getElementById("sort-select");
  var resetBtn = document.getElementById("filter-reset");

  var allMarkets = [];
  var WEEKEND_DAYS = ["Saturday", "Sunday"];

  fetch("assets/markets.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load markets.json");
      return response.json();
    })
    .then(function (data) {
      allMarkets = data.markets;
      populateFilterOptions(allMarkets);
      applyQueryParams();
      render();
    })
    .catch(function (error) {
      console.error("Market loading error:", error);
      listEl.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load market data.</div></div>';
      if (countEl) countEl.textContent = "0 markets";
    });

  function populateFilterOptions(markets) {
    if (locationSelect) {
      var locations = Array.from(new Set(markets.map(function (m) { return m.location; }))).sort();
      locationSelect.innerHTML = '<option value="">All locations</option>' +
        locations.map(function (loc) { return '<option value="' + loc + '">' + loc + '</option>'; }).join("");
    }
    if (produceSelect) {
      var categories = Array.from(new Set(markets.reduce(function (acc, m) { return acc.concat(m.categoryList || []); }, []))).sort();
      produceSelect.innerHTML = '<option value="">All produce</option>' +
        categories.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join("");
    }
  }

  function applyQueryParams() {
    var params = new URLSearchParams(window.location.search);
    var area = params.get("area") || params.get("search");
    var day = params.get("day");
    var produce = params.get("produce");

    if (area) {
      if (searchAreaInput) searchAreaInput.value = area;
      if (locationSelect) {
        var match = Array.from(locationSelect.options).find(function (opt) {
          return opt.value.toLowerCase() === area.toLowerCase();
        });
        if (match) locationSelect.value = match.value;
      }
    }
    if (day && dayTypeSelect) {
      dayTypeSelect.value = WEEKEND_DAYS.indexOf(day) !== -1 ? "weekend" : "weekday";
    }
    if (produce && produceSelect) {
      var pMatch = Array.from(produceSelect.options).find(function (opt) {
        return opt.value.toLowerCase() === produce.toLowerCase();
      });
      if (pMatch) produceSelect.value = pMatch.value;
    }
  }

  function getFiltered() {
    var searchQuery = (searchAreaInput ? searchAreaInput.value : "").trim().toLowerCase();
    var locationValue = locationSelect ? locationSelect.value : "";
    var dayType = dayTypeSelect ? dayTypeSelect.value : "";
    var produce = produceSelect ? produceSelect.value : "";
    var organicOnly = organicCheckbox ? organicCheckbox.checked : false;

    return allMarkets.filter(function (m) {
      // Feature 7: Case-insensitive partial matching on Area / Location or Market Name
      if (searchQuery) {
        var locMatches = (m.location || "").toLowerCase().indexOf(searchQuery) !== -1;
        var nameMatches = (m.name || "").toLowerCase().indexOf(searchQuery) !== -1;
        var addressMatches = (m.address || "").toLowerCase().indexOf(searchQuery) !== -1;
        if (!locMatches && !nameMatches && !addressMatches) return false;
      }

      if (locationValue && m.location !== locationValue) return false;
      if (produce && (m.categoryList || []).indexOf(produce) === -1) return false;
      if (organicOnly && !m.organic) return false;
      if (dayType) {
        var isWeekend = (m.daysList || []).some(function (d) { return WEEKEND_DAYS.indexOf(d) !== -1; });
        var isWeekday = (m.daysList || []).some(function (d) { return WEEKEND_DAYS.indexOf(d) === -1; });
        if (dayType === "weekend" && !isWeekend) return false;
        if (dayType === "weekday" && !isWeekday) return false;
      }
      return true;
    });
  }

  function getSorted(markets) {
    var sortBy = sortSelect ? sortSelect.value : "default";
    var sorted = markets.slice();

    switch (sortBy) {
      case "name-asc":
        sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
      case "name-desc":
        sorted.sort(function (a, b) { return b.name.localeCompare(a.name); });
        break;
      case "location":
        sorted.sort(function (a, b) { return a.location.localeCompare(b.location); });
        break;
      case "rating-desc":
        sorted.sort(function (a, b) { return b.rating - a.rating; });
        break;
      case "rating-asc":
        sorted.sort(function (a, b) { return a.rating - b.rating; });
        break;
      default:
        break;
    }
    return sorted;
  }

  function render() {
    var results = getSorted(getFiltered());

    if (countEl) countEl.textContent = results.length + (results.length === 1 ? " market" : " markets");

    if (!results.length) {
      var currentSearch = searchAreaInput ? searchAreaInput.value.trim() : "";
      listEl.innerHTML = '<div class="col-12"><div class="empty-state p-5">' +
        '<div class="fs-1 text-muted mb-2"><i class="bi bi-geo-alt-fill"></i></div>' +
        '<h4 class="h5 fw-bold">No markets found' + (currentSearch ? ' in "' + escapeHtml(currentSearch) + '"' : '') + '</h4>' +
        '<p class="text-secondary mb-3">Try adjusting your area search or resetting your filters to see more results.</p>' +
        '<button type="button" class="btn btn-outline-green btn-sm" id="emptyResetBtn"><i class="bi bi-arrow-counterclockwise me-1"></i>Reset All Filters</button>' +
        '</div></div>';

      var emptyResetBtn = document.getElementById("emptyResetBtn");
      if (emptyResetBtn && resetBtn) {
        emptyResetBtn.addEventListener("click", function () { resetBtn.click(); });
      }
      return;
    }

    listEl.innerHTML = results.map(marketCardHtml).join("");
  }

  // Live real-time Search by Area
  if (searchAreaInput) {
    searchAreaInput.addEventListener("input", render);
  }

  [locationSelect, dayTypeSelect, produceSelect, sortSelect].forEach(function (el) {
    if (el) el.addEventListener("change", render);
  });
  if (organicCheckbox) organicCheckbox.addEventListener("change", render);

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (searchAreaInput) searchAreaInput.value = "";
      if (locationSelect) locationSelect.value = "";
      if (dayTypeSelect) dayTypeSelect.value = "";
      if (produceSelect) produceSelect.value = "";
      if (organicCheckbox) organicCheckbox.checked = false;
      if (sortSelect) sortSelect.value = "default";
      render();
    });
  }

  document.addEventListener("bookmarks:changed", function (e) {
    if (e.detail.type === "markets") render();
  });
}

function initMarketDetail(container) {
  var allMarkets = [];

  fetch("assets/markets.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      allMarkets = data.markets;
      renderDetail();
    })
    .catch(function (error) {
      console.error("Market detail loading error:", error);
      container.innerHTML = '<div class="alert alert-danger">Unable to load market data.</div>';
    });

  window.addEventListener("hashchange", renderDetail);

  function renderDetail() {
    if (!allMarkets.length) return;

    var id = location.hash.replace("#", "");
    var market = allMarkets.find(function (m) { return m.id === id; }) || allMarkets[0];

    // Update document title and dynamic breadcrumb
    document.title = market.name + " | FreshFind";
    var breadcrumbTitle = document.getElementById("breadcrumb-market-title");
    if (breadcrumbTitle) breadcrumbTitle.textContent = market.name;

    var weekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var openDays = market.daysList || [];

    var scheduleRows = weekOrder.map(function (day) {
      var isOpen = openDays.indexOf(day) !== -1;
      return '<tr' + (isOpen ? ' class="today-row table-success fw-semibold"' : '') + '><td>' +
        (isOpen ? '<i class="bi bi-check-circle-fill text-success me-2"></i>' : '<i class="bi bi-dash-circle text-muted me-2"></i>') +
        day + '</td><td>' + (isOpen ? market.hours : '<span class="text-muted">Closed</span>') + '</td></tr>';
    }).join("");

    // Feature 9: Icons and cards in "Typically Produce" Section
    var produceChips = (market.produce || []).map(function (item) {
      var meta = getProduceMeta(item);
      var thumbHtml = meta.img
        ? '<img src="' + meta.img + '" alt="' + item + '" class="mini-produce-img" onerror="this.style.display=\'none\'">'
        : '<div class="mini-produce-icon-box ' + meta.color + '"><i class="bi ' + meta.icon + '"></i></div>';

      return (
        '<div class="mini-produce-card p-2 px-3 d-flex align-items-center gap-2 border rounded-3 bg-white shadow-sm">' +
        thumbHtml +
        '<div>' +
        '<div class="fw-bold small">' + item + '</div>' +
        '<span class="badge bg-light text-secondary border small" style="font-size:0.7rem;">' +
        '<i class="bi ' + meta.icon + ' me-1"></i>' + meta.category +
        '</span>' +
        '</div>' +
        '</div>'
      );
    }).join("");

    var mapQuery = encodeURIComponent(market.name + ", " + market.location + ", Karachi, Sindh");

    // Contact placeholder values clearly identifiable
    var addressDisplay = market.address || (market.location + ", Karachi, Sindh (Demo Location)");
    var phoneDisplay = market.phone || "+92 (21) 111-FRESH (Demo)";
    var emailDisplay = market.email || "market@freshfind.example (Demo)";
    var websiteDisplay = market.website || "https://freshfind.example (Demo)";
    var socialFb = market.social && market.social.facebook ? market.social.facebook : "FreshFindDemo";
    var socialIg = market.social && market.social.instagram ? market.social.instagram : "@freshfind_demo";

    container.innerHTML = `
      <div class="detail-cover mb-4 rounded-4 position-relative overflow-hidden">
        <div class="detail-cover-content p-4 p-md-5">
          <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span class="badge bg-white text-success fw-bold px-3 py-2"><i class="bi bi-geo-alt-fill me-1"></i>${market.location}</span>
            <span class="badge bg-dark bg-opacity-50 text-white px-3 py-2"><i class="bi bi-shop me-1"></i>${market.type || "Outdoor"} Market</span>
            ${market.organic ? '<span class="badge bg-success text-white px-3 py-2"><i class="bi bi-flower1 me-1"></i>Organic Available</span>' : ''}
          </div>
          <h1 class="display-5 fw-bold text-white mb-2">${market.name}</h1>
          <p class="lead text-white-50 mb-0">${market.description}</p>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm border mb-4">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <span class="badge-soft"><i class="bi bi-star-fill" style="color:var(--gold-500)"></i> ${(market.rating ? market.rating.toFixed(1) : "4.5")} rating</span>
          <span class="badge-soft"><i class="bi bi-calendar-check me-1"></i>${market.days}</span>
          <span class="badge-soft"><i class="bi bi-clock me-1"></i>${market.hours}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          ${bookmarkButtonHtml("markets", market.id)}
          <button type="button" class="btn btn-outline-secondary btn-sm share-trigger-btn"
                  data-share-title="${encodeURIComponent(market.name)}"
                  data-share-text="${encodeURIComponent('Discover ' + market.name + ' in ' + market.location + ' on FreshFind!')}"
                  data-share-url="market-detail.html#${market.id}">
            <i class="bi bi-share me-1"></i>Share Market
          </button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <!-- Feature 2: Complete Contact Information Card -->
        <div class="col-lg-5">
          <div class="detail-card p-4 h-100 shadow-sm border">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="product-icon"><i class="bi bi-telephone-inbound-fill"></i></div>
              <h3 class="h5 mb-0 fw-bold">Market Contact Information</h3>
            </div>
            <p class="text-secondary small mb-3">Verified contact and location details for market visitors:</p>

            <ul class="list-unstyled mb-4 d-grid gap-3">
              <li class="d-flex align-items-start gap-3">
                <div class="text-danger fs-5"><i class="bi bi-geo-alt-fill"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Location &amp; Address</div>
                  <div class="text-secondary small">${addressDisplay}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-success fs-5"><i class="bi bi-telephone-fill"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Phone Number</div>
                  <div class="small"><a href="tel:${phoneDisplay.replace(/[^0-9+]/g, '')}" class="text-decoration-none text-success fw-semibold">${phoneDisplay}</a></div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-primary fs-5"><i class="bi bi-envelope-fill"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Email Address</div>
                  <div class="small"><a href="mailto:${emailDisplay}" class="text-decoration-none text-primary">${emailDisplay}</a></div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-warning fs-5"><i class="bi bi-clock-fill"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Operating Hours</div>
                  <div class="text-secondary small">${market.hours}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-info fs-5"><i class="bi bi-calendar3"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Available Days</div>
                  <div class="text-secondary small">${market.days}</div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-secondary fs-5"><i class="bi bi-globe2"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Website</div>
                  <div class="small"><a href="${websiteDisplay}" target="_blank" rel="noopener" class="text-decoration-none text-secondary">${websiteDisplay}</a></div>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3">
                <div class="text-danger fs-5"><i class="bi bi-share-fill"></i></div>
                <div>
                  <div class="small fw-bold text-dark">Social Media</div>
                  <div class="small text-secondary d-flex gap-3 mt-1">
                    <span class="text-primary"><i class="bi bi-facebook me-1"></i>${socialFb}</span>
                    <span class="text-danger"><i class="bi bi-instagram me-1"></i>${socialIg}</span>
                  </div>
                </div>
              </li>
            </ul>

            <div class="alert alert-light border small text-muted mb-0 py-2">
              <i class="bi bi-info-circle me-1"></i>Demo/placeholder contact fields for project demonstration.
            </div>
          </div>
        </div>

        <!-- Weekly Schedule Table -->
        <div class="col-lg-7">
          <div class="detail-card p-4 h-100 shadow-sm border d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="product-icon"><i class="bi bi-calendar-week-fill"></i></div>
                <h3 class="h5 mb-0 fw-bold">Weekly Operating Schedule</h3>
              </div>
              <p class="text-secondary small mb-3">Check which days stalls are active and planning hours:</p>
              <div class="table-responsive">
                <table class="table table-hover align-middle schedule-table mb-0">
                  <thead class="table-light">
                    <tr><th>Day of the Week</th><th>Opening Hours</th></tr>
                  </thead>
                  <tbody>
                    ${scheduleRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature 9: Typically Produce Section with Category Icons & Assets -->
      <div class="detail-card p-4 p-md-5 mb-4 shadow-sm border">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <span class="badge-soft mb-2"><i class="bi bi-basket2 me-1"></i>Seasonal Stalls</span>
            <h3 class="h4 fw-bold mb-1">Typically Available Produce</h3>
            <p class="text-secondary small mb-0">Directly supplied by local growers and verified sellers at this market:</p>
          </div>
          <a href="produce.html" class="btn btn-outline-green btn-sm"><i class="bi bi-journal-bookmark me-1"></i>View Full Produce Guide</a>
        </div>
        <div class="d-flex flex-wrap gap-3 pt-2">
          ${produceChips || '<p class="text-secondary mb-0">Produce catalog updating soon.</p>'}
        </div>
      </div>

      <!-- Location Map Section -->
      <div class="detail-card p-4 mb-4 shadow-sm border">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="product-icon"><i class="bi bi-map-fill"></i></div>
          <h3 class="h5 mb-0 fw-bold">Location &amp; Area Map</h3>
        </div>
        <p class="text-secondary small mb-2">${addressDisplay}</p>
        <iframe class="map-frame rounded-3 w-100 mt-2" height="320" style="border:0;" loading="lazy" src="https://www.google.com/maps?q=${mapQuery}&output=embed" title="Market Map"></iframe>
      </div>

      <div class="d-flex justify-content-between align-items-center pt-2 mb-4">
        <a href="markets.html" class="btn btn-outline-green"><i class="bi bi-arrow-left me-1"></i> Back to Market Directory</a>
        <a href="#" class="btn btn-link text-success text-decoration-none">Back to top <i class="bi bi-arrow-up"></i></a>
      </div>
    `;
  }
}

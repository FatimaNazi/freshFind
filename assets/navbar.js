// FreshFind Navbar, Subnav Meta & Global Search Component
var nav = document.getElementById("navbar");

var currentPage = location.pathname.split("/").pop() || "index.html";

function navLink(href, label) {
  var isActive = currentPage === href ||
    (currentPage === "" && href === "index.html") ||
    (currentPage === "market-detail.html" && href === "markets.html") ||
    (currentPage === "produce-detail.html" && href === "produce.html") ||
    (currentPage === "seasonal-detail.html" && href === "seasonal.html");
  return '<li class="nav-item"><a class="nav-link' + (isActive ? " active" : "") +
    '" href="' + href + '"' + (isActive ? ' aria-current="page"' : "") + '>' + label + '</a></li>';
}

if (nav) {
  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container py-2">
        <div class="brand-group">
          <a href="index.html"><img class="navbar-logo" src="assets/Images/logo.png" alt="FreshFind logo"></a>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            ${navLink("index.html", "Home")}
            ${navLink("about.html", "About")}
            ${navLink("markets.html", "Markets")}
            ${navLink("produce.html", "Produce Guide")}
            ${navLink("seasonal.html", "Seasonal Guide")}
            ${navLink("bookmarks.html", "Bookmarks")}
            ${navLink("feedback.html", "Feedback")}
            ${navLink("contact.html", "Contact")}
          </ul>

          <!-- Global Project Search Bar (Feature requested) -->
          <div class="navbar-search-wrapper position-relative ms-lg-2 my-2 my-lg-0">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white border-end-0 text-success pe-1">
                <i class="bi bi-search"></i>
              </span>
              <input type="search" class="form-control border-start-0 border-end-0 ps-1" id="globalNavSearch" placeholder="Search FreshFind..." aria-label="Search markets and produce across FreshFind" autocomplete="off">
              <button class="btn btn-outline-secondary border-start-0 bg-white text-muted px-2 py-0 d-none d-xl-inline-block search-kbd-badge" type="button" id="globalSearchKbdBtn" title="Press / or Ctrl+K to search">
                <kbd class="bg-light text-muted border px-1" style="font-size:0.65rem;">/</kbd>
              </button>
            </div>

            <!-- Global Live Search Results Dropdown -->
            <div class="global-search-dropdown shadow-lg rounded-4 border bg-white" id="globalSearchResults" style="display: none;">
            </div>
          </div>

          <div class="navbar-actions ms-lg-2">
            <button type="button" class="btn btn-green btn-sm" data-bs-toggle="modal" data-bs-target="#signupModal"><i class="bi bi-person-plus me-1"></i>Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

// Global Search System (Markets, Produce Guide, Seasonal Guide, Project Pages)
function setupGlobalSearch() {
  var searchInput = document.getElementById("globalNavSearch");
  var searchResults = document.getElementById("globalSearchResults");
  if (!searchInput || !searchResults) return;

  var indexData = {
    markets: [],
    produce: [],
    seasonal: [],
    pages: [
      { name: "Home", url: "index.html", desc: "FreshFind homepage with nearby market finder and highlights.", icon: "bi-house-door-fill", category: "Page" },
      { name: "About Us & Vision", url: "about.html", desc: "Vision, mission, core values, and project team simulation.", icon: "bi-info-circle-fill", category: "Page" },
      { name: "Market Directory", url: "markets.html", desc: "Browse, search, and filter all farmers markets across Karachi.", icon: "bi-shop", category: "Directory" },
      { name: "Produce Guide", url: "produce.html", desc: "Farm-to-table catalog of vegetables, fruits, herbs and nutrition.", icon: "bi-basket2-fill", category: "Guide" },
      { name: "Seasonal Guide", url: "seasonal.html", desc: "Discover crops by season (Summer, Winter, Spring, Autumn).", icon: "bi-sun-fill", category: "Guide" },
      { name: "Find Nearest Market", url: "find-market.html", desc: "Locate active markets closest to your GPS coordinates.", icon: "bi-compass-fill", category: "Tool" },
      { name: "Market Highlights", url: "highlights.html", desc: "Top rated weekend bazzars and popular community stalls.", icon: "bi-stars", category: "Page" },
      { name: "Saved Bookmarks", url: "bookmarks.html", desc: "Manage saved markets, produce items, and personal notes.", icon: "bi-bookmark-star-fill", category: "Tool" },
      { name: "Feedback & Ratings", url: "feedback.html", desc: "Share suggestions and review market experiences.", icon: "bi-chat-heart-fill", category: "Page" },
      { name: "Contact Us & Geolocation Hub", url: "contact.html", desc: "Karachi support hub, contact form, and interactive Leaflet map.", icon: "bi-geo-alt-fill", category: "Page" },
      { name: "How FreshFind Works", url: "how-it-works.html", desc: "Quick walkthrough of finding markets and seasonal crops.", icon: "bi-question-circle-fill", category: "Guide" }
    ],
    loaded: false
  };

  function loadSearchData(cb) {
    if (indexData.loaded) {
      if (cb) cb();
      return;
    }
    Promise.all([
      fetch("assets/markets.json").then(function (r) { return r.json(); }).catch(function () { return { markets: [] }; }),
      fetch("assets/products.json").then(function (r) { return r.json(); }).catch(function () { return { products: [] }; }),
      fetch("assets/seasonal.json").then(function (r) { return r.json(); }).catch(function () { return { seasonalProduce: [] }; })
    ]).then(function (results) {
      indexData.markets = results[0].markets || [];
      indexData.produce = results[1].products || [];
      indexData.seasonal = results[2].seasonalProduce || [];
      indexData.loaded = true;
      if (cb) cb();
    });
  }

  // Pre-load data in background
  loadSearchData();

  function highlightMatch(text, query) {
    if (!text || !query) return text || "";
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var regex = new RegExp("(" + escaped + ")", "gi");
    return text.replace(regex, '<strong class="text-success">$1</strong>');
  }

  function renderDefaultSuggestions() {
    searchResults.innerHTML = `
      <div class="px-3 pt-2 pb-2 border-bottom">
        <div class="small fw-bold text-muted mb-2"><i class="bi bi-fire text-danger me-1"></i>Popular Searches</div>
        <div class="d-flex flex-wrap gap-1">
          <span class="badge bg-light text-dark border global-search-tag" data-search="Clifton">Clifton</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Mango">Sindhri Mango</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Tomato">Tomato</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Organic">Organic</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Winter">Winter Season</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Spinach">Spinach</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Weekend">Weekend</span>
          <span class="badge bg-light text-dark border global-search-tag" data-search="Karachi">Karachi Hub</span>
        </div>
      </div>
      <div class="px-3 py-2 bg-light border-bottom small text-muted d-flex justify-content-between align-items-center">
        <span><i class="bi bi-grid-3x3-gap-fill text-success me-1"></i>Quick Jump</span>
        <span class="text-secondary" style="font-size:0.75rem;">Global Project Index</span>
      </div>
      <div class="py-1">
        <a href="markets.html" class="global-search-item">
          <div class="global-search-icon bg-success-subtle text-success"><i class="bi bi-shop"></i></div>
          <div class="flex-grow-1">
            <div class="fw-semibold small">Browse All Markets</div>
            <div class="text-muted" style="font-size:0.75rem;">View verified farmers markets across Karachi</div>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </a>
        <a href="seasonal.html" class="global-search-item">
          <div class="global-search-icon bg-warning-subtle text-dark"><i class="bi bi-calendar3"></i></div>
          <div class="flex-grow-1">
            <div class="fw-semibold small">Seasonal Harvest Calendar</div>
            <div class="text-muted" style="font-size:0.75rem;">Summer, Winter, Spring & Autumn peak picks</div>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </a>
        <a href="produce.html" class="global-search-item">
          <div class="global-search-icon bg-primary-subtle text-primary"><i class="bi bi-basket2"></i></div>
          <div class="flex-grow-1">
            <div class="fw-semibold small">Produce Nutrition Guide</div>
            <div class="text-muted" style="font-size:0.75rem;">Vegetables, fruits, herbs and farm sources</div>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </a>
        <a href="contact.html#office-location-map" class="global-search-item">
          <div class="global-search-icon bg-danger-subtle text-danger"><i class="bi bi-geo-alt-fill"></i></div>
          <div class="flex-grow-1">
            <div class="fw-semibold small">Live Geolocation Map</div>
            <div class="text-muted" style="font-size:0.75rem;">Detect your GPS coordinates and nearest market</div>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </a>
      </div>
    `;

    searchResults.querySelectorAll(".global-search-tag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        searchInput.value = this.getAttribute("data-search") || "";
        performSearch(searchInput.value);
      });
    });

    searchResults.style.display = "block";
  }

  function performSearch(query) {
    var q = (query || "").trim().toLowerCase();
    if (!q) {
      renderDefaultSuggestions();
      return;
    }

    // Match Markets
    var matchedMarkets = indexData.markets.filter(function (m) {
      var nameMatch = (m.name || "").toLowerCase().indexOf(q) !== -1;
      var locMatch = (m.location || "").toLowerCase().indexOf(q) !== -1;
      var descMatch = (m.description || "").toLowerCase().indexOf(q) !== -1;
      var prodMatch = (m.produce || []).some(function (p) { return p.toLowerCase().indexOf(q) !== -1; });
      var daysMatch = (m.days || "").toLowerCase().indexOf(q) !== -1;
      return nameMatch || locMatch || descMatch || prodMatch || daysMatch;
    }).slice(0, 4);

    // Match Produce Guide Items
    var matchedProduce = indexData.produce.filter(function (p) {
      var nameMatch = (p.name || "").toLowerCase().indexOf(q) !== -1;
      var catMatch = (p.category || "").toLowerCase().indexOf(q) !== -1;
      var seasonMatch = (p.season || "").toLowerCase().indexOf(q) !== -1;
      var descMatch = (p.description || "").toLowerCase().indexOf(q) !== -1;
      return nameMatch || catMatch || seasonMatch || descMatch;
    }).slice(0, 4);

    // Match Seasonal Items
    var matchedSeasonal = indexData.seasonal.filter(function (s) {
      var nameMatch = (s.name || "").toLowerCase().indexOf(q) !== -1;
      var seasonMatch = (s.season || "").toLowerCase().indexOf(q) !== -1;
      var monthsMatch = (s.months || "").toLowerCase().indexOf(q) !== -1;
      var notesMatch = (s.flavorNotes || "").toLowerCase().indexOf(q) !== -1;
      var descMatch = (s.description || "").toLowerCase().indexOf(q) !== -1;
      return nameMatch || seasonMatch || monthsMatch || notesMatch || descMatch;
    }).slice(0, 4);

    // Match Project Pages
    var matchedPages = indexData.pages.filter(function (pg) {
      var nameMatch = pg.name.toLowerCase().indexOf(q) !== -1;
      var descMatch = pg.desc.toLowerCase().indexOf(q) !== -1;
      var catMatch = pg.category.toLowerCase().indexOf(q) !== -1;
      return nameMatch || descMatch || catMatch;
    }).slice(0, 3);

    var totalMatches = matchedMarkets.length + matchedProduce.length + matchedSeasonal.length + matchedPages.length;

    if (totalMatches === 0) {
      searchResults.innerHTML = `
        <div class="p-4 text-center">
          <div class="display-6 text-muted mb-2"><i class="bi bi-search"></i></div>
          <h6 class="fw-bold mb-1">No direct matches for "${query}"</h6>
          <p class="small text-secondary mb-3">Try searching with a broader term such as a neighborhood, vegetable, fruit, or season.</p>
          <div class="d-flex justify-content-center gap-2">
            <a href="markets.html?search=${encodeURIComponent(query)}" class="btn btn-outline-green btn-sm">
              Search in Markets Directory
            </a>
            <a href="produce.html" class="btn btn-outline-secondary btn-sm">
              View Produce Guide
            </a>
          </div>
        </div>
      `;
      searchResults.style.display = "block";
      return;
    }

    var html = `
      <div class="px-3 py-2 bg-light border-bottom d-flex justify-content-between align-items-center small">
        <span class="fw-bold text-success"><i class="bi bi-check2-circle me-1"></i>Found ${totalMatches} results</span>
        <span class="text-muted" style="font-size:0.75rem;">Press Enter to open top result</span>
      </div>
    `;

    // 1. Markets Group
    if (matchedMarkets.length > 0) {
      html += `<div class="global-search-header"><i class="bi bi-shop text-success me-1"></i>Farmers Markets (${matchedMarkets.length})</div>`;
      matchedMarkets.forEach(function (m) {
        html += `
          <a href="market-detail.html#${m.id}" class="global-search-item">
            <div class="global-search-icon bg-success-subtle text-success"><i class="bi bi-shop"></i></div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between align-items-center">
                <div class="fw-bold small text-truncate">${highlightMatch(m.name, query)}</div>
                <span class="badge bg-light text-secondary border small ms-2">${m.location}</span>
              </div>
              <div class="text-muted text-truncate" style="font-size:0.75rem;">
                <i class="bi bi-calendar3 me-1"></i>${m.days} &bull; <i class="bi bi-star-fill text-warning me-1"></i>${m.rating || "4.5"}
              </div>
            </div>
          </a>
        `;
      });
    }

    // 2. Produce Guide Group
    if (matchedProduce.length > 0) {
      html += `<div class="global-search-header border-top mt-1"><i class="bi bi-basket2 text-primary me-1"></i>Produce Guide (${matchedProduce.length})</div>`;
      matchedProduce.forEach(function (p) {
        var thumbHtml = p.image
          ? `<img src="${p.image}" alt="${p.name}" class="w-100 h-100 object-fit-cover rounded-2" onerror="this.src='assets/Images/hero.jpg'">`
          : '<i class="bi bi-basket"></i>';

        html += `
          <a href="produce-detail.html#${p.id}" class="global-search-item">
            <div class="global-search-icon bg-light overflow-hidden">${thumbHtml}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between align-items-center">
                <div class="fw-bold small text-truncate">${highlightMatch(p.name, query)}</div>
                <span class="badge bg-success-subtle text-success border border-success-subtle small ms-2">${p.category}</span>
              </div>
              <div class="text-muted text-truncate" style="font-size:0.75rem;">
                <i class="bi bi-sun text-warning me-1"></i>Season: ${p.season} &bull; ${p.description.slice(0, 45)}...
              </div>
            </div>
          </a>
        `;
      });
    }

    // 3. Seasonal Picks Group
    if (matchedSeasonal.length > 0) {
      html += `<div class="global-search-header border-top mt-1"><i class="bi bi-sun text-warning me-1"></i>Seasonal Guide (${matchedSeasonal.length})</div>`;
      matchedSeasonal.forEach(function (s) {
        var thumbHtml = s.image
          ? `<img src="${s.image}" alt="${s.name}" class="w-100 h-100 object-fit-cover rounded-2" onerror="this.src='assets/Images/hero.jpg'">`
          : '<i class="bi bi-sun"></i>';

        html += `
          <a href="seasonal-detail.html#${s.id}" class="global-search-item">
            <div class="global-search-icon bg-light overflow-hidden">${thumbHtml}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between align-items-center">
                <div class="fw-bold small text-truncate">${highlightMatch(s.name, query)}</div>
                <span class="badge bg-warning-subtle text-dark border border-warning-subtle small ms-2">${s.season}</span>
              </div>
              <div class="text-muted text-truncate" style="font-size:0.75rem;">
                <i class="bi bi-calendar-check text-success me-1"></i>Peak: ${s.months} &bull; ${s.flavorNotes || "Fresh local harvest"}
              </div>
            </div>
          </a>
        `;
      });
    }

    // 4. Project Pages Group
    if (matchedPages.length > 0) {
      html += `<div class="global-search-header border-top mt-1"><i class="bi bi-compass text-secondary me-1"></i>Project Pages &amp; Tools (${matchedPages.length})</div>`;
      matchedPages.forEach(function (pg) {
        html += `
          <a href="${pg.url}" class="global-search-item">
            <div class="global-search-icon bg-secondary-subtle text-secondary"><i class="bi ${pg.icon}"></i></div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between align-items-center">
                <div class="fw-bold small text-truncate">${highlightMatch(pg.name, query)}</div>
                <span class="badge bg-light text-muted border small ms-2">${pg.category}</span>
              </div>
              <div class="text-muted text-truncate" style="font-size:0.75rem;">${pg.desc}</div>
            </div>
          </a>
        `;
      });
    }

    searchResults.innerHTML = html;
    searchResults.style.display = "block";
  }

  // Event Listeners for Search Input
  searchInput.addEventListener("focus", function () {
    loadSearchData(function () {
      if (!searchInput.value.trim()) {
        renderDefaultSuggestions();
      } else {
        performSearch(searchInput.value);
      }
    });
  });

  searchInput.addEventListener("input", function () {
    loadSearchData(function () {
      performSearch(searchInput.value);
    });
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      var firstLink = searchResults.querySelector(".global-search-item");
      if (firstLink && firstLink.getAttribute("href")) {
        window.location.href = firstLink.getAttribute("href");
      } else if (searchInput.value.trim()) {
        window.location.href = "markets.html?search=" + encodeURIComponent(searchInput.value.trim());
      }
    } else if (e.key === "Escape") {
      searchResults.style.display = "none";
      searchInput.blur();
    }
  });

  var kbdBtn = document.getElementById("globalSearchKbdBtn");
  if (kbdBtn) {
    kbdBtn.addEventListener("click", function () {
      searchInput.focus();
    });
  }

  // Global Keyboard Shortcuts (/ or Ctrl+K / Cmd+K)
  document.addEventListener("keydown", function (e) {
    var isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable;
    if (!isInput && (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"))) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  // Click outside listener to close dropdown
  document.addEventListener("click", function (e) {
    var wrapper = document.querySelector(".navbar-search-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      searchResults.style.display = "none";
    }
  });
}

// Setup right-side visitor count & live timer in the sub-header bar (breadcrumb row)
function setupSubnavMeta() {
  var breadcrumbNav = document.querySelector(".ff-breadcrumb-nav");
  if (!breadcrumbNav) return;
  var container = breadcrumbNav.querySelector(".container");
  if (!container) return;

  container.classList.add("d-flex", "justify-content-between", "align-items-center", "flex-wrap");

  var existingMeta = container.querySelector(".ff-subnav-meta");
  if (!existingMeta) {
    var metaDiv = document.createElement("div");
    metaDiv.className = "ff-subnav-meta d-flex align-items-center gap-3 py-1 ms-auto";
    metaDiv.innerHTML = `
      <span class="subnav-visitor-badge" title="Total Website Visits">
        <i class="bi bi-people-fill text-success me-1"></i>
        <span class="visitor-count-value">0</span> visits
      </span>
      <span class="subnav-clock small" title="Current Time & Date">
        <i class="bi bi-clock-fill text-warning me-1"></i>
        <span id="subnavClockText">--:--:--</span>
      </span>
    `;
    container.appendChild(metaDiv);
  }
}

function updateVisitorCount() {
  var STORAGE_KEY = "ff_visitor_count";
  var count = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(count)) count = 1250;
  count += 1;
  localStorage.setItem(STORAGE_KEY, count);

  var targets = document.querySelectorAll("#visitorCount, .visitor-count-value");
  targets.forEach(function (el) {
    el.textContent = count.toLocaleString();
  });
}

function setupSubnavClock() {
  function updateClock() {
    var target = document.getElementById("subnavClockText");
    if (!target) return;
    var now = new Date();
    var dateText = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    var timeText = now.toLocaleTimeString();
    target.innerHTML = "<strong>" + timeText + "</strong> &middot; " + dateText;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    setupSubnavMeta();
    updateVisitorCount();
    setupSubnavClock();
    setupGlobalSearch();
  });
} else {
  setupSubnavMeta();
  updateVisitorCount();
  setupSubnavClock();
  setupGlobalSearch();
}

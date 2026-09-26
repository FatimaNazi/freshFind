// Seasonal Guide Logic - Loads assets/seasonal.json and provides season-wise dynamic filtering
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("seasonalContainer");
  var filterContainer = document.getElementById("seasonFilterContainer");
  var countEl = document.getElementById("seasonalCount");
  if (!container) return;

  var allSeasonalItems = [];
  var activeSeason = "all";

  function getSeasonBadge(season) {
    switch (season) {
      case "Summer":
        return '<span class="badge bg-warning text-dark"><i class="bi bi-sun-fill me-1"></i>Summer</span>';
      case "Winter":
        return '<span class="badge bg-info text-white"><i class="bi bi-snow me-1"></i>Winter</span>';
      case "Spring":
        return '<span class="badge bg-success text-white"><i class="bi bi-flower1 me-1"></i>Spring</span>';
      case "Autumn":
        return '<span class="badge bg-danger text-white"><i class="bi bi-tree-fill me-1"></i>Autumn</span>';
      default:
        return '<span class="badge bg-primary text-white"><i class="bi bi-arrow-repeat me-1"></i>Year-Round</span>';
    }
  }

  function seasonalCardHtml(item) {
    var marketList = (item.markets || []).join(", ");
    var seasonBadge = getSeasonBadge(item.season);

    return (
      '<div class="col-md-6 col-xl-4" data-season-card="' + item.id + '" data-season="' + item.season + '">' +
      '<article class="product-card h-100 position-relative shadow-sm border rounded-4 overflow-hidden">' +
      bookmarkButtonHtml("produce", item.id, "position-absolute top-0 end-0 m-3") +
      '<div class="produce-thumb">' +
      '<img src="' + item.image + '" alt="' + item.alt + '" loading="lazy" onerror="this.style.display=\'none\'">' +
      '</div>' +
      '<div class="p-4 d-flex flex-column justify-content-between">' +
      '<div>' +
      '<div class="d-flex justify-content-between align-items-center gap-2 mb-2 flex-wrap">' +
      '<div>' + seasonBadge + '</div>' +
      '<span class="badge-soft">' + item.category + '</span>' +
      '</div>' +
      '<h3 class="h5 fw-bold mb-1">' + item.name + '</h3>' +
      '<div class="small text-success fw-semibold mb-2">' +
      '<i class="bi bi-calendar2-week me-1"></i>Best Months: ' + item.months +
      (item.status ? ' &bull; <span class="badge bg-light text-secondary border">' + item.status + '</span>' : '') +
      '</div>' +
      '<p class="text-secondary small mb-2">' + item.description + '</p>' +
      (item.flavorNotes ? '<div class="alert alert-light border small py-1 px-2 mb-2 text-muted"><i class="bi bi-magic me-1 text-warning"></i><strong>Flavor:</strong> ' + item.flavorNotes + '</div>' : '') +
      '<p class="small text-secondary mb-3"><strong><i class="bi bi-shop me-1"></i>Found at:</strong> ' + marketList + '</p>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center gap-2 pt-2 border-top mt-2">' +
      '<a class="btn btn-outline-green btn-sm" href="seasonal-detail.html#' + item.id + '"><i class="bi bi-eye me-1"></i>View Details</a>' +
      '<div class="d-flex align-items-center gap-2">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary share-trigger-btn" ' +
      'data-share-title="' + encodeURIComponent(item.name + ' - Seasonal Guide') + '" ' +
      'data-share-text="' + encodeURIComponent('Discover ' + item.name + ' in season during ' + item.months + ' on FreshFind!') + '" ' +
      'data-share-url="seasonal-detail.html#' + item.id + '" title="Share seasonal item">' +
      '<i class="bi bi-share"></i>' +
      '</button>' +
      '<span class="price-chip">' + (item.markets ? item.markets.length : 0) + ' markets</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</article>' +
      '</div>'
    );
  }

  fetch("assets/seasonal.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(function (data) {
      allSeasonalItems = data.seasonalProduce || [];
      render();

      // Check if hash matches an anchor or season
      if (window.location.hash) {
        var hash = window.location.hash.replace("#", "").toLowerCase();
        var matchingBtn = filterContainer ? filterContainer.querySelector('[data-season="' + hash + '"]') : null;
        if (matchingBtn) {
          matchingBtn.click();
        }
      }
    })
    .catch(function (error) {
      console.error("Error loading seasonal.json:", error);
      container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load seasonal produce data. Please check back later.</div></div>';
      if (countEl) countEl.textContent = "0 items";
    });

  function getFilteredItems() {
    if (activeSeason === "all") return allSeasonalItems;
    return allSeasonalItems.filter(function (item) {
      return item.season.toLowerCase() === activeSeason.toLowerCase();
    });
  }

  function render() {
    var filtered = getFilteredItems();

    if (countEl) {
      var label = activeSeason === "all" ? "all seasons" : activeSeason + " season";
      countEl.textContent = "Showing " + filtered.length + " item" + (filtered.length === 1 ? "" : "s") + " for " + label;
    }

    if (!filtered.length) {
      container.innerHTML = `
        <div class="col-12">
          <div class="empty-state p-5">
            <div class="fs-1 text-muted mb-2"><i class="bi bi-calendar-x"></i></div>
            <h4 class="h5 fw-bold">No seasonal items found for "${activeSeason}"</h4>
            <p class="text-secondary mb-3">Try choosing another season or view all items.</p>
            <button type="button" class="btn btn-outline-green btn-sm" id="resetSeasonBtn">Show All Seasons</button>
          </div>
        </div>
      `;
      var resetBtn = document.getElementById("resetSeasonBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          var allBtn = filterContainer.querySelector('[data-season="all"]');
          if (allBtn) allBtn.click();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(seasonalCardHtml).join("");
  }

  // Season filter button delegation
  if (filterContainer) {
    filterContainer.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-season-pill");
      if (!btn) return;

      filterContainer.querySelectorAll(".btn-season-pill").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      activeSeason = btn.getAttribute("data-season") || "all";
      render();
    });
  }

  document.addEventListener("bookmarks:changed", function (e) {
    if (e.detail.type === "produce") render();
  });
});

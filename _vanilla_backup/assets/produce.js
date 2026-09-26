document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("productsContainer");
  var filterContainer = document.getElementById("categoryFilterContainer");
  var countEl = document.getElementById("produceCount");
  if (!container) return;

  var allProducts = [];
  var activeCategory = "all";

  fetch("assets/products.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(function (data) {
      allProducts = data.products || [];
      render();

      // Check if hash matches a category or product
      if (window.location.hash) {
        var hash = window.location.hash.replace("#", "").toLowerCase();
        var matchingBtn = filterContainer ? filterContainer.querySelector('[data-category="' + hash + '"]') : null;
        if (matchingBtn) {
          matchingBtn.click();
        }
      }
    })
    .catch(function (error) {
      console.error("Error loading products.json:", error);
      container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load produce data. Please check back later.</div></div>';
      if (countEl) countEl.textContent = "0 items";
    });

  function getFilteredProducts() {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter(function (p) {
      if (activeCategory.toLowerCase() === "pantry") {
        return p.category.toLowerCase() === "pantry" || p.category.toLowerCase() === "spices";
      }
      return p.category.toLowerCase() === activeCategory.toLowerCase();
    });
  }

  function render() {
    var filtered = getFilteredProducts();

    if (countEl) {
      countEl.textContent = "Showing " + filtered.length + " " + (activeCategory === "all" ? "produce items" : activeCategory + " items");
    }

    if (!filtered.length) {
      container.innerHTML = `
        <div class="col-12">
          <div class="empty-state p-5">
            <div class="fs-1 text-muted mb-2"><i class="bi bi-basket2"></i></div>
            <h4 class="h5 fw-bold">No produce listed under "${activeCategory}"</h4>
            <p class="text-secondary mb-3">Check back soon as growers register their seasonal harvest!</p>
            <button type="button" class="btn btn-outline-green btn-sm" id="resetCategoryBtn">Show All Produce</button>
          </div>
        </div>
      `;
      var resetBtn = document.getElementById("resetCategoryBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          var allBtn = filterContainer.querySelector('[data-category="all"]');
          if (allBtn) allBtn.click();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(produceCardHtml).join("");
  }

  // Feature 10: Category filter buttons listener
  if (filterContainer) {
    filterContainer.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-category-pill");
      if (!btn) return;

      filterContainer.querySelectorAll(".btn-category-pill").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      activeCategory = btn.getAttribute("data-category") || "all";
      render();
    });
  }

  document.addEventListener("bookmarks:changed", function (e) {
    if (e.detail.type === "produce") render();
  });
});

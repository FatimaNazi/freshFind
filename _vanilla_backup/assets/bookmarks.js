document.addEventListener("DOMContentLoaded", function () {
  var marketList = document.getElementById("bookmarked-markets");
  var produceList = document.getElementById("bookmarked-produce");
  var emptyState = document.getElementById("bookmarks-empty");
  var summary = document.getElementById("bookmarks-summary");
  var downloadAllBtn = document.getElementById("downloadAllBookmarksBtn");
  var exportListBtn = document.getElementById("exportBookmarksListBtn");
  var clearAllBtn = document.getElementById("clearAllBookmarksBtn");
  var marketsSection = document.getElementById("bookmarked-markets-section");
  var produceSection = document.getElementById("bookmarked-produce-section");
  var globalActions = document.getElementById("bookmarkGlobalActions");

  if (!marketList && !produceList) return;

  var allMarkets = [];
  var allProducts = [];

  function loadData() {
    Promise.all([
      fetch("assets/markets.json").then(function (r) { return r.json(); }),
      fetch("assets/products.json").then(function (r) { return r.json(); })
    ]).then(function (results) {
      allMarkets = results[0].markets || [];
      allProducts = results[1].products || [];
      render();
    }).catch(function (error) {
      console.error("Bookmarks loading error:", error);
      if (marketList) marketList.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load bookmark data.</div></div>';
    });
  }

  function getSavedItems() {
    var savedMarketIds = getBookmarks("markets");
    var savedProduceIds = getBookmarks("produce");

    var savedMarkets = allMarkets.filter(function (m) {
      return savedMarketIds.indexOf(String(m.id)) !== -1;
    });

    var savedProducts = allProducts.filter(function (p) {
      return savedProduceIds.indexOf(String(p.id)) !== -1;
    });

    return { markets: savedMarkets, produce: savedProducts };
  }

  function render() {
    var saved = getSavedItems();
    var savedMarkets = saved.markets;
    var savedProducts = saved.produce;
    var total = savedMarkets.length + savedProducts.length;

    if (summary) {
      summary.textContent = total + " item(s) saved (" + savedMarkets.length + " markets, " + savedProducts.length + " produce items)";
    }

    if (marketList) {
      if (savedMarkets.length) {
        if (marketsSection) marketsSection.style.display = "block";
        marketList.innerHTML = savedMarkets.map(bookmarkedMarketCardHtml).join("");
      } else {
        if (marketsSection) marketsSection.style.display = total > 0 ? "none" : "none";
        marketList.innerHTML = "";
      }
    }

    if (produceList) {
      if (savedProducts.length) {
        if (produceSection) produceSection.style.display = "block";
        produceList.innerHTML = savedProducts.map(bookmarkedProduceCardHtml).join("");
      } else {
        if (produceSection) produceSection.style.display = total > 0 ? "none" : "none";
        produceList.innerHTML = "";
      }
    }

    if (emptyState) {
      emptyState.style.display = total ? "none" : "block";
    }

    if (globalActions) {
      globalActions.style.display = total ? "flex" : "none";
    }
  }

  // Handle individual downloads and note updates via delegation
  document.addEventListener("click", function (e) {
    // Download Single Market Details
    var dlMarketBtn = e.target.closest(".download-market-btn");
    if (dlMarketBtn) {
      var mId = dlMarketBtn.getAttribute("data-id");
      var market = allMarkets.find(function (m) { return String(m.id) === String(mId); });
      if (market) {
        var note = getBookmarkNote("markets", market.id);
        var content = generateMarketDetailsDoc(market, note);
        var filename = market.name.replace(/[^a-zA-Z0-9_-]/g, "_") + "_Market_Details.txt";
        downloadTextFile(filename, content);
        showFormToast("Downloaded " + market.name + " Details!");
      }
      return;
    }

    // Download Single Produce Guide
    var dlProduceBtn = e.target.closest(".download-produce-btn");
    if (dlProduceBtn) {
      var pId = dlProduceBtn.getAttribute("data-id");
      var product = allProducts.find(function (p) { return String(p.id) === String(pId); });
      if (product) {
        var pNote = getBookmarkNote("produce", product.id);
        var pContent = generateProduceGuideDoc(product, pNote);
        var pFilename = product.name.replace(/[^a-zA-Z0-9_-]/g, "_") + "_Produce_Guide.txt";
        downloadTextFile(pFilename, pContent);
        showFormToast("Downloaded " + product.name + " Produce Guide!");
      }
      return;
    }

    // Remove Bookmark
    var removeBtn = e.target.closest(".remove-bookmark-btn");
    if (removeBtn) {
      var rType = removeBtn.getAttribute("data-type");
      var rId = removeBtn.getAttribute("data-id");
      if (rType && rId) {
        toggleBookmark(rType, rId);
        showFormToast("Item removed from bookmarks.");
        render();
        document.dispatchEvent(new CustomEvent("bookmarks:changed", { detail: { type: rType, id: rId, saved: false } }));
      }
      return;
    }
  });

  // Top Action: Download All Bookmarks
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener("click", function () {
      var saved = getSavedItems();
      if (!saved.markets.length && !saved.produce.length) {
        showFormToast("No bookmarks saved to download.");
        return;
      }
      var docContent = generateAllBookmarksDoc(saved.markets, saved.produce);
      downloadTextFile("FreshFind_All_Bookmarks.txt", docContent);
      showFormToast("All bookmarks downloaded successfully!");
    });
  }

  // Top Action: Export Formatted List
  if (exportListBtn) {
    exportListBtn.addEventListener("click", function () {
      var saved = getSavedItems();
      if (!saved.markets.length && !saved.produce.length) {
        showFormToast("No bookmarks saved to export.");
        return;
      }
      var listContent = generateAllBookmarksDoc(saved.markets, saved.produce);
      downloadTextFile("FreshFind_Bookmarks_Export.txt", listContent);
      showFormToast("Formatted bookmark list exported!");
    });
  }

  // Top Action: Clear All Bookmarks
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all your saved bookmarks?")) {
        localStorage.removeItem(BOOKMARK_KEYS.markets);
        localStorage.removeItem(BOOKMARK_KEYS.produce);
        sessionStorage.removeItem(SESSION_NOTES_KEY);
        showFormToast("All bookmarks and session notes cleared.");
        render();
        document.dispatchEvent(new CustomEvent("bookmarks:changed", { detail: { type: "all", saved: false } }));
      }
    });
  }

  // Re-render when note or bookmark changes
  document.addEventListener("bookmarks:changed", function () {
    render();
  });

  document.addEventListener("bookmarks:notesChanged", function (e) {
    var targetEl = document.getElementById("note-text-" + e.detail.type + "-" + e.detail.id);
    if (targetEl) {
      if (e.detail.note) {
        targetEl.textContent = e.detail.note;
        targetEl.className = "note-display small text-dark";
      } else {
        targetEl.innerHTML = 'No personal note added yet. Click &quot;Add Note&quot; to write a reminder for this session.';
        targetEl.className = "note-display small text-muted fst-italic";
      }
    }
  });

  loadData();
});

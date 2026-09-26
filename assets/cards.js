var BOOKMARK_KEYS = {
  markets: "ff_bookmarked_markets",
  produce: "ff_bookmarked_produce"
};

var SESSION_NOTES_KEY = "ff_session_bookmark_notes";

// --- Bookmark Storage (Local) ---
function getBookmarks(type) {
  try {
    var raw = localStorage.getItem(BOOKMARK_KEYS[type]);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isBookmarked(type, id) {
  return getBookmarks(type).indexOf(String(id)) !== -1;
}

function toggleBookmark(type, id) {
  id = String(id);
  var list = getBookmarks(type);
  var index = list.indexOf(id);
  var nowSaved;

  if (index === -1) {
    list.push(id);
    nowSaved = true;
  } else {
    list.splice(index, 1);
    nowSaved = false;
  }

  localStorage.setItem(BOOKMARK_KEYS[type], JSON.stringify(list));
  return nowSaved;
}

// --- Session-Only Personal Notes (Strictly sessionStorage) ---
function getBookmarkNotes() {
  try {
    var raw = sessionStorage.getItem(SESSION_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getBookmarkNote(type, id) {
  var notes = getBookmarkNotes();
  return notes[type + ":" + id] || "";
}

function saveBookmarkNote(type, id, note) {
  var notes = getBookmarkNotes();
  var key = type + ":" + id;
  if (!note || !note.trim()) {
    delete notes[key];
  } else {
    notes[key] = note.trim();
  }
  sessionStorage.setItem(SESSION_NOTES_KEY, JSON.stringify(notes));
  document.dispatchEvent(new CustomEvent("bookmarks:notesChanged", {
    detail: { type: type, id: id, note: notes[key] || "" }
  }));
}

function deleteBookmarkNote(type, id) {
  saveBookmarkNote(type, id, "");
}

// --- Rating Stars ---
function ratingStars(rating) {
  var rounded = Math.round(rating);
  var stars = "";
  for (var i = 1; i <= 5; i++) {
    stars += i <= rounded ? "★" : "☆";
  }
  return stars;
}

// --- Bookmark Button Component ---
function bookmarkButtonHtml(type, id, extraClass) {
  var saved = isBookmarked(type, id);
  return '<button type="button" class="bookmark-btn' + (saved ? ' saved' : '') +
    (extraClass ? ' ' + extraClass : '') +
    '" data-bookmark-type="' + type + '" data-bookmark-id="' + id + '" ' +
    'aria-pressed="' + saved + '" title="' + (saved ? 'Remove bookmark' : 'Save bookmark') + '">' +
    '<i class="bi ' + (saved ? 'bi-bookmark-star-fill' : 'bi-bookmark') + '"></i></button>';
}

// --- Standard Market Card (Used in Directory, Home, Highlights) ---
function marketCardHtml(market) {
  var days = market.daysList ? market.daysList.join(", ") : market.days;
  var categories = market.categoryList ? market.categoryList.join(" · ") : market.categories;
  var badges = '<span class="small text-muted">' + (market.type || "") + '</span>';

  return (
    '<div class="col-md-6 col-xl-4" data-market-card="' + market.id + '">' +
    '<article class="market-card h-100 position-relative">' +
    '<div class="thumb ' + (market.thumbClass || "market-a") + '">' +
    bookmarkButtonHtml("markets", market.id, "position-absolute top-0 end-0 m-2") +
    '<div class="illustration"><img src="assets/' + market.image + '" alt="' + market.name + '" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
    '</div>' +
    '<div class="card-body-custom">' +
    '<div class="d-flex justify-content-between gap-2 align-items-start">' +
    '<span class="badge-soft">' + market.location + '</span>' + badges +
    '</div>' +
    '<h4 class="mt-3 mb-2">' + market.name + '</h4>' +
    '<p class="text-secondary">' + market.description + '</p>' +
    '<div class="market-meta mb-2">' +
    '<span><i class="bi bi-calendar-event"></i> ' + days + '</span>' +
    '<span><i class="bi bi-clock"></i> ' + market.hours + '</span>' +
    '</div>' +
    '<div class="market-meta mb-3">' +
    '<span><i class="bi bi-star-fill" style="color:var(--gold-500)"></i> ' + (market.rating ? market.rating.toFixed(1) : "4.5") + '</span>' +
    (market.organic ? '<span><i class="bi bi-flower1"></i> Organic</span>' : '') +
    '</div>' +
    '<div class="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">' +
    '<a class="btn btn-outline-green btn-sm" href="' + market.detailsLink + '">View details</a>' +
    '<div class="d-flex align-items-center gap-2">' +
    '<button type="button" class="btn btn-sm btn-outline-secondary share-trigger-btn" data-share-title="' + encodeURIComponent(market.name) + '" data-share-text="' + encodeURIComponent('Check out ' + market.name + ' on FreshFind!') + '" data-share-url="market-detail.html#' + market.id + '" title="Share this market"><i class="bi bi-share"></i></button>' +
    '<span class="price-chip">' + categories + '</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</article>' +
    '</div>'
  );
}

// --- Standard Produce Card (Used in Produce Guide) ---
function produceCardHtml(product) {
  var marketList = (product.markets || []).join(", ");
  return (
    '<div class="col-md-6 col-xl-4" data-produce-card="' + product.id + '" data-category="' + product.category + '">' +
    '<article class="product-card h-100 position-relative">' +
    bookmarkButtonHtml("produce", product.id, "position-absolute top-0 end-0 m-3") +
    '<div class="produce-thumb"><img src="' + product.image + '" alt="' + product.alt + '" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
    '<div class="p-4 d-flex flex-column justify-content-between">' +
    '<div>' +
    '<span class="badge-soft d-inline-block mb-2">' + product.category + '</span>' +
    '<h3 class="h5 mb-2">' + product.name + '</h3>' +
    '<p class="text-secondary small">' + product.description + '</p>' +
    '<p class="small mb-1"><strong>Typical season:</strong> ' + product.season + '</p>' +
    '<p class="small text-secondary mb-3"><strong>Found at:</strong> ' + marketList + '</p>' +
    '</div>' +
    '<div class="d-flex justify-content-between align-items-center gap-2 pt-2 border-top mt-2">' +
    '<a class="btn btn-outline-green btn-sm" href="produce-detail.html#' + product.id + '"><i class="bi bi-eye me-1"></i>View Details</a>' +
    '<div class="d-flex align-items-center gap-2">' +
    '<button type="button" class="btn btn-sm btn-outline-secondary share-trigger-btn" data-share-title="' + encodeURIComponent(product.name + ' - FreshFind Produce Guide') + '" data-share-text="' + encodeURIComponent('Learn where to find fresh ' + product.name + ' on FreshFind!') + '" data-share-url="produce-detail.html#' + product.id + '" title="Share produce"><i class="bi bi-share"></i></button>' +
    '<span class="price-chip">' + (product.markets ? product.markets.length : 0) + ' markets</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</article>' +
    '</div>'
  );
}

// --- Specialized Bookmarked Market Card with Notes & Action Buttons ---
function bookmarkedMarketCardHtml(market) {
  var days = market.daysList ? market.daysList.join(", ") : market.days;
  var note = getBookmarkNote("markets", market.id);

  return (
    '<div class="col-md-6 col-xl-6" id="saved-market-' + market.id + '">' +
    '<article class="market-card bookmark-item-card h-100 p-3">' +
    '<div class="d-flex justify-content-between align-items-start gap-3 mb-2">' +
    '<div>' +
    '<span class="badge-soft me-2">' + market.location + '</span>' +
    (market.type ? '<span class="badge bg-light text-muted border">' + market.type + '</span>' : '') +
    '<h4 class="h5 mt-2 mb-1">' + market.name + '</h4>' +
    '<div class="small text-muted mb-2"><i class="bi bi-calendar-event me-1"></i>' + days + ' &bull; <i class="bi bi-clock me-1"></i>' + market.hours + '</div>' +
    '</div>' +
    '<button type="button" class="btn btn-sm btn-outline-danger remove-bookmark-btn" data-type="markets" data-id="' + market.id + '" title="Remove from bookmarks"><i class="bi bi-trash3"></i></button>' +
    '</div>' +

    '<p class="small text-secondary mb-3">' + market.description + '</p>' +

    // Session Personal Note Box
    '<div class="bookmark-note-box p-3 rounded mb-3 bg-light border">' +
    '<div class="d-flex justify-content-between align-items-center mb-1">' +
    '<span class="fw-semibold small text-success"><i class="bi bi-journal-text me-1"></i>Personal Note <span class="badge bg-secondary-subtle text-secondary fw-normal">Session only</span></span>' +
    '<button type="button" class="btn btn-sm btn-link p-0 edit-note-btn" data-type="markets" data-id="' + market.id + '">' +
    (note ? '<i class="bi bi-pencil-square me-1"></i>Edit' : '<i class="bi bi-plus-circle me-1"></i>Add Note') +
    '</button>' +
    '</div>' +
    '<div class="note-display small ' + (note ? 'text-dark' : 'text-muted fst-italic') + '" id="note-text-markets-' + market.id + '">' +
    (note ? escapeHtml(note) : 'No personal note added yet. Click &quot;Add Note&quot; to write a reminder for this session.') +
    '</div>' +
    '</div>' +

    // Action Buttons: View | Download | Share | Remove
    '<div class="d-flex flex-wrap gap-2 pt-2 border-top">' +
    '<a href="' + market.detailsLink + '" class="btn btn-sm btn-outline-green"><i class="bi bi-eye me-1"></i>View Details</a>' +
    '<button type="button" class="btn btn-sm btn-outline-success download-market-btn" data-id="' + market.id + '"><i class="bi bi-download me-1"></i>Download Market Details</button>' +
    '<button type="button" class="btn btn-sm btn-outline-secondary share-trigger-btn" data-share-title="' + encodeURIComponent(market.name) + '" data-share-text="' + encodeURIComponent('Check out ' + market.name + ' on FreshFind!') + '" data-share-url="market-detail.html#' + market.id + '"><i class="bi bi-share me-1"></i>Share</button>' +
    '<button type="button" class="btn btn-sm btn-outline-danger remove-bookmark-btn ms-auto" data-type="markets" data-id="' + market.id + '"><i class="bi bi-x-circle me-1"></i>Remove</button>' +
    '</div>' +
    '</article>' +
    '</div>'
  );
}

// --- Specialized Bookmarked Produce Card with Notes & Action Buttons ---
function bookmarkedProduceCardHtml(product) {
  var note = getBookmarkNote("produce", product.id);

  return (
    '<div class="col-md-6 col-xl-6" id="saved-produce-' + product.id + '">' +
    '<article class="product-card bookmark-item-card h-100 p-3">' +
    '<div class="d-flex justify-content-between align-items-start gap-3 mb-2">' +
    '<div>' +
    '<span class="badge-soft me-2">' + product.category + '</span>' +
    '<span class="badge bg-light text-muted border">' + product.season + '</span>' +
    '<h4 class="h5 mt-2 mb-1">' + product.name + '</h4>' +
    '<div class="small text-muted mb-2"><i class="bi bi-shop me-1"></i>Found at: ' + (product.markets || []).join(", ") + '</div>' +
    '</div>' +
    '<button type="button" class="btn btn-sm btn-outline-danger remove-bookmark-btn" data-type="produce" data-id="' + product.id + '" title="Remove from bookmarks"><i class="bi bi-trash3"></i></button>' +
    '</div>' +

    '<p class="small text-secondary mb-3">' + product.description + '</p>' +

    // Session Personal Note Box
    '<div class="bookmark-note-box p-3 rounded mb-3 bg-light border">' +
    '<div class="d-flex justify-content-between align-items-center mb-1">' +
    '<span class="fw-semibold small text-success"><i class="bi bi-journal-text me-1"></i>Personal Note <span class="badge bg-secondary-subtle text-secondary fw-normal">Session only</span></span>' +
    '<button type="button" class="btn btn-sm btn-link p-0 edit-note-btn" data-type="produce" data-id="' + product.id + '">' +
    (note ? '<i class="bi bi-pencil-square me-1"></i>Edit' : '<i class="bi bi-plus-circle me-1"></i>Add Note') +
    '</button>' +
    '</div>' +
    '<div class="note-display small ' + (note ? 'text-dark' : 'text-muted fst-italic') + '" id="note-text-produce-' + product.id + '">' +
    (note ? escapeHtml(note) : 'No personal note added yet. Click &quot;Add Note&quot; to write a reminder for this session.') +
    '</div>' +
    '</div>' +

    // Action Buttons: View | Download | Share | Remove
    '<div class="d-flex flex-wrap gap-2 pt-2 border-top">' +
    '<a href="produce-detail.html#' + product.id + '" class="btn btn-sm btn-outline-green"><i class="bi bi-eye me-1"></i>View Details</a>' +
    '<button type="button" class="btn btn-sm btn-outline-success download-produce-btn" data-id="' + product.id + '"><i class="bi bi-download me-1"></i>Download Guide</button>' +
    '<button type="button" class="btn btn-sm btn-outline-secondary share-trigger-btn" data-share-title="' + encodeURIComponent(product.name + ' - FreshFind') + '" data-share-text="' + encodeURIComponent('Check out seasonal ' + product.name + ' on FreshFind!') + '" data-share-url="produce-detail.html#' + product.id + '"><i class="bi bi-share me-1"></i>Share</button>' +
    '<button type="button" class="btn btn-sm btn-outline-danger remove-bookmark-btn ms-auto" data-type="produce" data-id="' + product.id + '"><i class="bi bi-x-circle me-1"></i>Remove</button>' +
    '</div>' +
    '</article>' +
    '</div>'
  );
}

// --- Text File Download Helper ---
function downloadTextFile(filename, text) {
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 500);
}

// --- Formatters for File Downloads ---
function generateProduceGuideDoc(product, note) {
  var now = new Date().toLocaleString();
  var marketsStr = (product.markets || []).map(function (m) { return "  - " + m; }).join("\n");

  return [
    "============================================================",
    "FRESHFIND • PRODUCE GUIDE",
    "============================================================",
    "Produce Item : " + product.name,
    "Category     : " + product.category,
    "Season       : " + product.season,
    "",
    "Description:",
    product.description,
    "",
    "Available at Markets:",
    marketsStr || "  - Contact local vendors for availability",
    "",
    "Personal Note (Session):",
    note || "None attached",
    "",
    "Exported On  : " + now,
    "Website      : FreshFind Seasonal Discovery",
    "============================================================"
  ].join("\n");
}

function generateMarketDetailsDoc(market, note, userDistance) {
  var now = new Date().toLocaleString();
  var days = market.daysList ? market.daysList.join(", ") : market.days;
  var categories = market.categoryList ? market.categoryList.join(", ") : market.categories;
  var produceItems = (market.produce || []).map(function (p) { return "  - " + p; }).join("\n");

  return [
    "============================================================",
    "FRESHFIND • MARKET DETAILS",
    "============================================================",
    "Market Name  : " + market.name,
    "Neighborhood : " + market.location,
    "Address      : " + (market.address || market.location + ", Karachi (Demo Location)"),
    "Operating Days: " + days,
    "Opening Hours: " + market.hours,
    "Type         : " + (market.type || "Outdoor") + " | Organic: " + (market.organic ? "Yes" : "No"),
    "Rating       : " + (market.rating ? market.rating.toFixed(1) : "4.5") + " / 5.0",
    (userDistance ? "Distance     : " + userDistance + "\n" : "") +
    "Categories   : " + categories,
    "",
    "Contact Information:",
    "  - Phone    : " + (market.phone || "+92 (21) 111-FRESH (Demo)"),
    "  - Email    : " + (market.email || "hello@freshfind.example (Demo)"),
    "  - Website  : " + (market.website || "https://freshfind.example (Demo)"),
    (market.social && market.social.instagram ? "  - Instagram: " + market.social.instagram + "\n" : "") +
    (market.social && market.social.facebook ? "  - Facebook : " + market.social.facebook + "\n" : ""),
    "Description:",
    market.description,
    "",
    "Typical Produce Available:",
    produceItems || "  - Seasonal vegetables and fruits",
    "",
    "Personal Note (Session):",
    note || "None attached",
    "",
    "Exported On  : " + now,
    "Website      : FreshFind Farmers Market Discovery",
    "============================================================"
  ].join("\n");
}

function generateAllBookmarksDoc(savedMarkets, savedProducts) {
  var now = new Date().toLocaleString();
  var lines = [
    "============================================================",
    "FRESHFIND",
    "MY BOOKMARKS & PERSONAL NOTES",
    "Exported On: " + now,
    "============================================================",
    ""
  ];

  lines.push("MARKETS");
  lines.push("------------------------------------------------------------");
  if (!savedMarkets.length) {
    lines.push("No markets currently bookmarked.");
    lines.push("");
  } else {
    savedMarkets.forEach(function (m, idx) {
      var days = m.daysList ? m.daysList.join(", ") : m.days;
      var categories = m.categoryList ? m.categoryList.join(", ") : m.categories;
      var note = getBookmarkNote("markets", m.id);

      lines.push((idx + 1) + ". " + m.name);
      lines.push("   Location   : " + m.location);
      lines.push("   Address    : " + (m.address || m.location + ", Karachi (Demo)"));
      lines.push("   Days       : " + days);
      lines.push("   Hours      : " + m.hours);
      lines.push("   Categories : " + categories);
      lines.push("   Contact    : Phone: " + (m.phone || "N/A") + " | Email: " + (m.email || "N/A"));
      lines.push("   Personal Note: " + (note || "None"));
      lines.push("");
    });
  }

  lines.push("------------------------------------------------------------");
  lines.push("PRODUCE");
  lines.push("------------------------------------------------------------");
  if (!savedProducts.length) {
    lines.push("No produce items currently bookmarked.");
    lines.push("");
  } else {
    savedProducts.forEach(function (p, idx) {
      var note = getBookmarkNote("produce", p.id);
      lines.push((idx + 1) + ". " + p.name);
      lines.push("   Category   : " + p.category);
      lines.push("   Season     : " + p.season);
      lines.push("   Markets    : " + (p.markets || []).join(", "));
      lines.push("   Description: " + p.description);
      lines.push("   Personal Note: " + (note || "None"));
      lines.push("");
    });
  }

  lines.push("============================================================");
  lines.push("FreshFind &bull; Making local market discovery simpler.");
  lines.push("============================================================");

  return lines.join("\n");
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- Global Share Modal Component & Web Share API ---
(function initGlobalShareModal() {
  if (document.getElementById("freshfindShareModal")) return;

  var modalDiv = document.createElement("div");
  modalDiv.id = "freshfindShareModalRoot";
  document.body.appendChild(modalDiv);

  modalDiv.innerHTML = `
    <div class="modal fade" id="freshfindShareModal" tabindex="-1" aria-labelledby="shareModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold" id="shareModalTitle"><i class="bi bi-share text-success me-2"></i>Share Recommendation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4 text-center">
            <h6 class="fw-bold mb-1" id="shareItemTitle">FreshFind Discovery</h6>
            <p class="text-secondary small mb-4" id="shareItemSubtitle">Share this with friends and family</p>

            <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
              <a href="#" id="shareWhatsapp" target="_blank" rel="noopener" class="btn btn-outline-success px-3 py-2 d-flex flex-column align-items-center gap-1" style="min-width:75px">
                <i class="bi bi-whatsapp fs-4"></i>
                <span class="small">WhatsApp</span>
              </a>
              <a href="#" id="shareFacebook" target="_blank" rel="noopener" class="btn btn-outline-primary px-3 py-2 d-flex flex-column align-items-center gap-1" style="min-width:75px">
                <i class="bi bi-facebook fs-4"></i>
                <span class="small">Facebook</span>
              </a>
              <a href="#" id="shareTwitter" target="_blank" rel="noopener" class="btn btn-outline-dark px-3 py-2 d-flex flex-column align-items-center gap-1" style="min-width:75px">
                <i class="bi bi-twitter-x fs-4"></i>
                <span class="small">X (Twitter)</span>
              </a>
              <a href="#" id="shareEmail" class="btn btn-outline-secondary px-3 py-2 d-flex flex-column align-items-center gap-1" style="min-width:75px">
                <i class="bi bi-envelope-fill fs-4"></i>
                <span class="small">Email</span>
              </a>
            </div>

            <div class="input-group">
              <input type="text" class="form-control form-control-sm" id="shareUrlInput" readonly>
              <button class="btn btn-green btn-sm px-3" type="button" id="copyShareUrlBtn">
                <i class="bi bi-clipboard me-1"></i>Copy Link
              </button>
            </div>
            <div id="copyFeedback" class="small text-success mt-2" style="display:none;"><i class="bi bi-check2-circle me-1"></i>Link copied to clipboard!</div>
          </div>
        </div>
      </div>
    </div>
  `;
})();

function openShare(title, text, url) {
  var fullUrl = url ? new URL(url, window.location.href).href : window.location.href;

  if (navigator.share) {
    navigator.share({
      title: title || "FreshFind",
      text: text || "Check this out on FreshFind!",
      url: fullUrl
    }).catch(function (err) {
      if (err.name !== "AbortError") {
        fallbackShareModal(title, text, fullUrl);
      }
    });
  } else {
    fallbackShareModal(title, text, fullUrl);
  }
}

function fallbackShareModal(title, text, fullUrl) {
  var modalEl = document.getElementById("freshfindShareModal");
  if (!modalEl) return;

  title = title || "FreshFind Recommendation";
  text = text || "Check out this recommendation on FreshFind!";

  document.getElementById("shareItemTitle").textContent = title;
  document.getElementById("shareItemSubtitle").textContent = text;
  document.getElementById("shareUrlInput").value = fullUrl;
  document.getElementById("copyFeedback").style.display = "none";

  document.getElementById("shareWhatsapp").href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text + " " + fullUrl);
  document.getElementById("shareFacebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(fullUrl);
  document.getElementById("shareTwitter").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(fullUrl);
  document.getElementById("shareEmail").href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(text + "\n\n" + fullUrl);

  var modal = new bootstrap.Modal(modalEl);
  modal.show();

  var copyBtn = document.getElementById("copyShareUrlBtn");
  copyBtn.onclick = function () {
    navigator.clipboard.writeText(fullUrl).then(function () {
      var fb = document.getElementById("copyFeedback");
      fb.style.display = "block";
      setTimeout(function () { fb.style.display = "none"; }, 3000);
      showFormToast("Link copied to clipboard!");
    }).catch(function () {
      document.getElementById("shareUrlInput").select();
      document.execCommand("copy");
      showFormToast("Link copied!");
    });
  };
}

// --- Note Edit Modal Component ---
(function initNoteModal() {
  if (document.getElementById("freshfindNoteModal")) return;

  var noteModalDiv = document.createElement("div");
  noteModalDiv.id = "freshfindNoteModalRoot";
  document.body.appendChild(noteModalDiv);

  noteModalDiv.innerHTML = `
    <div class="modal fade" id="freshfindNoteModal" tabindex="-1" aria-labelledby="noteModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold" id="noteModalTitle"><i class="bi bi-journal-text text-success me-2"></i>Personal Note</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div class="alert alert-info py-2 px-3 small d-flex align-items-center gap-2">
              <i class="bi bi-info-circle-fill"></i>
              <span>This note is stored for this <strong>browser session only</strong> and will not be saved permanently on any server.</span>
            </div>
            <input type="hidden" id="noteTargetType">
            <input type="hidden" id="noteTargetId">
            <div class="mb-3">
              <label class="form-label fw-semibold" id="noteItemName">Item</label>
              <textarea class="form-control" id="noteInput" rows="4" placeholder="e.g. Visit Saturday morning before 10 AM, buy tomatoes and fresh mint..."></textarea>
            </div>
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-outline-danger btn-sm" id="deleteNoteBtn"><i class="bi bi-trash3 me-1"></i>Delete Note</button>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-green btn-sm" id="saveNoteBtn"><i class="bi bi-check-lg me-1"></i>Save Note</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  var saveBtn = document.getElementById("saveNoteBtn");
  var deleteBtn = document.getElementById("deleteNoteBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      var type = document.getElementById("noteTargetType").value;
      var id = document.getElementById("noteTargetId").value;
      var text = document.getElementById("noteInput").value;
      saveBookmarkNote(type, id, text);
      var modal = bootstrap.Modal.getInstance(document.getElementById("freshfindNoteModal"));
      if (modal) modal.hide();
      showFormToast("Personal note saved for this session!");
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      var type = document.getElementById("noteTargetType").value;
      var id = document.getElementById("noteTargetId").value;
      deleteBookmarkNote(type, id);
      var modal = bootstrap.Modal.getInstance(document.getElementById("freshfindNoteModal"));
      if (modal) modal.hide();
      showFormToast("Personal note deleted.");
    });
  }
})();

function openNoteModal(type, id, itemName) {
  var modalEl = document.getElementById("freshfindNoteModal");
  if (!modalEl) return;

  document.getElementById("noteTargetType").value = type;
  document.getElementById("noteTargetId").value = id;
  document.getElementById("noteItemName").textContent = itemName || (type === "markets" ? "Market" : "Produce Item");
  document.getElementById("noteInput").value = getBookmarkNote(type, id);

  var modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// Global click event delegation for bookmark buttons, share buttons, and note edits
document.addEventListener("click", function (event) {
  // Bookmark toggle button
  var btn = event.target.closest(".bookmark-btn");
  if (btn) {
    var type = btn.getAttribute("data-bookmark-type");
    var id = btn.getAttribute("data-bookmark-id");
    if (!type || !id) return;

    var nowSaved = toggleBookmark(type, id);

    btn.classList.toggle("saved", nowSaved);
    btn.setAttribute("aria-pressed", nowSaved);
    btn.title = nowSaved ? "Remove bookmark" : "Save bookmark";
    var icon = btn.querySelector("i");
    if (icon) {
      icon.className = "bi " + (nowSaved ? "bi-bookmark-star-fill" : "bi-bookmark");
    }

    showFormToast(nowSaved ? "Added to your Bookmarks!" : "Removed from your Bookmarks.");
    document.dispatchEvent(new CustomEvent("bookmarks:changed", { detail: { type: type, id: id, saved: nowSaved } }));
    return;
  }

  // Share trigger button
  var shareBtn = event.target.closest(".share-trigger-btn");
  if (shareBtn) {
    var sTitle = decodeURIComponent(shareBtn.getAttribute("data-share-title") || "FreshFind");
    var sText = decodeURIComponent(shareBtn.getAttribute("data-share-text") || "Check this out on FreshFind!");
    var sUrl = shareBtn.getAttribute("data-share-url") || window.location.href;
    openShare(sTitle, sText, sUrl);
    return;
  }

  // Note edit trigger
  var noteBtn = event.target.closest(".edit-note-btn");
  if (noteBtn) {
    var nType = noteBtn.getAttribute("data-type");
    var nId = noteBtn.getAttribute("data-id");
    var card = noteBtn.closest(".bookmark-item-card");
    var titleEl = card ? card.querySelector("h4") : null;
    var name = titleEl ? titleEl.textContent : "Saved Item";
    openNoteModal(nType, nId, name);
    return;
  }
});

// Update initial saved state for static bookmark buttons
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".bookmark-btn[data-bookmark-id]").forEach(function (btn) {
    var type = btn.getAttribute("data-bookmark-type");
    var id = btn.getAttribute("data-bookmark-id");
    var saved = isBookmarked(type, id);
    btn.classList.toggle("saved", saved);
    var icon = btn.querySelector("i");
    if (icon) icon.className = "bi " + (saved ? "bi-bookmark-star-fill" : "bi-bookmark");
  });
});

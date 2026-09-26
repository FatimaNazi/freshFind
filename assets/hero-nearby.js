// Dynamic Nearby Market Hero Feature (Feature 8)
// Uses standard browser Geolocation API with graceful fallbacks.

document.addEventListener("DOMContentLoaded", function () {
  var heroPanel = document.getElementById("activeMarketsPanel");
  var geoBtn = document.getElementById("findNearestMarketBtn");
  var statusBox = document.getElementById("heroGeoStatus");
  var defaultList = document.getElementById("defaultActiveMarketsList");
  var nearbyContainer = document.getElementById("nearestMarketDisplay");

  if (!geoBtn) return;

  var cachedMarkets = null;

  function loadMarkets(cb) {
    if (cachedMarkets) {
      cb(cachedMarkets);
      return;
    }
    fetch("assets/markets.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        cachedMarkets = data.markets || [];
        cb(cachedMarkets);
      })
      .catch(function (err) {
        console.error("Failed to load markets for geolocation:", err);
        cb([]);
      });
  }

  // Haversine formula to compute distance in km
  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth radius in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function displayNearestMarket(nearest, distanceKm) {
    if (!nearbyContainer || !defaultList) return;

    var distStr = distanceKm < 1 ? Math.round(distanceKm * 1000) + " meters away" : distanceKm.toFixed(1) + " km away";
    var days = nearest.daysList ? nearest.daysList.join(", ") : nearest.days;

    nearbyContainer.innerHTML = `
      <div class="nearest-market-card p-3 rounded-3 bg-white text-dark shadow-sm border border-warning">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-gold text-dark fw-bold"><i class="bi bi-geo-alt-fill me-1"></i>Nearest Market to You</span>
          <span class="badge bg-success text-white"><i class="bi bi-compass me-1"></i>${distStr}</span>
        </div>
        <h4 class="h5 fw-bold mb-1 text-dark">${nearest.name}</h4>
        <div class="text-secondary small mb-2">
          <i class="bi bi-geo-alt text-danger me-1"></i>${nearest.location} &bull; ${nearest.address || "Karachi"}
        </div>
        <div class="market-meta small mb-3 text-muted">
          <div><i class="bi bi-calendar-event me-1"></i><strong>Days:</strong> ${days}</div>
          <div><i class="bi bi-clock me-1"></i><strong>Hours:</strong> ${nearest.hours}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
          <button type="button" class="btn btn-outline-secondary btn-sm" id="resetHeroMarketsBtn">
            <i class="bi bi-arrow-counterclockwise me-1"></i>All Active Markets
          </button>
          <a href="market-detail.html#${nearest.id}" class="btn btn-gold btn-sm fw-bold">
            View Market Details <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    defaultList.style.display = "none";
    nearbyContainer.style.display = "block";

    var resetBtn = document.getElementById("resetHeroMarketsBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        nearbyContainer.style.display = "none";
        defaultList.style.display = "block";
        if (statusBox) statusBox.style.display = "none";
        geoBtn.innerHTML = '<i class="bi bi-geo-alt-fill me-1"></i>Find Nearest Market';
        geoBtn.disabled = false;
      });
    }
  }

  geoBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      showFallback("Geolocation is not supported by your browser. Displaying default active markets.");
      return;
    }

    geoBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Locating...';
    geoBtn.disabled = true;
    if (statusBox) statusBox.style.display = "none";

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLat = position.coords.latitude;
        var userLon = position.coords.longitude;

        loadMarkets(function (markets) {
          geoBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Location Found';
          geoBtn.disabled = false;

          var validMarkets = markets.filter(function (m) {
            return typeof m.latitude === "number" && typeof m.longitude === "number";
          });

          if (!validMarkets.length) {
            showFallback("Market coordinates are currently unavailable. Showing featured markets.");
            return;
          }

          var nearest = null;
          var minDistance = Infinity;

          validMarkets.forEach(function (m) {
            var dist = calculateDistance(userLat, userLon, m.latitude, m.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = m;
            }
          });

          if (nearest) {
            displayNearestMarket(nearest, minDistance);
          } else {
            showFallback("Could not determine nearest market. Showing featured markets.");
          }
        });
      },
      function (error) {
        geoBtn.innerHTML = '<i class="bi bi-geo-alt-fill me-1"></i>Find Nearest Market';
        geoBtn.disabled = false;

        var msg = "Location access denied or unavailable. Showing featured active markets.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied. Showing featured active markets.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Showing featured active markets.";
        }
        showFallback(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });

  function showFallback(message) {
    if (statusBox) {
      statusBox.innerHTML = '<i class="bi bi-info-circle me-1"></i>' + message;
      statusBox.style.display = "block";
    }
    if (defaultList) defaultList.style.display = "block";
    if (nearbyContainer) nearbyContainer.style.display = "none";
  }
});

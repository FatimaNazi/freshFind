// Contact Geolocation Map Script - FreshFind
// Uses Leaflet.js and HTML5 Geolocation API with Haversine distance calculation

document.addEventListener("DOMContentLoaded", function () {
  var mapElement = document.getElementById("contactGeoMap");
  if (!mapElement) return;

  var KARACHI_HUB = {
    name: "FreshFind Support & Operations Hub",
    address: "I.I. Chundrigar Road, Karachi, Sindh, Pakistan",
    lat: 24.8607,
    lng: 67.0011,
    phone: "+92 (21) 111-FRESH (37374)",
    email: "contact@freshfind.example"
  };

  var map = null;
  var userMarker = null;
  var userCircle = null;
  var routingLine = null;
  var marketMarkers = [];
  var allMarkets = [];

  // Fallback if Leaflet failed to load
  if (typeof L === "undefined") {
    console.warn("Leaflet library not loaded, showing fallback map preview.");
    mapElement.innerHTML = `
      <iframe class="map-frame w-100" height="420" style="border:0;" loading="lazy" src="https://www.google.com/maps?q=Karachi,+Sindh,+Pakistan&output=embed" title="Office Location Map"></iframe>
    `;
    return;
  }

  // Initialize Map
  try {
    map = L.map("contactGeoMap", {
      center: [KARACHI_HUB.lat, KARACHI_HUB.lng],
      zoom: 12,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Icon Creators using L.divIcon
    var hubIcon = L.divIcon({
      className: "custom-leaflet-pin-wrapper",
      html: '<div class="custom-hub-pin"><i class="bi bi-star-fill"></i></div>',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -36]
    });

    var marketIcon = L.divIcon({
      className: "custom-leaflet-pin-wrapper",
      html: '<div class="custom-market-pin"><i class="bi bi-shop"></i></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });

    var userIcon = L.divIcon({
      className: "custom-user-pin-wrapper",
      html: '<div class="user-geo-pulse"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });

    // Add Central Office Hub Marker
    var hubPopupHtml = `
      <div class="p-2" style="max-width: 260px;">
        <span class="badge bg-gold text-dark mb-1"><i class="bi bi-building me-1"></i>Main Support Hub</span>
        <h6 class="fw-bold mb-1 text-dark">${KARACHI_HUB.name}</h6>
        <p class="small text-secondary mb-2">${KARACHI_HUB.address}</p>
        <div class="small text-muted mb-2">
          <div><i class="bi bi-telephone text-success me-1"></i>${KARACHI_HUB.phone}</div>
          <div><i class="bi bi-envelope text-primary me-1"></i>${KARACHI_HUB.email}</div>
        </div>
        <span class="badge bg-success-subtle text-success border border-success-subtle small">Operations HQ</span>
      </div>
    `;

    var hubMarker = L.marker([KARACHI_HUB.lat, KARACHI_HUB.lng], { icon: hubIcon })
      .addTo(map)
      .bindPopup(hubPopupHtml);

    // Load Markets from JSON
    fetch("assets/markets.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allMarkets = data.markets || [];
        allMarkets.forEach(function (m) {
          if (typeof m.latitude === "number" && typeof m.longitude === "number") {
            var days = m.daysList ? m.daysList.join(", ") : m.days;
            var popupHtml = `
              <div class="p-2" style="max-width: 250px;">
                <span class="badge bg-success text-white mb-1"><i class="bi bi-shop me-1"></i>${m.location}</span>
                <h6 class="fw-bold mb-1 text-dark">${m.name}</h6>
                <div class="small text-secondary mb-2">${m.address || m.location}</div>
                <div class="small text-muted mb-2">
                  <div><i class="bi bi-calendar-event me-1"></i><strong>Days:</strong> ${days}</div>
                  <div><i class="bi bi-clock me-1"></i><strong>Hours:</strong> ${m.hours}</div>
                </div>
                <a href="market-detail.html#${m.id}" class="btn btn-outline-green btn-sm w-100 mt-1">
                  <i class="bi bi-arrow-right-circle me-1"></i>View Market Details
                </a>
              </div>
            `;

            var marker = L.marker([m.latitude, m.longitude], { icon: marketIcon })
              .addTo(map)
              .bindPopup(popupHtml);

            marker.marketData = m;
            marketMarkers.push(marker);
          }
        });
      })
      .catch(function (err) {
        console.error("Unable to load markets for contact map:", err);
      });

  } catch (e) {
    console.error("Leaflet initialization error:", e);
  }

  // Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Geolocation Controls
  var btnGeolocate = document.getElementById("btnGeolocateMe");
  var btnResetHub = document.getElementById("btnResetKarachiHub");
  var btnFitAll = document.getElementById("btnFitAllMarkets");
  var statusBox = document.getElementById("geoStatusBox");
  var statusMsg = document.getElementById("geoStatusMessage");
  var coordsBadge = document.getElementById("geoCoordsBadge");

  var nearestBox = document.getElementById("nearestMarketBox");
  var nearestName = document.getElementById("nearestMarketName");
  var nearestMeta = document.getElementById("nearestMarketMeta");
  var nearestDistBadge = document.getElementById("nearestDistanceBadge");
  var nearestDetailsBtn = document.getElementById("nearestDetailsBtn");
  var nearestDirectionsBtn = document.getElementById("nearestDirectionsBtn");

  if (btnResetHub) {
    btnResetHub.addEventListener("click", function () {
      if (map) {
        map.setView([KARACHI_HUB.lat, KARACHI_HUB.lng], 13, { animate: true });
      }
    });
  }

  if (btnFitAll) {
    btnFitAll.addEventListener("click", function () {
      if (!map) return;
      var points = [[KARACHI_HUB.lat, KARACHI_HUB.lng]];
      marketMarkers.forEach(function (m) {
        points.push(m.getLatLng());
      });
      if (userMarker) {
        points.push(userMarker.getLatLng());
      }
      var bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    });
  }

  if (btnGeolocate) {
    btnGeolocate.addEventListener("click", function () {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your current browser.");
        return;
      }

      btnGeolocate.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Locating...';
      btnGeolocate.disabled = true;

      if (statusBox) {
        statusBox.className = "alert alert-info py-2 px-3 small rounded-3 mb-3";
        statusBox.style.display = "block";
      }
      if (statusMsg) {
        statusMsg.innerHTML = '<i class="bi bi-arrow-repeat spin-icon me-1"></i>Requesting GPS coordinates from browser...';
      }

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          btnGeolocate.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Position Locked';
          btnGeolocate.disabled = false;

          var userLat = pos.coords.latitude;
          var userLon = pos.coords.longitude;
          var accuracy = Math.round(pos.coords.accuracy || 25);

          if (coordsBadge) {
            coordsBadge.textContent = "Lat: " + userLat.toFixed(4) + "°, Lon: " + userLon.toFixed(4) + "° (±" + accuracy + "m)";
          }
          if (statusMsg) {
            statusMsg.innerHTML = '<i class="bi bi-geo-alt-fill text-success me-1"></i><strong>Live Geolocation Active:</strong> Position detected successfully.';
          }

          // Update Map User Marker
          if (userMarker) map.removeLayer(userMarker);
          if (userCircle) map.removeLayer(userCircle);

          userMarker = L.marker([userLat, userLon], {
            icon: userIcon,
            zIndexOffset: 1000
          }).addTo(map);

          userMarker.bindPopup(`
            <div class="p-2 text-center">
              <span class="badge bg-primary text-white mb-1"><i class="bi bi-person-fill me-1"></i>Your Current Location</span>
              <div class="small fw-semibold mt-1">Accuracy: within ~${accuracy} meters</div>
            </div>
          `);

          userCircle = L.circle([userLat, userLon], {
            radius: accuracy,
            color: "#0d6efd",
            fillColor: "#0d6efd",
            fillOpacity: 0.12,
            weight: 1
          }).addTo(map);

          // Find Nearest Market
          var closestMarket = null;
          var shortestDist = Infinity;

          allMarkets.forEach(function (m) {
            if (typeof m.latitude === "number" && typeof m.longitude === "number") {
              var d = calculateDistance(userLat, userLon, m.latitude, m.longitude);
              if (d < shortestDist) {
                shortestDist = d;
                closestMarket = m;
              }
            }
          });

          // Draw routing line to nearest market
          if (routingLine) map.removeLayer(routingLine);

          if (closestMarket) {
            routingLine = L.polyline(
              [[userLat, userLon], [closestMarket.latitude, closestMarket.longitude]],
              { color: "#2c6b47", weight: 3, dashArray: "6, 8", opacity: 0.8 }
            ).addTo(map);

            var bounds = L.latLngBounds([
              [userLat, userLon],
              [closestMarket.latitude, closestMarket.longitude]
            ]);
            map.fitBounds(bounds, { padding: [60, 60], animate: true });

            // Populate Nearest Market Bar
            var distText = shortestDist < 1 ? Math.round(shortestDist * 1000) + " m away" : shortestDist.toFixed(1) + " km away";

            if (nearestBox) nearestBox.style.display = "block";
            if (nearestName) nearestName.textContent = closestMarket.name;
            if (nearestDistBadge) nearestDistBadge.textContent = distText;
            if (nearestMeta) {
              nearestMeta.innerHTML = `<i class="bi bi-geo-alt text-danger me-1"></i>${closestMarket.address || closestMarket.location} &bull; <i class="bi bi-calendar-event me-1"></i>${closestMarket.days || "Weekend"}`;
            }
            if (nearestDetailsBtn) {
              nearestDetailsBtn.href = "market-detail.html#" + closestMarket.id;
            }
            if (nearestDirectionsBtn) {
              nearestDirectionsBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${closestMarket.latitude},${closestMarket.longitude}`;
            }

            // Open popup for nearest market
            var targetMarker = marketMarkers.find(function (m) {
              return m.marketData && m.marketData.id === closestMarket.id;
            });
            if (targetMarker) {
              setTimeout(function () { targetMarker.openPopup(); }, 600);
            }
          } else {
            map.setView([userLat, userLon], 14, { animate: true });
          }
        },
        function (err) {
          btnGeolocate.innerHTML = '<i class="bi bi-crosshair me-1"></i>Locate My Position';
          btnGeolocate.disabled = false;

          var errorMsg = "Unable to retrieve your location.";
          if (err.code === 1) errorMsg = "Location access was denied. Showing Karachi central hub.";
          else if (err.code === 2) errorMsg = "Location unavailable. Please check your network or GPS.";
          else if (err.code === 3) errorMsg = "Location request timed out. Showing default Karachi hub.";

          if (statusBox) {
            statusBox.className = "alert alert-warning py-2 px-3 small rounded-3 mb-3";
            statusBox.style.display = "block";
          }
          if (statusMsg) {
            statusMsg.innerHTML = '<i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>' + errorMsg;
          }
          if (coordsBadge) coordsBadge.textContent = "Default: Karachi Central";

          map.setView([KARACHI_HUB.lat, KARACHI_HUB.lng], 13, { animate: true });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  }
});

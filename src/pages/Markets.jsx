import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import MarketCard from "../components/MarketCard";
import marketsData from "../data/markets.json";

const WEEKEND_DAYS = ["Saturday", "Sunday"];

export default function Markets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allMarkets = marketsData.markets || [];

  // Filter state initialized from searchParams if present
  const [searchArea, setSearchArea] = useState(
    searchParams.get("area") || searchParams.get("search") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedDayType, setSelectedDayType] = useState(
    searchParams.get("day")
      ? WEEKEND_DAYS.includes(searchParams.get("day"))
        ? "weekend"
        : "weekday"
      : ""
  );
  const [selectedProduce, setSelectedProduce] = useState(searchParams.get("produce") || "");
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Dynamic filter options
  const locations = useMemo(() => {
    return Array.from(new Set(allMarkets.map((m) => m.location))).sort();
  }, [allMarkets]);

  const produceCategories = useMemo(() => {
    return Array.from(
      new Set(allMarkets.reduce((acc, m) => acc.concat(m.categoryList || []), []))
    ).sort();
  }, [allMarkets]);

  // Filtering
  const filteredMarkets = useMemo(() => {
    const q = searchArea.trim().toLowerCase();

    return allMarkets.filter((m) => {
      if (q) {
        const locMatches = (m.location || "").toLowerCase().includes(q);
        const nameMatches = (m.name || "").toLowerCase().includes(q);
        const addressMatches = (m.address || "").toLowerCase().includes(q);
        if (!locMatches && !nameMatches && !addressMatches) return false;
      }

      if (selectedLocation && m.location !== selectedLocation) return false;
      if (selectedProduce && !(m.categoryList || []).includes(selectedProduce)) return false;
      if (isOrganicOnly && !m.organic) return false;

      if (selectedDayType) {
        const isWeekend = (m.daysList || []).some((d) => WEEKEND_DAYS.includes(d));
        const isWeekday = (m.daysList || []).some((d) => !WEEKEND_DAYS.includes(d));
        if (selectedDayType === "weekend" && !isWeekend) return false;
        if (selectedDayType === "weekday" && !isWeekday) return false;
      }

      return true;
    });
  }, [allMarkets, searchArea, selectedLocation, selectedProduce, isOrganicOnly, selectedDayType]);

  // Sorting
  const sortedMarkets = useMemo(() => {
    const list = [...filteredMarkets];
    switch (sortBy) {
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "location":
        return list.sort((a, b) => a.location.localeCompare(b.location));
      case "rating-desc":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "rating-asc":
        return list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      default:
        return list;
    }
  }, [filteredMarkets, sortBy]);

  const handleReset = () => {
    setSearchArea("");
    setSelectedLocation("");
    setSelectedDayType("");
    setSelectedProduce("");
    setIsOrganicOnly(false);
    setSortBy("default");
    setSearchParams({});
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Market Directory", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Directory</span>
          <h1 className="mt-3">Verified Farmers Markets in Karachi</h1>
          <p className="section-sub mb-0">
            Browse verified neighborhood markets, check operating days and hours, and find where fresh seasonal produce is sold.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          {/* Filter Panel */}
          <div className="filter-box p-4 mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-4 col-lg-3">
                <label className="form-label small fw-semibold" htmlFor="search-area">
                  Search Area / Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-success"></i>
                  </span>
                  <input
                    type="search"
                    id="search-area"
                    className="form-control"
                    placeholder="e.g. Clifton, Gulshan"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label small fw-semibold" htmlFor="filter-location">
                  Location
                </label>
                <select
                  id="filter-location"
                  className="form-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label small fw-semibold" htmlFor="filter-day-type">
                  Day Schedule
                </label>
                <select
                  id="filter-day-type"
                  className="form-select"
                  value={selectedDayType}
                  onChange={(e) => setSelectedDayType(e.target.value)}
                >
                  <option value="">All schedules</option>
                  <option value="weekend">Weekend only</option>
                  <option value="weekday">Weekday only</option>
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label small fw-semibold" htmlFor="filter-produce">
                  Produce Type
                </label>
                <select
                  id="filter-produce"
                  className="form-select"
                  value={selectedProduce}
                  onChange={(e) => setSelectedProduce(e.target.value)}
                >
                  <option value="">All produce</option>
                  {produceCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label small fw-semibold" htmlFor="sort-select">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default order</option>
                  <option value="name-asc">Name (A &rarr; Z)</option>
                  <option value="name-desc">Name (Z &rarr; A)</option>
                  <option value="location">Location</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>

              <div className="col-md-4 col-lg-1 d-flex flex-column justify-content-end">
                <button
                  type="button"
                  id="filter-reset"
                  className="btn btn-outline-secondary w-100"
                  title="Reset all filters"
                  onClick={handleReset}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="filter-organic"
                  checked={isOrganicOnly}
                  onChange={(e) => setIsOrganicOnly(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold" htmlFor="filter-organic">
                  <i className="bi bi-flower1 text-success me-1"></i>Organic produce available only
                </label>
              </div>
              <div className="text-secondary small">
                Showing <strong className="text-success">{sortedMarkets.length}</strong> {sortedMarkets.length === 1 ? "market" : "markets"}
              </div>
            </div>
          </div>

          {/* Results Grid or Empty State */}
          {sortedMarkets.length === 0 ? (
            <div className="col-12">
              <div className="empty-state p-5 text-center bg-white rounded-4 border shadow-sm">
                <div className="fs-1 text-muted mb-2">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <h4 className="h5 fw-bold">
                  No markets found{searchArea ? ` in "${searchArea}"` : ""}
                </h4>
                <p className="text-secondary mb-3">
                  Try adjusting your area search or resetting your filters to see more results.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-green btn-sm"
                  onClick={handleReset}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {sortedMarkets.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

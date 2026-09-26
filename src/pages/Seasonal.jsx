import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import SeasonalCard from "../components/SeasonalCard";
import seasonalData from "../data/seasonal.json";

const SEASONS = [
  { key: "all", label: "All Seasons", icon: "bi-grid-fill" },
  { key: "Summer", label: "Summer", icon: "bi-sun-fill text-warning" },
  { key: "Winter", label: "Winter", icon: "bi-snow text-info" },
  { key: "Spring", label: "Spring", icon: "bi-flower1 text-success" },
  { key: "Autumn", label: "Autumn", icon: "bi-tree-fill text-danger" },
  { key: "Year-round", label: "Year-Round", icon: "bi-arrow-repeat text-primary" }
];

export default function Seasonal() {
  const location = useLocation();
  const allSeasonal = seasonalData.seasonalProduce || [];

  const initialSeason = location.hash ? location.hash.replace("#", "") : "all";
  const [activeSeason, setActiveSeason] = useState(initialSeason);

  const filteredSeasonal = useMemo(() => {
    if (activeSeason.toLowerCase() === "all") return allSeasonal;
    return allSeasonal.filter(
      (item) => item.season.toLowerCase() === activeSeason.toLowerCase()
    );
  }, [allSeasonal, activeSeason]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Seasonal Guide", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Harvest Calendar</span>
          <h1 className="mt-3">Seasonal Produce Guide</h1>
          <p className="section-sub mb-0">
            Discover what's naturally ripe, freshest, and most flavorful in every season across neighborhood farmers markets.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          {/* Season Filter Bar */}
          <div className="filter-box p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <span className="fw-bold small text-muted">
                <i className="bi bi-calendar-range-fill text-success me-1"></i>Filter by Season:
              </span>
              <span className="badge-soft">
                Showing {filteredSeasonal.length}{" "}
                {activeSeason.toLowerCase() === "all" ? "seasonal items" : `${activeSeason} items`}
              </span>
            </div>

            <div className="season-filter-scroll" role="tablist" aria-label="Seasonal Produce Filters">
              {SEASONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`btn btn-season-pill ${activeSeason.toLowerCase() === s.key.toLowerCase() ? "active" : ""}`}
                  onClick={() => setActiveSeason(s.key)}
                >
                  <i className={`bi ${s.icon} me-1`}></i>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid or Empty State */}
          {filteredSeasonal.length === 0 ? (
            <div className="col-12">
              <div className="empty-state p-5 text-center bg-white rounded-4 border shadow-sm">
                <div className="fs-1 text-muted mb-2">
                  <i className="bi bi-sun"></i>
                </div>
                <h4 className="h5 fw-bold">No seasonal crops found under "{activeSeason}"</h4>
                <p className="text-secondary mb-3">
                  Check other seasons or explore the main Produce Guide.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-green btn-sm"
                  onClick={() => setActiveSeason("all")}
                >
                  Show All Seasons
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredSeasonal.map((item) => (
                <SeasonalCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

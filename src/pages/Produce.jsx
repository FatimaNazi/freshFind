import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import ProduceCard from "../components/ProduceCard";
import productsData from "../data/products.json";

const CATEGORIES = [
  { key: "all", label: "All Produce", icon: "bi-grid-fill" },
  { key: "Fruits", label: "Fruits", icon: "bi-apple" },
  { key: "Vegetables", label: "Vegetables", icon: "bi-basket" },
  { key: "Herbs", label: "Herbs", icon: "bi-flower1" },
  { key: "Dairy", label: "Dairy", icon: "bi-cup-hot" },
  { key: "Bakery", label: "Bakery", icon: "bi-cake2" },
  { key: "Meat", label: "Meat & Poultry", icon: "bi-shop" },
  { key: "Pantry", label: "Pantry & Spices", icon: "bi-flower3" }
];

export default function Produce() {
  const location = useLocation();
  const allProducts = productsData.products || [];

  const initialCat = location.hash ? location.hash.replace("#", "") : "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter((p) => {
      if (activeCategory.toLowerCase() === "pantry") {
        return (
          p.category.toLowerCase() === "pantry" || p.category.toLowerCase() === "spices"
        );
      }
      return p.category.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [allProducts, activeCategory]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Produce Guide", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Seasonal produce</span>
          <h1 className="mt-3">Produce Guide</h1>
          <p className="section-sub mb-0">
            Browse common product types, learn their typical season and see markets where they can be found.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          {/* Category Filter Bar */}
          <div className="filter-box p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <span className="fw-bold small text-muted">
                <i className="bi bi-funnel-fill text-success me-1"></i>Filter by Category:
              </span>
              <span className="badge-soft">
                Showing {filteredProducts.length}{" "}
                {activeCategory === "all" ? "produce items" : `${activeCategory} items`}
              </span>
            </div>

            <div className="category-filter-scroll" role="tablist" aria-label="Produce Categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`btn btn-category-pill ${activeCategory.toLowerCase() === cat.key.toLowerCase() ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <i className={`bi ${cat.icon} me-1`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="col-12">
              <div className="empty-state p-5 text-center bg-white rounded-4 border shadow-sm">
                <div className="fs-1 text-muted mb-2">
                  <i className="bi bi-basket2"></i>
                </div>
                <h4 className="h5 fw-bold">No produce listed under "{activeCategory}"</h4>
                <p className="text-secondary mb-3">
                  Check back soon as growers register their seasonal harvest!
                </p>
                <button
                  type="button"
                  className="btn btn-outline-green btn-sm"
                  onClick={() => setActiveCategory("all")}
                >
                  Show All Produce
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((p) => (
                <ProduceCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

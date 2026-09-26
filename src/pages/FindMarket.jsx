import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

export default function FindMarket() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [day, setDay] = useState("");
  const [produce, setProduce] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area.trim()) params.set("area", area.trim());
    if (day) params.set("day", day);
    if (produce) params.set("produce", produce);
    navigate(`/markets?${params.toString()}`);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Find a Market", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Quick Find</span>
          <h1 className="mt-3">Find a Market Near You</h1>
          <p className="section-sub">
            Search by neighborhood, operating day or the type of produce you want to buy.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="filter-box p-4 p-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4 align-items-end">
                <div className="col-lg-4">
                  <label className="form-label fw-semibold" htmlFor="findAreaInput">
                    Area or neighborhood
                  </label>
                  <input
                    id="findAreaInput"
                    className="form-control form-control-lg"
                    placeholder="e.g. Clifton, DHA, Gulshan"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
                <div className="col-lg-3">
                  <label className="form-label fw-semibold" htmlFor="findDaySelect">
                    Day of week
                  </label>
                  <select
                    id="findDaySelect"
                    className="form-select form-select-lg"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                    <option value="">Any day</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>
                <div className="col-lg-3">
                  <label className="form-label fw-semibold" htmlFor="findProduceSelect">
                    Produce type
                  </label>
                  <select
                    id="findProduceSelect"
                    className="form-select form-select-lg"
                    value={produce}
                    onChange={(e) => setProduce(e.target.value)}
                  >
                    <option value="">Any produce</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Herbs</option>
                    <option>Dairy</option>
                    <option>Bakery</option>
                    <option>Spices</option>
                  </select>
                </div>
                <div className="col-lg-2 d-grid">
                  <button className="btn btn-green btn-lg" type="submit">
                    <i className="bi bi-search me-1"></i>Find
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="row g-4 mt-5">
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h3 className="h5">Search by area</h3>
                <p className="text-secondary mb-0">
                  Enter a neighborhood to instantly narrow the market directory.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-calendar3"></i>
                </div>
                <h3 className="h5">Check market days</h3>
                <p className="text-secondary mb-0">
                  Choose a weekday or weekend day to see matching open markets.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-basket2"></i>
                </div>
                <h3 className="h5">Find produce</h3>
                <p className="text-secondary mb-0">
                  Filter by vegetables, fruits, herbs, dairy and seasonal goods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

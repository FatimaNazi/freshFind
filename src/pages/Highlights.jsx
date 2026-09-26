import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import MarketCard from "../components/MarketCard";
import marketsData from "../data/markets.json";

export default function Highlights() {
  const allMarkets = marketsData.markets || [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Market Highlights", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Highlights</span>
          <h1 className="mt-3">This Week's Market Highlights</h1>
          <p className="section-sub">
            Featured markets and seasonal picks presented separately from the main directory.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="row g-4">
            {allMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

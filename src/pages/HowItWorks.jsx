import React from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function HowItWorks() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "How It Works", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">How FreshFind Works</span>
          <h1 className="mt-3">Discover. Save. Share.</h1>
          <p className="section-sub">
            A simple flow for finding local markets and keeping useful produce recommendations.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-1-circle"></i>
                </div>
                <h3 className="h5">1. Search</h3>
                <p className="text-secondary mb-0">
                  Use the Market Directory and Produce Guide to find suitable markets by area and day.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-2-circle"></i>
                </div>
                <h3 className="h5">2. Explore</h3>
                <p className="text-secondary mb-0">
                  Open any market page to see its verified schedule, contact info, and typically available produce.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-3-circle"></i>
                </div>
                <h3 className="h5">3. Bookmark</h3>
                <p className="text-secondary mb-0">
                  Save favorites, attach session-only notes, and download personal guides for offline visits.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="info-card p-4 h-100">
                <div className="product-icon mb-3">
                  <i className="bi bi-4-circle"></i>
                </div>
                <h3 className="h5">4. Share</h3>
                <p className="text-secondary mb-0">
                  Recommend markets or seasonal picks to friends and family via WhatsApp, X, Facebook or Email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

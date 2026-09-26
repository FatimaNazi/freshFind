import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { useToast } from "../components/Toast";

function isValidName(v) {
  return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test((v || "").trim());
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

const RATING_LABELS = {
  1: "1 / 5 (Poor)",
  2: "2 / 5 (Fair)",
  3: "3 / 5 (Good)",
  4: "4 / 5 (Very Good)",
  5: "5 / 5 (Excellent)"
};

export default function Feedback() {
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    feedbackType: "",
    rating: 5,
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const handleStarClick = (ratingVal) => {
    setForm((prev) => ({ ...prev, rating: ratingVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "This field is required.";
    } else if (!isValidName(form.name)) {
      newErrors.name = "Please enter a valid name (letters only, min 2 chars).";
    }

    if (!form.email.trim()) {
      newErrors.email = "This field is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.feedbackType) {
      newErrors.feedbackType = "Please select a feedback type.";
    }

    if (!form.message.trim()) {
      newErrors.message = "This field is required.";
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      feedbackType: true,
      message: true
    });

    if (Object.keys(newErrors).length === 0) {
      setSubmittedData({ ...form });
      addToast("Feedback submitted successfully!", "success");
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setForm({
      name: "",
      email: "",
      feedbackType: "",
      rating: 5,
      message: ""
    });
    setErrors({});
    setTouched({});
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Feedback", active: true }
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <span className="badge-soft">Community Voice</span>
          <h1 className="mt-3">Your Feedback Matters</h1>
          <p className="section-sub mb-0">
            Help us improve FreshFind by rating your experience, suggesting new local markets, or reporting issues.
          </p>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="row g-5">
            {/* Sidebar Info */}
            <div className="col-lg-5">
              <span className="badge-soft">Why Feedback Counts</span>
              <h2 className="section-title mt-3">Help Shape FreshFind</h2>
              <p className="text-secondary">
                FreshFind is designed around neighborhood communities and shoppers like you. Every suggestion helps refine our market schedules and produce guides.
              </p>

              <div className="d-grid gap-3 mt-4">
                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-stars"></i>
                  </div>
                  <div>
                    <strong>Rate Your Experience</strong>
                    <div className="text-secondary small">Tell us how intuitive the directory, search, and chatbot are.</div>
                  </div>
                </div>
                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-shop"></i>
                  </div>
                  <div>
                    <strong>Suggest a Market</strong>
                    <div className="text-secondary small">Know a local weekend bazaar or farmers street stall? Recommend it!</div>
                  </div>
                </div>
                <div className="info-card p-4 d-flex gap-3 align-items-center">
                  <div className="product-icon">
                    <i className="bi bi-bug"></i>
                  </div>
                  <div>
                    <strong>Report Website Issues</strong>
                    <div className="text-secondary small">Spot an incorrect phone number, outdated hours, or display glitch?</div>
                  </div>
                </div>
              </div>

              <div className="alert alert-light border small text-muted mt-4">
                <i className="bi bi-envelope me-1"></i>Need direct inquiry instead? Visit our{" "}
                <a href="/contact" className="text-success fw-bold text-decoration-underline">
                  Contact Page
                </a>
                .
              </div>
            </div>

            {/* Feedback Form / Success Card */}
            <div className="col-lg-7">
              <div className="info-card p-4 p-lg-5 shadow-sm border rounded-4" id="feedbackFormCard">
                {!submittedData ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge-soft">
                        <i className="bi bi-chat-heart me-1"></i>Interactive Feedback
                      </span>
                      <span className="small text-muted">* Client-side validated</span>
                    </div>
                    <h2 className="h3 mt-2 mb-1 fw-bold">Send Your Feedback</h2>
                    <p className="text-secondary small mb-4">
                      Please fill out the form below. Your input helps us provide better local produce discovery.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row g-3">
                        {/* Full Name */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold" htmlFor="feedbackName">
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${touched.name ? (errors.name ? "is-invalid" : "is-valid") : ""}`}
                            id="feedbackName"
                            placeholder="e.g. Ayesha Khan"
                            autoComplete="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold" htmlFor="feedbackEmail">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${touched.email ? (errors.email ? "is-invalid" : "is-valid") : ""}`}
                            id="feedbackEmail"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Feedback Type */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold" htmlFor="feedbackType">
                            Feedback Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${touched.feedbackType ? (errors.feedbackType ? "is-invalid" : "is-valid") : ""}`}
                            id="feedbackType"
                            value={form.feedbackType}
                            onChange={(e) => setForm({ ...form, feedbackType: e.target.value })}
                          >
                            <option value="">Choose feedback type...</option>
                            <option value="General Feedback">General Feedback</option>
                            <option value="Website Issue">Website Issue</option>
                            <option value="Market Information">Market Information</option>
                            <option value="Product Information">Product Information</option>
                            <option value="Suggestion">Suggestion</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.feedbackType && (
                            <div className="invalid-feedback">{errors.feedbackType}</div>
                          )}
                        </div>

                        {/* Experience Rating (1-5 stars) */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Experience Rating</label>
                          <div className="star-rating-selector d-flex align-items-center gap-2 pt-1">
                            <div className="star-buttons d-flex gap-1" role="radiogroup" aria-label="Rate from 1 to 5 stars">
                              {[1, 2, 3, 4, 5].map((starNum) => (
                                <button
                                  key={starNum}
                                  type="button"
                                  className={`btn btn-sm btn-outline-warning star-btn ${form.rating >= starNum ? "active" : ""}`}
                                  aria-label={`${starNum} star`}
                                  onClick={() => handleStarClick(starNum)}
                                >
                                  <i className="bi bi-star-fill"></i>
                                </button>
                              ))}
                            </div>
                            <span className="small fw-bold text-muted ms-2">
                              {RATING_LABELS[form.rating]}
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="col-12">
                          <label className="form-label fw-semibold" htmlFor="feedbackMessage">
                            Your Feedback / Message <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`form-control ${touched.message ? (errors.message ? "is-invalid" : "is-valid") : ""}`}
                            id="feedbackMessage"
                            rows="5"
                            placeholder="Share your experience, feature ideas, or market details here..."
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                          ></textarea>
                          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                        </div>

                        {/* Submit Button */}
                        <div className="col-12 mt-4">
                          <button className="btn btn-green w-100 py-2 fs-6 fw-bold" type="submit">
                            <i className="bi bi-send-check me-2"></i>Submit Feedback
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="p-4 p-md-5 text-center rounded-4 border bg-white shadow-sm">
                    <div className="text-success fs-1 mb-2">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <h3 className="fw-bold">Thank You for Your Feedback!</h3>
                    <p className="text-secondary mb-3">
                      Your response has been noted and recorded locally for this session.
                    </p>

                    <div className="card bg-light border-0 p-3 text-start small mb-4">
                      <div>
                        <strong>Sender:</strong> {submittedData.name} ({submittedData.email})
                      </div>
                      <div>
                        <strong>Category:</strong> {submittedData.feedbackType}
                      </div>
                      <div>
                        <strong>Rating:</strong> {RATING_LABELS[submittedData.rating]}
                      </div>
                      <div className="mt-2">
                        <strong>Feedback Message:</strong>
                      </div>
                      <div className="text-muted fst-italic mt-1">{submittedData.message}</div>
                    </div>

                    <div className="alert alert-light border small text-muted mb-4 py-2">
                      <i className="bi bi-shield-check text-success me-1"></i>This is a frontend demonstration project &mdash; no server API call was dispatched.
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-green"
                      onClick={handleReset}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i>Submit Another Response
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

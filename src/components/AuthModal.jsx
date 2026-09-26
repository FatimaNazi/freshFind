import React, { useState, useEffect } from "react";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";

function isValidName(v) {
  return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test((v || "").trim());
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

function isValidPhone(v) {
  const val = (v || "").trim();
  const digits = val.replace(/[^0-9]/g, "");
  return /^[0-9+\-\s()]{7,20}$/.test(val) && digits.length >= 7;
}

export default function AuthModal() {
  const { authMode, closeAuth, setAuthMode } = useModals();
  const { addToast } = useToast();

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupTouched, setSignupTouched] = useState({});

  useEffect(() => {
    // Reset forms whenever modal opens or switches
    setLoginErrors({});
    setLoginTouched({});
    setSignupErrors({});
    setSignupTouched({});
  }, [authMode]);

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && authMode) {
        closeAuth();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authMode, closeAuth]);

  if (!authMode) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = "This field is required.";
    } else if (!isValidEmail(loginForm.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!loginForm.password) {
      errors.password = "This field is required.";
    } else if (loginForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setLoginErrors(errors);
    setLoginTouched({ email: true, password: true });

    if (Object.keys(errors).length === 0) {
      closeAuth();
      setLoginForm({ email: "", password: "" });
      addToast("Logged in successfully! (Demo simulation — no server session created)", "success");
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!signupForm.name.trim()) {
      errors.name = "This field is required.";
    } else if (!isValidName(signupForm.name)) {
      errors.name = "Please enter a valid name (letters only, min 2 chars).";
    }

    if (!signupForm.email.trim()) {
      errors.email = "This field is required.";
    } else if (!isValidEmail(signupForm.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!signupForm.phone.trim()) {
      errors.phone = "This field is required.";
    } else if (!isValidPhone(signupForm.phone)) {
      errors.phone = "Please enter a valid phone number (at least 7 digits).";
    }

    if (!signupForm.password) {
      errors.password = "This field is required.";
    } else if (signupForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!signupForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (signupForm.confirmPassword !== signupForm.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setSignupErrors(errors);
    setSignupTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    if (Object.keys(errors).length === 0) {
      closeAuth();
      setSignupForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });
      addToast("Account registered successfully! (Demo simulation — no server storage)", "success");
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAuth();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            {authMode === "login" ? (
              /* LOGIN MODAL */
              <div>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-box-arrow-in-right text-success me-2"></i>
                    Log in to FreshFind
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeAuth}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-secondary small">
                    This is a demo login for this frontend project &mdash; no account is actually accessed.
                  </p>
                  <form onSubmit={handleLoginSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email address</label>
                      <input
                        type="email"
                        className={`form-control ${loginTouched.email ? (loginErrors.email ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="you@example.com"
                        autoComplete="username"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      />
                      {loginErrors.email && (
                        <div className="invalid-feedback">{loginErrors.email}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className={`form-control ${loginTouched.password ? (loginErrors.password ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="Your password"
                        autoComplete="current-password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                      {loginErrors.password && (
                        <div className="invalid-feedback">{loginErrors.password}</div>
                      )}
                    </div>
                    <button type="submit" className="btn btn-green w-100 py-2">
                      Log In
                    </button>
                    <div className="text-center mt-3 pt-3 border-top">
                      <span className="text-secondary small">Don't have an account?</span>
                      <button
                        type="button"
                        className="btn btn-link text-success p-0 ms-1 fw-bold text-decoration-none small"
                        onClick={() => setAuthMode("signup")}
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* SIGNUP MODAL */
              <div>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-person-plus text-success me-2"></i>
                    Create a FreshFind account
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeAuth}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-secondary small">
                    Demo sign up only &mdash; no account or private data is stored on a server.
                  </p>
                  <form onSubmit={handleSignupSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Full name</label>
                      <input
                        type="text"
                        className={`form-control ${signupTouched.name ? (signupErrors.name ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="Your full name"
                        autoComplete="name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      />
                      {signupErrors.name && (
                        <div className="invalid-feedback">{signupErrors.name}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email address</label>
                      <input
                        type="email"
                        className={`form-control ${signupTouched.email ? (signupErrors.email ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      />
                      {signupErrors.email && (
                        <div className="invalid-feedback">{signupErrors.email}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Phone number</label>
                      <input
                        type="tel"
                        className={`form-control ${signupTouched.phone ? (signupErrors.phone ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="0300 1234567"
                        autoComplete="tel"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      />
                      {signupErrors.phone && (
                        <div className="invalid-feedback">{signupErrors.phone}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className={`form-control ${signupTouched.password ? (signupErrors.password ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      />
                      {signupErrors.password && (
                        <div className="invalid-feedback">{signupErrors.password}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Confirm password</label>
                      <input
                        type="password"
                        className={`form-control ${signupTouched.confirmPassword ? (signupErrors.confirmPassword ? "is-invalid" : "is-valid") : ""}`}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      />
                      {signupErrors.confirmPassword && (
                        <div className="invalid-feedback">{signupErrors.confirmPassword}</div>
                      )}
                    </div>
                    <button type="submit" className="btn btn-green w-100 py-2">
                      Sign Up
                    </button>
                    <div className="text-center mt-3 pt-3 border-top">
                      <span className="text-secondary small">Already have an account?</span>
                      <button
                        type="button"
                        className="btn btn-link text-success p-0 ms-1 fw-bold text-decoration-none small"
                        onClick={() => setAuthMode("login")}
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

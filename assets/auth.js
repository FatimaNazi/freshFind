var authHost = document.createElement("div");
document.body.appendChild(authHost);

authHost.innerHTML = `
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-light">
          <h5 class="modal-title fw-bold" id="loginModalTitle"><i class="bi bi-box-arrow-in-right text-success me-2"></i>Log in to FreshFind</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <p class="text-secondary small">This is a demo login for this frontend project &mdash; no account is actually accessed.</p>
          <form id="loginForm" novalidate>
            <div class="mb-3">
              <label class="form-label fw-semibold">Email address</label>
              <input type="email" class="form-control" data-validate="required,email" placeholder="you@example.com" autocomplete="username">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Password</label>
              <input type="password" class="form-control" data-validate="required,password" placeholder="Your password" autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-green w-100 py-2">Log In</button>
            <div class="text-center mt-3 pt-3 border-top">
              <span class="text-secondary small">Don't have an account?</span>
              <button type="button" class="btn btn-link text-success p-0 ms-1 fw-bold text-decoration-none small" data-bs-target="#signupModal" data-bs-toggle="modal">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="signupModal" tabindex="-1" aria-labelledby="signupModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-light">
          <h5 class="modal-title fw-bold" id="signupModalTitle"><i class="bi bi-person-plus text-success me-2"></i>Create a FreshFind account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <p class="text-secondary small">Demo sign up only &mdash; no account or private data is stored on a server.</p>
          <form id="signupForm" novalidate>
            <div class="mb-3">
              <label class="form-label fw-semibold">Full name</label>
              <input type="text" class="form-control" data-validate="required,name" placeholder="Your full name" autocomplete="name">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Email address</label>
              <input type="email" class="form-control" data-validate="required,email" placeholder="you@example.com" autocomplete="email">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Phone number</label>
              <input type="tel" class="form-control" data-validate="required,phone" placeholder="0300 1234567" autocomplete="tel">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Password</label>
              <input type="password" class="form-control" data-validate="required,password" placeholder="At least 6 characters" autocomplete="new-password">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Confirm password</label>
              <input type="password" class="form-control" data-validate="required,confirm-password" placeholder="Re-enter password" autocomplete="new-password">
            </div>
            <button type="submit" class="btn btn-green w-100 py-2">Sign Up</button>
            <div class="text-center mt-3 pt-3 border-top">
              <span class="text-secondary small">Already have an account?</span>
              <button type="button" class="btn btn-link text-success p-0 ms-1 fw-bold text-decoration-none small" data-bs-target="#loginModal" data-bs-toggle="modal">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

// Helper to reset modal validation classes
function resetFormValidationClasses(form) {
  if (!form) return;
  form.reset();
  form.querySelectorAll(".is-invalid, .is-valid").forEach(function (el) {
    el.classList.remove("is-invalid", "is-valid");
  });
  form.querySelectorAll(".invalid-feedback").forEach(function (el) {
    el.textContent = "";
  });
}

var loginModalEl = document.getElementById("loginModal");
var signupModalEl = document.getElementById("signupModal");

if (loginModalEl) {
  loginModalEl.addEventListener("hidden.bs.modal", function () {
    resetFormValidationClasses(document.getElementById("loginForm"));
  });
}

if (signupModalEl) {
  signupModalEl.addEventListener("hidden.bs.modal", function () {
    resetFormValidationClasses(document.getElementById("signupForm"));
  });
}

attachFormValidation(document.getElementById("loginForm"), function (form) {
  var modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
  if (modal) modal.hide();
  resetFormValidationClasses(form);
  showFormToast("Logged in successfully! (Demo simulation &mdash; no server session created)");
});

attachFormValidation(document.getElementById("signupForm"), function (form) {
  var modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
  if (modal) modal.hide();
  resetFormValidationClasses(form);
  showFormToast("Account registered successfully! (Demo simulation &mdash; no server storage)");
});

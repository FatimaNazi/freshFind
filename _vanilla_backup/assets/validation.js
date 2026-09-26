// Reusable validation helpers used by the contact forms, feedback forms, and the
// Login / Sign Up modals. No backend involved - this performs full frontend validation
// and applies standard Bootstrap 5 validation states.

function isValidName(value) {
  value = (value || "").trim();
  // Letters, spaces, apostrophes and hyphens only; min 2 characters
  return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test(value);
}

function isValidEmail(value) {
  value = (value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  value = (value || "").trim();
  if (!value) return false;
  var digits = value.replace(/[^0-9]/g, "");
  return /^[0-9+\-\s()]{7,20}$/.test(value) && digits.length >= 7;
}

function setFieldError(input, message) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  var parent = input.parentElement;
  var feedback = parent.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    parent.appendChild(feedback);
  }
  feedback.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  var parent = input.parentElement;
  var feedback = parent.querySelector(".invalid-feedback");
  if (feedback) feedback.textContent = "";
}

// Validates a single field based on its data-validate attribute.
// Supported values: required, name, email, phone, password, confirm-password
function validateField(input, form) {
  var rulesStr = input.getAttribute("data-validate") || "";
  var rules = rulesStr.split(",").map(function (r) { return r.trim(); }).filter(Boolean);
  if (!rules.length) return true;

  var value = input.value.trim();

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];

    if (rule === "required" && !value) {
      setFieldError(input, "This field is required.");
      return false;
    }
    if (rule === "name" && value && !isValidName(value)) {
      setFieldError(input, "Please enter a valid name (letters only, min 2 chars).");
      return false;
    }
    if (rule === "email" && value && !isValidEmail(value)) {
      setFieldError(input, "Please enter a valid email address.");
      return false;
    }
    if (rule === "phone" && value && !isValidPhone(value)) {
      setFieldError(input, "Please enter a valid phone number (at least 7 digits).");
      return false;
    }
    if (rule === "password" && value && value.length < 6) {
      setFieldError(input, "Password must be at least 6 characters.");
      return false;
    }
    if (rule === "confirm-password") {
      if (!value) {
        setFieldError(input, "Please confirm your password.");
        return false;
      }
      if (form) {
        var original = form.querySelector('input[type="password"]:not([data-validate*="confirm-password"]), input[name="password"]');
        if (original && value !== original.value) {
          setFieldError(input, "Passwords do not match.");
          return false;
        }
      }
    }
  }

  clearFieldError(input);
  return true;
}

function validateForm(form) {
  if (!form) return false;
  var fields = form.querySelectorAll("[data-validate]");
  var isValid = true;
  fields.forEach(function (field) {
    if (!validateField(field, form)) {
      isValid = false;
    }
  });
  return isValid;
}

// Wires live + submit validation onto a form, and calls onSuccess()
// once every field passes.
function attachFormValidation(form, onSuccess) {
  if (!form) return;

  var fields = form.querySelectorAll("[data-validate]");
  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      validateField(field, form);
      // If editing primary password, revalidate confirm-password if present
      if (field.type === "password" && field.getAttribute("data-validate").indexOf("confirm-password") === -1) {
        var confirmField = form.querySelector('[data-validate*="confirm-password"]');
        if (confirmField && confirmField.value) {
          validateField(confirmField, form);
        }
      }
    });

    field.addEventListener("blur", function () {
      validateField(field, form);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm(form)) {
      if (typeof onSuccess === "function") onSuccess(form);
    }
  });
}

function showFormToast(message) {
  var toastBox = document.querySelector(".toast-box");
  if (!toastBox) {
    toastBox = document.createElement("div");
    toastBox.className = "toast-box";
    document.body.appendChild(toastBox);
  }
  toastBox.innerHTML = '<div class="alert alert-success shadow mb-0 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill"></i><span>' + message + '</span></div>';
  toastBox.style.display = "block";
  clearTimeout(toastBox._hideTimer);
  toastBox._hideTimer = setTimeout(function () { toastBox.style.display = "none"; }, 4000);
}

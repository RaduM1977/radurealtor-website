(function () {
  "use strict";

  var config = window.WEBSITE_LEAD_FORM_CONFIG || {};
  var form = document.getElementById("buyer-form");
  var status = document.getElementById("gateway-status");
  var submitButton = document.getElementById("submit-button");
  var recaptchaToken = "";
  var widgetId = null;
  var phone = form && form.elements.phone;
  var contactMethod = form && form.elements.contactMethod;
  var phoneRequirement = document.getElementById("phone-requirement");
  var phoneHelp = document.getElementById("phone-help");

  if (!form || !status || !submitButton) return;

  function showStatus(message, isError) {
    status.textContent = message;
    status.className = "gateway-status is-visible" + (isError ? " is-error" : " is-success");
    status.setAttribute("tabindex", "-1");
    if (status.scrollIntoView) status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (status.focus) status.focus({ preventScroll: true });
  }

  function clearStatus() {
    status.textContent = "";
    status.className = "gateway-status";
    status.removeAttribute("tabindex");
  }

  function setFieldError(field, invalid) {
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function getUtmValues() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || "direct",
      utmMedium: params.get("utm_medium") || "direct",
      utmCampaign: params.get("utm_campaign") || "direct",
      utmContent: params.get("utm_content") || "not provided"
    };
  }

  function phoneDigits(value) {
    var digits = String(value || "").replace(/\D/g, "");
    return digits.length === 11 && digits.charAt(0) === "1" ? digits.slice(1) : digits;
  }

  function isPhoneRequired() {
    return contactMethod.value === "phone" || contactMethod.value === "text";
  }

  function isValidPhone(value) {
    return phoneDigits(value).length === 10;
  }

  function formatPhone(value) {
    var digits = phoneDigits(value).slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function updatePhoneRequirement() {
    var required = isPhoneRequired();
    phone.required = required;
    phone.setAttribute("aria-required", required ? "true" : "false");
    phoneRequirement.textContent = required ? "(required for your selected contact method)" : "(optional unless you choose phone or text)";
    phoneHelp.textContent = required
      ? "Enter a 10-digit U.S. number, for example (312) 555-0123."
      : "Use a 10-digit U.S. number, for example (312) 555-0123. It is only required when you choose phone or text.";
  }

  function validateForm() {
    var name = form.elements.name;
    var email = form.elements.email;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var valid = true;

    [name, email, contactMethod, phone].forEach(function (field) { setFieldError(field, false); });
    if (!name.value.trim()) { setFieldError(name, true); valid = false; }
    if (!emailPattern.test(email.value.trim())) { setFieldError(email, true); valid = false; }
    if (!contactMethod.value) { setFieldError(contactMethod, true); valid = false; }
    if (phone.value.trim() && !isValidPhone(phone.value)) {
      setFieldError(phone, true); valid = false;
    }
    if (isPhoneRequired() && !isValidPhone(phone.value)) {
      setFieldError(phone, true); valid = false;
    }
    return valid;
  }

  function buildPayload() {
    var utm = getUtmValues();
    return {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      contactMethod: form.elements.contactMethod.value,
      areas: form.elements.areas.value.trim(),
      timeline: form.elements.timeline.value,
      financing: form.elements.financing.value,
      budget: form.elements.budget.value.trim(),
      message: form.elements.message.value.trim(),
      emailUpdates: "no",
      honeypot: form.elements.website.value.trim(),
      recaptchaToken: recaptchaToken,
      source: config.leadSource,
      type: config.leadType,
      landingPage: window.location.pathname,
      privacyNoticeVersion: config.privacyNoticeVersion,
      language: document.documentElement.lang || "en",
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent
    };
  }

  function resetRecaptcha() {
    recaptchaToken = "";
    if (widgetId !== null && window.grecaptcha) window.grecaptcha.reset(widgetId);
  }

  function renderRecaptcha() {
    if (!config.recaptchaSiteKey || !window.grecaptcha) return false;
    widgetId = window.grecaptcha.render("recaptcha-widget", {
      sitekey: config.recaptchaSiteKey,
      callback: function (token) { recaptchaToken = token; clearStatus(); },
      "expired-callback": function () { recaptchaToken = ""; showStatus("Spam protection expired. Please check the box again before submitting.", true); },
      "error-callback": function () { recaptchaToken = ""; showStatus("Spam protection could not load. Please try again later or email Radu directly.", true); }
    });
    return true;
  }

  function waitForRecaptcha(attempt) {
    if (renderRecaptcha()) return;
    if (attempt < 30 && config.recaptchaSiteKey) {
      window.setTimeout(function () { waitForRecaptcha(attempt + 1); }, 250);
    }
  }

  if (!config.endpoint || !config.recaptchaSiteKey) {
    submitButton.disabled = true;
    showStatus("The secure request form is being prepared. Please email Radu directly at radu.realtor@yahoo.com.", false);
  } else {
    waitForRecaptcha(0);
  }

  contactMethod.addEventListener("change", updatePhoneRequirement);
  phone.addEventListener("input", function () {
    var cursorAtEnd = phone.selectionStart === phone.value.length;
    phone.value = formatPhone(phone.value);
    if (cursorAtEnd) phone.setSelectionRange(phone.value.length, phone.value.length);
  });
  updatePhoneRequirement();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    if (!config.endpoint || !config.recaptchaSiteKey) {
      showStatus("The secure request form is not active yet. Please email Radu directly at radu.realtor@yahoo.com.", true);
      return;
    }
    if (!validateForm()) {
      showStatus("Please complete the required fields. Phone or text replies require a valid 10-digit U.S. phone number.", true);
      return;
    }
    if (!recaptchaToken) {
      showStatus("Please complete the spam-protection check before submitting.", true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending your request…";

    window.fetch(config.endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(buildPayload()),
      keepalive: true
    }).then(function () {
      form.reset();
      updatePhoneRequirement();
      resetRecaptcha();
      showStatus("Thank you — your buyer-planning request was sent. Radu will follow up using your selected contact method.", false);
      submitButton.textContent = "Request Buyer Planning Help";
      submitButton.disabled = false;
    }).catch(function () {
      resetRecaptcha();
      showStatus("Your request could not be sent. Please email Radu directly at radu.realtor@yahoo.com.", true);
      submitButton.textContent = "Request Buyer Planning Help";
      submitButton.disabled = false;
    });
  });
}());

(function () {
  "use strict";

  var config = window.WEBSITE_LEAD_FORM_CONFIG || {};
  var form = document.getElementById("buyer-form");
  var status = document.getElementById("gateway-status");
  var submitButton = document.getElementById("submit-button");
  var turnstileToken = "";
  var widgetId = null;

  if (!form || !status || !submitButton) return;

  function showStatus(message, isError) {
    status.textContent = message;
    status.className = "gateway-status is-visible" + (isError ? " is-error" : "");
  }

  function clearStatus() {
    status.textContent = "";
    status.className = "gateway-status";
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

  function validateForm() {
    var name = form.elements.name;
    var email = form.elements.email;
    var contactMethod = form.elements.contactMethod;
    var phone = form.elements.phone;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var valid = true;

    [name, email, contactMethod, phone].forEach(function (field) { setFieldError(field, false); });
    if (!name.value.trim()) { setFieldError(name, true); valid = false; }
    if (!emailPattern.test(email.value.trim())) { setFieldError(email, true); valid = false; }
    if (!contactMethod.value) { setFieldError(contactMethod, true); valid = false; }
    if ((contactMethod.value === "phone" || contactMethod.value === "text") && !phone.value.trim()) {
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
      emailUpdates: form.elements.emailUpdates.checked ? "yes" : "no",
      honeypot: form.elements.website.value.trim(),
      turnstileToken: turnstileToken,
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

  function resetTurnstile() {
    turnstileToken = "";
    if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
  }

  function renderTurnstile() {
    if (!config.turnstileSiteKey || !window.turnstile) return false;
    widgetId = window.turnstile.render("#turnstile-widget", {
      sitekey: config.turnstileSiteKey,
      callback: function (token) { turnstileToken = token; clearStatus(); },
      "expired-callback": function () { turnstileToken = ""; },
      "error-callback": function () { turnstileToken = ""; showStatus("Spam protection could not load. Please try again later or email Radu directly.", true); }
    });
    return true;
  }

  function waitForTurnstile(attempt) {
    if (renderTurnstile()) return;
    if (attempt < 30 && config.turnstileSiteKey) {
      window.setTimeout(function () { waitForTurnstile(attempt + 1); }, 250);
    }
  }

  if (!config.endpoint || !config.turnstileSiteKey) {
    submitButton.disabled = true;
    showStatus("The secure request form is being prepared. Please email Radu directly at radu.realtor@yahoo.com.", false);
  } else {
    waitForTurnstile(0);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    if (!config.endpoint || !config.turnstileSiteKey) {
      showStatus("The secure request form is not active yet. Please email Radu directly at radu.realtor@yahoo.com.", true);
      return;
    }
    if (!validateForm()) {
      showStatus("Please complete the required fields and provide a phone number if you selected phone or text.", true);
      return;
    }
    if (!turnstileToken) {
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
      resetTurnstile();
      showStatus("Thank you — your request has been received. Radu will follow up using your selected contact method.", false);
      submitButton.textContent = "Request Buyer Planning Help";
      submitButton.disabled = false;
    }).catch(function () {
      resetTurnstile();
      showStatus("Your request could not be sent. Please email Radu directly at radu.realtor@yahoo.com.", true);
      submitButton.textContent = "Request Buyer Planning Help";
      submitButton.disabled = false;
    });
  });
}());

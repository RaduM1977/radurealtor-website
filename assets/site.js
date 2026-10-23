/* radurealtor.com — small progressive enhancements for the static homepage.
 * The page is fully readable without JavaScript; this only adds the sticky
 * nav background, the mobile menu, section highlighting and form submission.
 */
(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var NAV_SOLID = ["bg-[#1B2A4A]/95", "backdrop-blur-md", "shadow-lg"];

  function updateNav() {
    var solid = window.scrollY > 50 || document.body.classList.contains("menu-open");
    NAV_SOLID.forEach(function (c) { nav.classList.toggle(c, solid); });
    nav.classList.toggle("bg-transparent", !solid);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // Mobile menu
  var toggle = document.getElementById("menu-toggle");
  var panel = document.getElementById("mobile-menu");
  var ICON_OPEN = '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>';
  var ICON_CLOSE = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';

  function setMenu(open) {
    panel.classList.toggle("hidden", !open);
    panel.classList.toggle("flex", open);
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("svg").innerHTML = open ? ICON_CLOSE : ICON_OPEN;
    updateNav();
  }
  toggle.addEventListener("click", function () { setMenu(panel.classList.contains("hidden")); });
  panel.querySelectorAll("a[href^='#']").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  // Highlight the nav link of the section in view
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

  function updateActive() {
    var current = sections[0];
    sections.forEach(function (s) { if (s && s.getBoundingClientRect().top <= 120) current = s; });
    links.forEach(function (a) {
      var active = current && a.getAttribute("href") === "#" + current.id;
      var desktop = a.hasAttribute("data-desktop");
      a.classList.toggle("text-[#C9A84C]", active);
      a.classList.toggle("text-white/80", !active);
      if (desktop) {
        a.classList.toggle("hover:text-white", !active);
        var bar = a.querySelector("[data-active-bar]");
        if (bar) bar.classList.toggle("hidden", !active);
      }
    });
  }
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  // Contact form: sent through the Website Lead Gateway (Google Apps Script) to
  // Top Producer, like the buyer-planning form. The CRM address stays server-side.
  var config = window.WEBSITE_LEAD_FORM_CONFIG || {};
  var INTEREST = {
    buying: "Buying a Home",
    selling: "Selling a Home",
    investing: "Investment Property",
    "first-time": "First-Time Buyer",
    renting: "Renting (landlord or tenant)",
    other: "Other"
  };

  var form = document.getElementById("contact-form");
  if (!form) return; // pages without the contact form (about, faq)
  var status = document.getElementById("contact-status");
  var button = form.querySelector("button[type=submit]");

  function showStatus(message, ok) {
    status.textContent = message;
    status.classList.remove("hidden");
    status.classList.toggle("text-[#C9A84C]", ok);
    status.classList.toggle("is-error", !ok);
  }

  // After a successful send the form is replaced by a confirmation panel
  var success = document.getElementById("contact-success");
  function showSuccess(on) {
    form.classList.toggle("hidden", on);
    success.classList.toggle("hidden", !on);
    if (on) {
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: "smooth", block: "start" }); // scroll-margin keeps it below the fixed nav
    }
  }
  document.getElementById("contact-again").addEventListener("click", function () {
    status.classList.add("hidden");
    showSuccess(false);
    form.elements.name.focus();
  });

  // Phone: digits only, formatted as (312) 555-0123, same rules as the buyer form
  var phone = form.elements.phone;
  function phoneDigits(value) {
    var digits = String(value || "").replace(/\D/g, "");
    return digits.length === 11 && digits.charAt(0) === "1" ? digits.slice(1) : digits;
  }
  function formatPhone(value) {
    var digits = phoneDigits(value).slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }
  phone.addEventListener("input", function () {
    var cursorAtEnd = phone.selectionStart === phone.value.length;
    phone.value = formatPhone(phone.value);
    if (cursorAtEnd) phone.setSelectionRange(phone.value.length, phone.value.length);
  });

  function validationError() {
    var fields = form.elements;
    [fields.name, fields.phone, fields.message].forEach(function (f) { f.removeAttribute("aria-invalid"); });
    if (!fields.name.value.trim()) {
      fields.name.setAttribute("aria-invalid", "true"); fields.name.focus();
      return "Please enter your name.";
    }
    if (fields.phone.value.trim() && phoneDigits(fields.phone.value).length !== 10) {
      fields.phone.setAttribute("aria-invalid", "true"); fields.phone.focus();
      return "Please enter a 10-digit U.S. phone number, for example (312) 555-0123, or leave the phone field empty.";
    }
    if (!fields.message.value.trim()) {
      fields.message.setAttribute("aria-invalid", "true"); fields.message.focus();
      return "Please enter a message.";
    }
    return "";
  }

  // Google reCAPTCHA v2 checkbox (same site key as the buyer-planning page)
  var recaptchaToken = "";
  var widgetId = null;

  function renderRecaptcha(attempt) {
    if (!config.recaptchaSiteKey) return;
    if (!window.grecaptcha || !window.grecaptcha.render) {
      if (attempt < 40) window.setTimeout(function () { renderRecaptcha(attempt + 1); }, 250);
      return;
    }
    widgetId = window.grecaptcha.render("contact-recaptcha", {
      sitekey: config.recaptchaSiteKey,
      theme: "dark",
      callback: function (token) { recaptchaToken = token; status.classList.add("hidden"); },
      "expired-callback": function () { recaptchaToken = ""; showStatus("Spam protection expired. Please check the box again.", false); },
      "error-callback": function () { recaptchaToken = ""; showStatus("Spam protection could not load. Please call (773) 860-7617 or email radu.realtor@yahoo.com.", false); }
    });
  }
  renderRecaptcha(0);

  function utm(key) {
    return new URLSearchParams(window.location.search).get(key) || "direct";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!config.endpoint || !config.recaptchaSiteKey) {
      showStatus("The form is unavailable right now. Please call (773) 860-7617 or email radu.realtor@yahoo.com.", false);
      return;
    }
    var problem = validationError();
    if (problem) {
      showStatus(problem, false);
      return;
    }
    if (!recaptchaToken) {
      showStatus("Please complete the spam-protection check before sending.", false);
      return;
    }

    var data = new FormData(form);
    var choice = data.get("interest");
    var payload = {
      form: "homepage-contact",
      source: "Website - Contact",
      type: choice === "selling" ? "Seller" : "Buyer",
      interest: INTEREST[choice] || choice,
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      contactMethod: "email",
      message: String(data.get("message") || "").trim(),
      honeypot: String(data.get("website") || "").trim(),
      recaptchaToken: recaptchaToken,
      emailUpdates: "no",
      landingPage: window.location.pathname,
      privacyNoticeVersion: config.privacyNoticeVersion,
      language: document.documentElement.lang || "en",
      utmSource: utm("utm_source"),
      utmMedium: utm("utm_medium"),
      utmCampaign: utm("utm_campaign"),
      utmContent: new URLSearchParams(window.location.search).get("utm_content") || "not provided"
    };

    button.disabled = true;
    status.classList.add("hidden");

    // Apps Script web apps send no CORS headers, so the response can't be read;
    // a completed request means it was handed to the gateway for processing.
    fetch(config.endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      keepalive: true
    }).then(function () {
      form.reset();
      showSuccess(true);
    }).catch(function () {
      showStatus("Sorry, your message could not be sent. Please call (773) 860-7617 or email radu.realtor@yahoo.com.", false);
    }).then(function () {
      recaptchaToken = "";
      if (widgetId !== null && window.grecaptcha) window.grecaptcha.reset(widgetId);
      button.disabled = false;
    });
  });
})();

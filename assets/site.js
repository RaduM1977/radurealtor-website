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

  // Contact form: same destinations as the previous site (HubSpot form + Web3Forms copy)
  var HUBSPOT_URL = "https://api.hsforms.com/submissions/v3/integration/submit/246248752/8f774b7e-ff82-44ad-b5a2-a879f6566436";
  var WEB3FORMS_KEY = "92f27588-5354-4749-8da6-e99a165d9b38";
  var CC_EMAIL = "radu.muresan@myleads.io";
  var INTEREST = {
    buying: "Buying a Home",
    selling: "Selling a Home",
    investing: "Investment Property",
    "first-time": "First-Time Buyer",
    other: "Other"
  };

  var form = document.getElementById("contact-form");
  var status = document.getElementById("contact-status");
  var button = form.querySelector("button[type=submit]");

  function showStatus(message, ok) {
    status.textContent = message;
    status.classList.remove("hidden");
    status.classList.toggle("text-[#C9A84C]", ok);
    status.style.color = ok ? "" : "#fca5a5";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var parts = name.split(/\s+/);
    var interest = INTEREST[data.get("interest")] || data.get("interest");
    var phone = String(data.get("phone") || "").trim();
    var message = String(data.get("message") || "").trim();

    var hubspot = {
      fields: [
        { name: "firstname", value: parts[0] || "" },
        { name: "lastname", value: parts.slice(1).join(" ") },
        { name: "email", value: data.get("email") },
        { name: "phone", value: phone },
        { name: "message", value: "Interest: " + interest + "\n\n" + message }
      ],
      context: { pageUri: "https://radurealtor.com", pageName: "Radu G. Muresan - Contact" }
    };
    var web3 = {
      access_key: WEB3FORMS_KEY,
      subject: "New Lead from radurealtor.com",
      from_name: name,
      name: name,
      email: data.get("email"),
      phone: phone || "Not provided",
      interest: interest,
      message: message,
      ccemail: CC_EMAIL
    };

    button.disabled = true;
    status.classList.add("hidden");

    function post(url, body, extraHeaders) {
      var headers = { "Content-Type": "application/json" };
      if (extraHeaders) headers.Accept = "application/json";
      return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; });
    }

    Promise.all([post(HUBSPOT_URL, hubspot), post("https://api.web3forms.com/submit", web3, true)])
      .then(function (results) {
        if (results[0] || results[1]) {
          form.reset();
          showStatus("Thank you! Your message has been sent. I'll get back to you shortly.", true);
        } else {
          showStatus("Sorry, your message could not be sent. Please call (773) 860-7617 or email radu.realtor@yahoo.com.", false);
        }
      })
      .then(function () { button.disabled = false; });
  });
})();

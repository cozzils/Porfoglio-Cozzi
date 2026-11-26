(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector("#nav-menu");
  var email = "cozziluca1@gmail.com";

  // Header background on scroll
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Reveal elements on scroll
  var revealItems = document.querySelectorAll(".reveal");
  var params = new URLSearchParams(window.location.search);
  var staticMode = params.has("static");

  if (params.has("full")) {
    document.documentElement.classList.add("full");
  }

  if (staticMode) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  // Copy email with fallback
  var copyButton = document.querySelector("#copy-email");
  var feedback = document.querySelector("#copy-feedback");

  function showFeedback(message) {
    if (!feedback) return;
    feedback.textContent = message;
    window.clearTimeout(showFeedback.timeout);
    showFeedback.timeout = window.setTimeout(function () {
      feedback.textContent = "";
    }, 2600);
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { showFeedback("Email copiata: " + email); },
          function () { showFeedback(legacyCopy(email) ? "Email copiata: " + email : "Copia non riuscita. Email: " + email); }
        );
      } else {
        showFeedback(legacyCopy(email) ? "Email copiata: " + email : "Copia non riuscita. Email: " + email);
      }
    });
  }

  // Footer year
  var year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

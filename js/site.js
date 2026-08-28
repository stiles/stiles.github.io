/*
 * Replaces jQuery, Bootstrap's JS, classie, cbpAnimatedHeader, jquery.easing,
 * jqBootstrapValidation and freelancer.js. Smooth scrolling is CSS now, and
 * form validation is the browser's.
 */
(function () {
  "use strict";

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Shrink the brand once the page has scrolled past the header top */
  var nav = document.querySelector(".site-nav");

  if (nav) {
    var syncNav = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    syncNav();
    window.addEventListener("scroll", syncNav, { passive: true });
  }

  /* Hero headline phrases.
   *
   * Runs one pass and stops on the last phrase. That isn't only an editorial
   * choice -- it's what lets the hero skip a pause button. WCAG 2.2.2 wants a
   * stop mechanism for anything that either moves for more than five seconds or
   * auto-updates at all, and an endless loop trips both. One finite pass with a
   * pure cross-fade (no travel, see style.css) trips neither: nothing moves,
   * and the updating ends rather than continuing under the visitor.
   *
   * Progressive enhancement: the markup is a stacked list of all four phrases,
   * which is what shows with no JS or with reduced motion. Only here do they
   * collapse onto one line. */
  var hats = document.querySelector(".hero-hats");
  var calmer = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (hats) {
    var phrases = hats.querySelectorAll(".hat");

    if (phrases.length > 1 && !calmer.matches) {
      hats.classList.add("is-live");

      var at = 0;
      var timer = window.setInterval(function () {
        phrases[at].classList.remove("is-current");
        at += 1;
        phrases[at].classList.add("is-current");
        if (at === phrases.length - 1) window.clearInterval(timer);
      }, 2600);
    }
  }

  /* Project dialogs.
   *
   * Each card is a real link to the project, so without JS a click still goes
   * somewhere useful. With JS we intercept and open the dialog instead. */
  var supportsDialog = typeof HTMLDialogElement === "function";

  Array.prototype.forEach.call(document.querySelectorAll("[data-dialog]"), function (trigger) {
    trigger.addEventListener("click", function (event) {
      if (!supportsDialog) return;
      var dialog = document.getElementById("dialog-" + trigger.getAttribute("data-dialog"));
      if (!dialog) return;
      event.preventDefault();
      dialog.showModal();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".project-dialog"), function (dialog) {
    var close = dialog.querySelector(".dialog-close");
    if (close) {
      close.addEventListener("click", function () {
        dialog.close();
      });
    }

    /* A click on the backdrop reports the dialog as its target, so compare
     * against the panel's own box rather than checking the target alone. */
    dialog.addEventListener("click", function (event) {
      var box = dialog.getBoundingClientRect();
      var inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) dialog.close();
    });
  });
})();

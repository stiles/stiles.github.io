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
   * Cycles indefinitely with no pause control. That's a known, deliberate
   * deviation from WCAG 2.2.2, which wants a way to stop content that
   * auto-updates -- not an oversight. It matches moundcli.com, where the same
   * headline ships the same way.
   *
   * Every mitigation that doesn't need a visible control is here. The
   * transition is a pure cross-fade with no travel, so the criterion's
   * five-second moving-content clause never applies at all; only the
   * auto-updating clause does. The whole stack is aria-hidden behind one static
   * sentence, so assistive tech reads the claim once instead of hearing a word
   * change under it. prefers-reduced-motion stops it dead. And the cycle
   * suspends on hover, on focus and whenever the hero leaves the viewport, so
   * it isn't moving at the edge of vision while someone reads the page below --
   * which is the distraction the criterion is actually about.
   *
   * Progressive enhancement: the markup is a stacked list of all four phrases,
   * which is what shows with no JS or with reduced motion. */
  var hats = document.querySelector(".hero-hats");
  var calmer = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (hats) {
    var phrases = hats.querySelectorAll(".hat");
    var timer = null;
    var at = 0;
    var hovering = false;
    var offscreen = false;

    var advance = function () {
      phrases[at].classList.remove("is-current");
      at = (at + 1) % phrases.length;
      phrases[at].classList.add("is-current");
    };

    /* Two independent reasons to hold, so one function owns the timer rather
     * than each handler starting and stopping it behind the other's back. */
    var refresh = function () {
      var run = !hovering && !offscreen;
      if (run && !timer) timer = window.setInterval(advance, 3400);
      if (!run && timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (phrases.length > 1 && !calmer.matches) {
      hats.classList.add("is-live");
      refresh();

      var hero = hats.closest(".hero");
      var setHover = function (state) {
        return function () {
          hovering = state;
          refresh();
        };
      };
      hero.addEventListener("mouseenter", setHover(true));
      hero.addEventListener("mouseleave", setHover(false));
      hero.addEventListener("focusin", setHover(true));
      hero.addEventListener("focusout", setHover(false));

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          offscreen = !entries[0].isIntersecting;
          refresh();
        }).observe(hats);
      }

      calmer.addEventListener("change", function (event) {
        if (!event.matches) return;
        hovering = true;
        refresh();
        hats.classList.remove("is-live");
      });
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

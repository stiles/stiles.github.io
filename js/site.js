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
   * Cycles indefinitely, which is why the pause button exists. WCAG 2.2.2 gives
   * moving content a five-second grace period but gives auto-updating content
   * none: text that changes on its own, forever, alongside other content needs
   * a mechanism to pause, stop or hide it. prefers-reduced-motion and
   * pause-on-hover don't satisfy that, since neither is a persistent control.
   * The transition is still a pure cross-fade with no travel, so the moving
   * clause stays out of it entirely.
   *
   * Progressive enhancement: the markup is a stacked list of all four phrases,
   * which is what shows with no JS or with reduced motion. Only here do they
   * collapse onto one line. */
  var hats = document.querySelector(".hero-hats");
  var hatsToggle = document.querySelector(".hats-toggle");
  var calmer = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (hats && hatsToggle) {
    var phrases = hats.querySelectorAll(".hat");
    var label = hatsToggle.querySelector(".hats-toggle-label");
    var PAUSE_ICON =
      '<rect x="7" y="5" width="3.6" height="14" rx="1"></rect>' +
      '<rect x="13.4" y="5" width="3.6" height="14" rx="1"></rect>';
    var PLAY_ICON =
      '<path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z"></path>';

    var timer = null;
    var at = 0;
    var userPaused = false;
    var hovering = false;
    var offscreen = false;

    var advance = function () {
      phrases[at].classList.remove("is-current");
      at = (at + 1) % phrases.length;
      phrases[at].classList.add("is-current");
    };

    /* Three things can stop the cycle, but only the button should relabel it,
     * so one function owns the timer and the button reports userPaused alone.
     * Otherwise hovering would leave the control claiming a state the visitor
     * never chose. */
    var refresh = function () {
      var run = !userPaused && !hovering && !offscreen;
      if (run && !timer) timer = window.setInterval(advance, 3400);
      if (!run && timer) {
        window.clearInterval(timer);
        timer = null;
      }
      label.textContent = userPaused
        ? "Play the headline animation"
        : "Pause the headline animation";
      var svg = hatsToggle.querySelector("svg");
      if (svg) svg.innerHTML = userPaused ? PLAY_ICON : PAUSE_ICON;
    };

    if (phrases.length > 1 && !calmer.matches) {
      hats.classList.add("is-live");
      hatsToggle.hidden = false;
      refresh();

      hatsToggle.addEventListener("click", function () {
        userPaused = !userPaused;
        refresh();
      });

      /* Courtesies, not the required control: hold while a visitor is reading
       * the hero, and don't animate to an empty room once it's scrolled past. */
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
        userPaused = true;
        refresh();
        hats.classList.remove("is-live");
        hatsToggle.hidden = true;
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

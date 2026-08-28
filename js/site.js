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

  /* Rotating hero phrases.
   *
   * Progressive enhancement: the markup is a stacked list of all four phrases,
   * which is what shows with no JS. Only here do they collapse into one line
   * that cycles, and only if the visitor hasn't asked for less motion. */
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

    var advance = function () {
      phrases[at].classList.remove("is-current");
      at = (at + 1) % phrases.length;
      phrases[at].classList.add("is-current");
    };

    /* One place decides whether the timer runs, so hovering can suspend the
     * cycle without the button claiming the visitor paused it. */
    var refresh = function () {
      var shouldRun = !userPaused && !hovering;
      if (shouldRun && !timer) timer = window.setInterval(advance, 2600);
      if (!shouldRun && timer) {
        window.clearInterval(timer);
        timer = null;
      }
      label.textContent = userPaused ? "Play" : "Pause";
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

      /* Suspending on hover and focus is a courtesy; the button is the control
       * WCAG asks for. */
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

      /* Honour the preference if it changes mid-session. */
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

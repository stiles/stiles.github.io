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
      if (run && !timer) timer = window.setInterval(advance, 2400);
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

  /* Featured terminal demo.
   *
   * The transcript is rendered in full by Jekyll, so with no JS or with reduced
   * motion the card just shows the session. Here we mask it and play it back:
   * type a command, show its output, move on. Masking is `visibility`, never
   * `display`, so the block is laid out at final size from first paint and the
   * reveal costs no reflow.
   *
   * Runs once when scrolled into view rather than on load, so it isn't over
   * before anyone sees it. The button skips to the end while playing and
   * replays once finished -- useful on a demo in its own right, and it doubles
   * as the stop mechanism for a sequence that runs past five seconds. */
  var term = document.querySelector(".terminal");
  var termBtn = document.querySelector(".term-btn");

  if (term && termBtn && !calmer.matches) {
    var steps = [].slice.call(term.querySelectorAll(".term-step"));
    var SKIP_ICON =
      '<path d="M5 5.2v13.6a1 1 0 0 0 1.53.85l9.2-6.8a1 1 0 0 0 0-1.7l-9.2-6.8A1 1 0 0 0 5 5.2z"></path>' +
      '<rect x="17.4" y="5" width="2.6" height="14" rx="1"></rect>';
    var REPLAY_ICON =
      '<path d="M3 12a9 9 0 1 0 2.64-6.36"></path><path d="M3 4v5h5"></path>';

    if (steps.length) {
      var timers = [];
      var done = false;

      var later = function (fn, ms) {
        timers.push(window.setTimeout(fn, ms));
      };
      var stopTimers = function () {
        timers.forEach(window.clearTimeout);
        timers = [];
      };

      /* The animated copy is hidden from assistive tech and replaced with one
       * static reading, so nobody hears a command being typed one letter at a
       * time. Built from the data attributes, so it survives a reset. */
      var transcript = document.createElement("pre");
      transcript.className = "visually-hidden";
      transcript.textContent = steps
        .map(function (s) {
          return (
            "$ " +
            s.querySelector(".term-cmd").getAttribute("data-cmd") +
            "\n" +
            s.querySelector(".term-out").textContent
          );
        })
        .join("\n\n");
      term.setAttribute("aria-hidden", "true");
      term.parentNode.appendChild(transcript);

      var setButton = function (mode) {
        var svg = termBtn.querySelector("svg");
        var isReplay = mode === "replay";
        if (svg) {
          svg.innerHTML = isReplay ? REPLAY_ICON : SKIP_ICON;
          svg.setAttribute("fill", isReplay ? "none" : "currentColor");
          svg.setAttribute("stroke", isReplay ? "currentColor" : "none");
        }
        termBtn.querySelector(".term-btn-label").textContent = isReplay
          ? "Replay the demo"
          : "Skip to the end of the demo";
      };

      var reset = function () {
        stopTimers();
        steps.forEach(function (s) {
          s.className = "term-step";
          s.querySelector(".term-cmd").textContent = "";
        });
      };

      var finish = function () {
        stopTimers();
        steps.forEach(function (s) {
          s.className = "term-step cmd-in out-in";
          var cmd = s.querySelector(".term-cmd");
          cmd.textContent = cmd.getAttribute("data-cmd");
        });
        done = true;
        setButton("replay");
      };

      var playStep = function (i) {
        if (i >= steps.length) {
          done = true;
          setButton("replay");
          return;
        }
        if (i > 0) steps[i - 1].classList.add("is-past");

        var step = steps[i];
        var cmd = step.querySelector(".term-cmd");
        var full = cmd.getAttribute("data-cmd");
        var n = 0;

        step.classList.add("cmd-in", "is-typing");
        cmd.textContent = "";

        var type = function () {
          if (n <= full.length) {
            cmd.textContent = full.slice(0, n);
            n += 1;
            later(type, 26);
            return;
          }
          step.classList.remove("is-typing");
          later(function () {
            step.classList.add("out-in");
            later(function () {
              playStep(i + 1);
            }, 950);
          }, 420);
        };
        type();
      };

      var play = function () {
        reset();
        done = false;
        setButton("skip");
        playStep(0);
      };

      term.classList.add("is-live");
      reset();
      termBtn.hidden = false;
      setButton("skip");

      termBtn.addEventListener("click", function () {
        if (done) play();
        else finish();
      });

      if ("IntersectionObserver" in window) {
        var seen = false;
        var io = new IntersectionObserver(
          function (entries) {
            if (seen || !entries[0].isIntersecting) return;
            seen = true;
            io.disconnect();
            play();
          },
          { threshold: 0.35 }
        );
        io.observe(term);
      } else {
        play();
      }
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

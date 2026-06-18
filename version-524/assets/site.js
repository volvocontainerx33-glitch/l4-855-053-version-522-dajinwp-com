document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  });

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    var input = root.querySelector("[data-search-input]");
    var typeSelect = root.querySelector("[data-type-filter]");
    var empty = root.querySelector("[data-empty]");
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));

    function matchType(text, selected) {
      if (!selected) {
        return true;
      }
      return text.indexOf(selected) !== -1;
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selectedType = typeSelect ? typeSelect.value.trim() : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var matched = (!query || text.indexOf(query) !== -1) && matchType(text, selectedType);
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }
    if (typeSelect) {
      typeSelect.addEventListener("change", applyFilter);
    }
  });
});

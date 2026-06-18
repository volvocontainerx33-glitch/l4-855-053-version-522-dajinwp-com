document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");
    if (toggle && mobileMenu) {
        toggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var active = 0;

        function showSlide(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector("[data-card-search]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-item"));
    var empty = document.querySelector("[data-empty-state]");
    var currentFilter = "";

    function cardText(card) {
        return [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-tags"),
            card.textContent
        ].join(" ").toLowerCase();
    }

    function applyFilters() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var shown = 0;

        cards.forEach(function (card) {
            var text = cardText(card);
            var matchedKeyword = keyword === "" || text.indexOf(keyword) !== -1;
            var matchedFilter = currentFilter === "" || text.indexOf(currentFilter.toLowerCase()) !== -1;
            var visible = matchedKeyword && matchedFilter;
            card.style.display = visible ? "" : "none";
            if (visible) {
                shown += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", shown === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("is-active");
            });
            button.classList.add("is-active");
            currentFilter = button.getAttribute("data-filter") || "";
            applyFilters();
        });
    });
});

(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-site-search]').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                return;
            }
            event.preventDefault();
            window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
        });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;
        var setSlide = function(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, idx) {
                slide.classList.toggle('is-active', idx === current);
            });
            dots.forEach(function(dot, idx) {
                dot.classList.toggle('is-active', idx === current);
            });
        };
        var start = function() {
            timer = window.setInterval(function() {
                setSlide(current + 1);
            }, 5200);
        };
        var restart = function() {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        };
        dots.forEach(function(dot, idx) {
            dot.addEventListener('click', function() {
                setSlide(idx);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener('click', function() {
                setSlide(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                setSlide(current + 1);
                restart();
            });
        }
        if (slides.length > 1) {
            start();
        }
    }

    var searchInput = document.querySelector('[data-library-search]');
    var yearFilter = document.querySelector('[data-filter-year]');
    var typeFilter = document.querySelector('[data-filter-type]');
    var grid = document.querySelector('[data-library-grid]');
    if (searchInput && grid) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            searchInput.value = q;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var fillOptions = function(select, field) {
            if (!select || select.options.length > 1) {
                return;
            }
            var values = [];
            cards.forEach(function(card) {
                var value = card.getAttribute(field) || '';
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            values.sort().reverse().forEach(function(value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        };
        fillOptions(yearFilter, 'data-year');
        fillOptions(typeFilter, 'data-type');
        var filter = function() {
            var keyword = searchInput.value.trim().toLowerCase();
            var year = yearFilter ? yearFilter.value : '';
            var type = typeFilter ? typeFilter.value : '';
            cards.forEach(function(card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchYear = !year || card.getAttribute('data-year') === year;
                var matchType = !type || card.getAttribute('data-type') === type;
                card.classList.toggle('is-filtered-out', !(matchKeyword && matchYear && matchType));
            });
        };
        searchInput.addEventListener('input', filter);
        if (yearFilter) {
            yearFilter.addEventListener('change', filter);
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', filter);
        }
        filter();
    }
})();

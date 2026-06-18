(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
        startTimer();
      });
    });

    startTimer();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var empty = document.querySelector('[data-empty-message]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = 'all';

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-type'),
      card.getAttribute('data-year'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags')
    ].join(' ').toLowerCase();
  }

  function applySearch(query) {
    var q = normalize(query);
    var visible = 0;

    cards.forEach(function (card) {
      var text = cardText(card);
      var filterValue = card.getAttribute('data-type') || '';
      var filterMatch = activeFilter === 'all' || filterValue.indexOf(activeFilter) !== -1 || text.indexOf(activeFilter) !== -1;
      var searchMatch = !q || text.indexOf(q) !== -1;
      var shouldShow = filterMatch && searchMatch;

      card.classList.toggle('is-hidden', !shouldShow);

      if (shouldShow) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value : '';
      forms.forEach(function (otherForm) {
        var otherInput = otherForm.querySelector('input');
        if (otherInput && otherInput !== input) {
          otherInput.value = value;
        }
      });
      applySearch(value);
    });

    var input = form.querySelector('input');
    if (input) {
      input.addEventListener('input', function () {
        forms.forEach(function (otherForm) {
          var otherInput = otherForm.querySelector('input');
          if (otherInput && otherInput !== input) {
            otherInput.value = input.value;
          }
        });
        applySearch(input.value);
      });
    }
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      var input = document.querySelector('[data-search-form] input');
      applySearch(input ? input.value : '');
    });
  });
})();

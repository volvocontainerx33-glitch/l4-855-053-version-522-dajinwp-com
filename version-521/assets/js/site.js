(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function rootPath() {
    return document.body.getAttribute('data-root') || './';
  }

  function initMenu() {
    var toggle = $('[data-menu-toggle]');
    var nav = $('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = $('[data-hero]');
    if (!hero) return;
    var slides = $all('[data-hero-slide]', hero);
    var dots = $all('[data-hero-dot]', hero);
    var prev = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    if (slides.length < 2) return;
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    play();
  }

  function initFilters() {
    var areas = $all('[data-filter-area]');
    areas.forEach(function (area) {
      var section = area.parentElement;
      if (!section) return;
      var cards = $all('.movie-card', section);
      var input = $('[data-filter-input]', area);
      var yearSelect = $('[data-filter-year]', area);
      var typeSelect = $('[data-filter-type]', area);

      if (yearSelect) {
        var years = Array.from(new Set(cards.map(function (card) {
          return card.getAttribute('data-year') || '';
        }).filter(Boolean))).sort(function (a, b) {
          return Number(b) - Number(a);
        });
        years.forEach(function (year) {
          var option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        });
      }

      if (typeSelect) {
        var types = Array.from(new Set(cards.map(function (card) {
          return card.getAttribute('data-type') || '';
        }).filter(Boolean))).sort();
        types.forEach(function (type) {
          var option = document.createElement('option');
          option.value = type;
          option.textContent = type;
          typeSelect.appendChild(option);
        });
      }

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' '));
          var ok = true;
          if (keyword && text.indexOf(keyword) === -1) ok = false;
          if (year && card.getAttribute('data-year') !== year) ok = false;
          if (type && card.getAttribute('data-type') !== type) ok = false;
          card.classList.toggle('hidden', !ok);
        });
      }

      [input, yearSelect, typeSelect].forEach(function (control) {
        if (control) control.addEventListener('input', apply);
        if (control) control.addEventListener('change', apply);
      });
    });
  }

  function initGlobalSearch() {
    var inputs = $all('[data-global-search]');
    var data = window.SITE_SEARCH_INDEX || [];
    if (!inputs.length || !data.length) return;

    inputs.forEach(function (input) {
      var box = input.parentElement ? $('[data-global-results]', input.parentElement) : null;
      if (!box) return;

      function closeLater() {
        setTimeout(function () {
          box.classList.remove('open');
        }, 160);
      }

      function render() {
        var keyword = normalize(input.value);
        if (!keyword) {
          box.classList.remove('open');
          box.innerHTML = '';
          return;
        }
        var results = [];
        for (var i = 0; i < data.length; i += 1) {
          var item = data[i];
          var haystack = normalize([item.title, item.region, item.type, item.year, item.genre, item.tags].join(' '));
          if (haystack.indexOf(keyword) !== -1) {
            results.push(item);
          }
          if (results.length >= 8) break;
        }
        box.innerHTML = results.map(function (item) {
          return '<a class="search-result" href="' + rootPath() + item.link + '"><strong>' + item.title + '</strong><span>' + item.region + ' · ' + item.year + ' · ' + item.genre + '</span></a>';
        }).join('');
        box.classList.toggle('open', results.length > 0);
      }

      input.addEventListener('input', render);
      input.addEventListener('focus', render);
      input.addEventListener('blur', closeLater);
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = $('[data-player-video]');
    var overlay = $('[data-player-overlay]');
    var button = $('[data-player-button]');
    if (!video || !overlay || !streamUrl) return;
    var ready = false;
    var player = null;

    function attach() {
      if (ready) return;
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        player = new window.Hls({ maxBufferLength: 45 });
        player.loadSource(streamUrl);
        player.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function start() {
      attach();
      overlay.classList.add('is-hidden');
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    overlay.addEventListener('click', start);
    if (button) button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) start();
    });
    window.addEventListener('beforeunload', function () {
      if (player && typeof player.destroy === 'function') player.destroy();
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initGlobalSearch();
  });
}());

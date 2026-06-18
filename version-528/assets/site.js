(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function bindSearch(input) {
    var scope = document.querySelector('[data-search-scope]');
    if (!scope) {
      return;
    }
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var keyword = normalize(input.value);
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        card.classList.toggle('is-filtered-out', keyword && text.indexOf(keyword) === -1);
      });
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-input]')).forEach(bindSearch);

  Array.prototype.slice.call(document.querySelectorAll('[data-clear-search]')).forEach(function (button) {
    button.addEventListener('click', function () {
      var input = document.querySelector('[data-search-input]');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.focus();
      }
    });
  });

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    restart();
  }

  window.setupPlayer = function (videoId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !streamUrl) {
      return;
    }

    var started = false;
    var hls = null;

    function play() {
      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (!started) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };
})();

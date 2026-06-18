(function () {
  function onReady(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  onReady(function () {
    var frames = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    frames.forEach(function (frame) {
      var video = frame.querySelector("video");
      var cover = frame.querySelector("[data-play-cover]");
      var source = video ? video.getAttribute("data-src") : "";
      var hls = null;
      var initialized = false;

      function initialize() {
        if (!video || !source || initialized) {
          return;
        }

        initialized = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        initialize();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            if (cover) {
              cover.classList.remove("is-hidden");
            }
          });
        }
      }

      if (cover) {
        cover.addEventListener("click", play);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            play();
          }
        });
        video.addEventListener("play", function () {
          if (cover) {
            cover.classList.add("is-hidden");
          }
        });
      }

      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  });
})();

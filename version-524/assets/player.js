document.addEventListener("DOMContentLoaded", function () {
  var wrapper = document.querySelector("[data-player]");

  if (!wrapper) {
    return;
  }

  var video = wrapper.querySelector("video");
  var trigger = wrapper.querySelector("[data-play-trigger]");

  if (!video) {
    return;
  }

  var streamUrl = video.getAttribute("data-stream-url") || "";
  var ready = false;
  var hlsInstance = null;

  function attachStream() {
    if (ready || !streamUrl) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    ready = true;
  }

  function startPlayback(event) {
    if (event) {
      event.preventDefault();
    }

    attachStream();
    wrapper.classList.add("is-playing");
    video.setAttribute("controls", "controls");

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
    }
  });
});

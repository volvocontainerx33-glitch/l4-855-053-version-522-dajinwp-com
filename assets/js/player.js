document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("player-cover");
    var button = document.getElementById("player-start");

    if (!video || !cover || !button) {
        return;
    }

    var source = video.getAttribute("data-stream");
    var started = false;
    var hlsInstance = null;

    function attachSource() {
        if (started) {
            return;
        }

        started = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }

        video.controls = true;
        cover.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                video.controls = true;
            });
        }
    }

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        attachSource();
    });

    cover.addEventListener("click", attachSource);

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
});

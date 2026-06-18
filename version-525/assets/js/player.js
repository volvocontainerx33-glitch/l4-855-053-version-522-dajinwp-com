(function() {
    document.querySelectorAll('[data-player]').forEach(function(shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        var stream = shell.getAttribute('data-stream');
        var ready = false;
        var hls = null;

        var start = function() {
            if (!video || !stream) {
                return;
            }
            if (!ready) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                video.setAttribute('controls', 'controls');
                ready = true;
            }
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        };

        if (cover) {
            cover.addEventListener('click', start);
        }
        if (video) {
            video.addEventListener('click', function() {
                if (!ready) {
                    start();
                }
            });
            video.addEventListener('ended', function() {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
        window.addEventListener('beforeunload', function() {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();

(function () {
    'use strict';

    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(text) {
        return String(text || '').toLowerCase().trim();
    }

    qsa('[data-menu-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var nav = qs('[data-mobile-nav]');
            if (nav) {
                nav.classList.toggle('is-open');
            }
        });
    });

    function initHeroSlider() {
        var slider = qs('[data-hero-slider]');
        if (!slider) {
            return;
        }

        var slides = qsa('[data-hero-slide]', slider);
        var dots = qsa('[data-hero-dot]', slider);
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5500);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        var scope = qs('[data-filter-scope]');
        if (!scope) {
            return;
        }

        var input = qs('[data-filter-input]', scope);
        var typeSelect = qs('[data-filter-type]', scope);
        var yearSelect = qs('[data-filter-year]', scope);
        var categorySelect = qs('[data-filter-category]', scope);
        var result = qs('[data-filter-result]', scope);
        var empty = qs('[data-empty-message]', scope);
        var cards = qsa('.search-card', scope);
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function selectedValue(select) {
            return select ? normalize(select.value) : '';
        }

        function applyFilter() {
            var q = input ? normalize(input.value) : '';
            var type = selectedValue(typeSelect);
            var year = selectedValue(yearSelect);
            var category = selectedValue(categorySelect);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardType = normalize(card.getAttribute('data-type'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardCategory = normalize(card.getAttribute('data-category'));
                var matched = true;

                if (q && text.indexOf(q) === -1) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (result) {
                result.textContent = '显示 ' + visible + ' / ' + cards.length + ' 部';
            }
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, typeSelect, yearSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }

    function initPlayer() {
        qsa('[data-player]').forEach(function (shell) {
            var button = qs('[data-play-button]', shell);
            var video = qs('video', shell);
            var source = shell.getAttribute('data-video-url');
            var message = qs('[data-player-message]', shell.parentElement || document);

            if (!button || !video || !source) {
                return;
            }

            button.addEventListener('click', function () {
                shell.classList.add('is-playing');
                video.setAttribute('controls', 'controls');

                function playVideo() {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(function () {
                            if (message) {
                                message.textContent = '浏览器阻止了自动播放，请再次点击视频画面开始播放。';
                            }
                        });
                    }
                }

                if (window.Hls && window.Hls.isSupported()) {
                    if (video._hlsInstance) {
                        video._hlsInstance.destroy();
                    }
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    video._hlsInstance = hls;
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    hls.on(window.Hls.Events.ERROR, function (_, data) {
                        if (message && data && data.fatal) {
                            message.textContent = '播放器加载遇到网络问题，可刷新页面后重试。';
                        }
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    video.addEventListener('loadedmetadata', playVideo, { once: true });
                } else {
                    video.src = source;
                    playVideo();
                    if (message) {
                        message.textContent = '当前浏览器可能不完全支持 HLS，已尝试直接加载播放源。';
                    }
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeroSlider();
        initFilters();
        initPlayer();
    });
}());

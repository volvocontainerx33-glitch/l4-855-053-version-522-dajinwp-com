(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "<article class=\"movie-card movie-card-compact\">" +
      "<a href=\"./" + escapeHtml(movie.url) + "\" class=\"movie-poster-wrap\" aria-label=\"" + escapeHtml(movie.title) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"play-chip\">▶</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<div class=\"movie-meta-line\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>" +
      "<h2><a href=\"./" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h2>" +
      "<p>" + escapeHtml(movie.oneLine) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  ready(function () {
    var input = document.querySelector("[data-search-input]");
    var form = document.querySelector("[data-search-form]");
    var results = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    var subtitle = document.querySelector("[data-search-subtitle]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    var year = params.get("year") || "";
    var movies = window.SEARCH_MOVIES || [];

    if (!input || !results) {
      return;
    }

    input.value = initial || year;

    function render(query) {
      var q = String(query || "").trim().toLowerCase();
      var list = movies.filter(function (movie) {
        if (!q) {
          return movie.featured;
        }
        return movie.searchText.indexOf(q) !== -1;
      }).slice(0, q ? 120 : 36);

      if (title) {
        title.textContent = q ? "搜索结果" : "热门影片";
      }

      if (subtitle) {
        subtitle.textContent = q ? "以下为匹配关键词的影片。" : "输入关键词可以继续筛选片库。";
      }

      if (!list.length) {
        results.innerHTML = "<div class=\"no-results\">没有找到匹配影片，请尝试其他关键词。</div>";
        return;
      }

      results.innerHTML = list.map(card).join("");
    }

    render(input.value);

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render(input.value);
        var url = new URL(window.location.href);
        if (input.value.trim()) {
          url.searchParams.set("q", input.value.trim());
          url.searchParams.delete("year");
        } else {
          url.searchParams.delete("q");
          url.searchParams.delete("year");
        }
        window.history.replaceState({}, "", url.toString());
      });
    }

    input.addEventListener("input", function () {
      render(input.value);
    });
  });
})();

(function () {
  "use strict";

  const SERVER_HOST = "rexsmp.simpleminecrafthosting.com";
  const SERVER_PORT = 33751;
  const JAVA_ADDRESS = SERVER_HOST + ":" + SERVER_PORT;

  // Copy buttons
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (!text) return;

      navigator.clipboard.writeText(text).then(showToast).catch(function () {
        var area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          showToast();
        } catch (e) {
          /* ignore */
        }
        document.body.removeChild(area);
      });
    });
  });

  function showToast() {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2000);
  }

  // Mobile nav
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Live player count — read-only public APIs only
  var playersEl = document.getElementById("players-online");
  var statusEl = document.getElementById("server-status");

  function setStatus(text, className) {
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.className = "stat-status" + (className ? " " + className : "");
    }
  }

  function fetchStatus() {
    var url =
      "https://api.mcstatus.io/v2/status/java/" +
      encodeURIComponent(SERVER_HOST + ":" + SERVER_PORT);

    fetch(url, { method: "GET", credentials: "omit", referrerPolicy: "no-referrer" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.online) {
          var count = data.players && typeof data.players.online === "number"
            ? data.players.online
            : 0;
          var max = data.players && typeof data.players.max === "number"
            ? data.players.max
            : "?";

          if (playersEl) {
            playersEl.textContent = count + " / " + max;
          }
          setStatus("Server is online · " + JAVA_ADDRESS, "online");
        } else {
          if (playersEl) playersEl.textContent = "Offline";
          setStatus("Server appears offline — try again later", "offline");
        }
      })
      .catch(function () {
        // Fallback API
        return fetch(
          "https://api.mcsrvstat.us/3/" +
            encodeURIComponent(SERVER_HOST + ":" + SERVER_PORT),
          { method: "GET", credentials: "omit", referrerPolicy: "no-referrer" }
        )
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (data.online) {
              if (playersEl) {
                playersEl.textContent =
                  (data.players && data.players.online) + " / " +
                  (data.players && data.players.max);
              }
              setStatus("Server is online · " + JAVA_ADDRESS, "online");
            } else {
              if (playersEl) playersEl.textContent = "Offline";
              setStatus("Could not reach server status API", "offline");
            }
          })
          .catch(function () {
            if (playersEl) playersEl.textContent = "—";
            setStatus("Status unavailable (check your connection)", "");
          });
      });
  }

  fetchStatus();
  setInterval(fetchStatus, 60000);
})();

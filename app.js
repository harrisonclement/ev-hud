(function () {
  var TZ = "America/Phoenix";
  var timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true
  });
  var dateFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, weekday: "short", month: "short", day: "numeric"
  });
  var longFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, weekday: "long", month: "long", day: "numeric"
  });

  var greeting = document.getElementById("greeting");
  var statusLine = document.getElementById("status-line");
  var clockTime = document.getElementById("clock-time");
  var clockDate = document.getElementById("clock-date");
  var logList = document.getElementById("log-list");
  var ask = document.getElementById("ask");
  var chatPill = document.getElementById("chat-pill");
  var folders = document.getElementById("folders");
  var taskList = document.getElementById("task-list");
  var remList = document.getElementById("rem-list");
  var taskEmpty = document.getElementById("task-empty");
  var remEmpty = document.getElementById("rem-empty");
  var countTasks = document.getElementById("count-tasks");
  var countRems = document.getElementById("count-rems");
  var folderN = 0;
  var logStarted = false;

  function phoenixHour(now) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hour: "numeric", hourCycle: "h23"
    }).formatToParts(now);
    var h = parts.find(function (p) { return p.type === "hour"; });
    return h ? Number(h.value) : 0;
  }

  function periodFor(hour) {
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    return "evening";
  }

  function tick() {
    var now = new Date();
    var hour = phoenixHour(now);
    clockTime.textContent = timeFmt.format(now);
    clockDate.textContent = dateFmt.format(now) + " · PT";
    greeting.textContent = "Good " + periodFor(hour) + ", Harrison.";
    statusLine.textContent = longFmt.format(now) + " · PT. No live tasks, habits, or reminders are loaded.";
  }

  function logLine(text) {
    var line = (text || "").trim();
    if (!line) return;
    if (!logStarted) {
      logList.textContent = "";
      logStarted = true;
    }
    var li = document.createElement("li");
    li.textContent = clockTime.textContent + "  " + line;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
  }

  function bindLogs(root) {
    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-log]");
      if (!btn || !root.contains(btn)) return;
      logLine(btn.getAttribute("data-log"));
    });
  }

  document.getElementById("ask-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    logLine(ask.value);
    ask.value = "";
  });

  document.getElementById("mic-ask").addEventListener("click", function () {
    logLine("Microphone is off. Nothing was recorded. SAMPLE.");
  });
  document.getElementById("mic-top").addEventListener("click", function () {
    logLine("Microphone is off. Nothing was recorded. SAMPLE.");
  });
  document.getElementById("sound-btn").addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") === "true";
    this.setAttribute("aria-pressed", on ? "false" : "true");
    logLine(on ? "Sound stays off. SAMPLE." : "Sound control is visual only. No audio. SAMPLE.");
  });
  document.getElementById("search-btn").addEventListener("click", function () {
    ask.focus();
  });
  document.getElementById("customize").addEventListener("click", function () {
    logLine("Customize is visual only. SAMPLE.");
  });
  document.getElementById("bolt").addEventListener("click", function () {
    var standby = document.getElementById("standby");
    var on = this.classList.toggle("on");
    standby.textContent = on ? "Local" : "Standby";
    logLine(on ? "Bolt mark on. This computer was not controlled. SAMPLE." : "Standby mark. SAMPLE.");
  });

  folders.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".folder");
    if (!btn) return;
    folders.querySelectorAll(".folder").forEach(function (el) { el.classList.remove("on"); });
    btn.classList.add("on");
    chatPill.textContent = "Chat " + (btn.getAttribute("data-folder") || "geral");
  });

  document.getElementById("new-folder").addEventListener("click", function () {
    folderN += 1;
    var name = "folder " + folderN;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "folder";
    btn.setAttribute("data-folder", name);
    btn.innerHTML = "<i></i>" + name + " · SAMPLE";
    folders.appendChild(btn);
  });

  function addItem(list, empty, counter, text) {
    var line = (text || "").trim();
    if (!line) return;
    var li = document.createElement("li");
    li.textContent = line + " · SAMPLE";
    list.appendChild(li);
    empty.hidden = true;
    counter.textContent = String(list.children.length);
    logLine(line);
  }

  document.getElementById("task-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = document.getElementById("task-input");
    addItem(taskList, taskEmpty, countTasks, input.value);
    input.value = "";
  });
  document.getElementById("rem-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = document.getElementById("rem-input");
    addItem(remList, remEmpty, countRems, input.value);
    input.value = "";
  });

  document.getElementById("provider").addEventListener("change", function () {
    logLine("Provider set on this page to " + this.value + ". No request sent. SAMPLE.");
  });

  bindLogs(document.querySelector(".main"));
  bindLogs(document.querySelector(".rail.right"));

  tick();
  setInterval(tick, 1000);
})();

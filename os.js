const SHELL_KEYS = {
    pins: "67labs_pins",
    recent: "67labs_recent",
    theme: "67labs_theme",
    wallpaper: "67labs_wallpaper",
    wallpaperCustom: "67labs_wallpaper_custom",
    notifications: "67labs_notifications",
    seenUpdateVersion: "67labs_seen_update_version"
};

const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"
];

const DEFAULT_PINS = ["browser", "filemanager", "settings", "notepad", "email"];
const DEFAULT_RECOMMENDED = ["filemanager", "settings", "email", "paint"];

const WALLPAPERS = {
    aurora: {
        desktop: "radial-gradient(circle at 18% 20%, rgba(125,211,252,.42), transparent 30%), radial-gradient(circle at 82% 18%, rgba(196,181,253,.40), transparent 30%), radial-gradient(circle at 50% 78%, rgba(45,212,191,.26), transparent 35%), linear-gradient(135deg, #dbeafe 0%, #eef2ff 40%, #f8fafc 100%)",
        lock: "radial-gradient(circle at top left, rgba(96,165,250,.36), transparent 35%), radial-gradient(circle at right center, rgba(192,132,252,.30), transparent 34%), linear-gradient(145deg, #0f172a 0%, #172554 48%, #312e81 100%)"
    },
    sunrise: {
        desktop: "radial-gradient(circle at 20% 22%, rgba(251,191,36,.34), transparent 28%), radial-gradient(circle at 78% 24%, rgba(244,114,182,.22), transparent 30%), linear-gradient(135deg, #fff7ed 0%, #fde68a 34%, #fecdd3 100%)",
        lock: "radial-gradient(circle at top left, rgba(251,191,36,.24), transparent 35%), linear-gradient(145deg, #431407 0%, #9a3412 38%, #be185d 100%)"
    },
    dusk: {
        desktop: "radial-gradient(circle at 16% 22%, rgba(96,165,250,.2), transparent 28%), radial-gradient(circle at 78% 18%, rgba(167,139,250,.24), transparent 28%), linear-gradient(140deg, #111827 0%, #1f2937 45%, #312e81 100%)",
        lock: "radial-gradient(circle at right top, rgba(125,211,252,.18), transparent 35%), linear-gradient(145deg, #020617 0%, #1e1b4b 50%, #111827 100%)"
    },
    matrix: {
        desktop: "radial-gradient(circle at 50% 0%, rgba(34,197,94,.18), transparent 36%), linear-gradient(180deg, #02140b 0%, #042010 44%, #02140b 100%)",
        lock: "linear-gradient(145deg, #010b06 0%, #042010 55%, #010b06 100%)"
    }
};

const BROWSER_ICON = `
  <span class="shell-glyph shell-glyph-browser" aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" fill="url(#tbNavOuter)"/>
      <path d="M9 3.5a5.5 5.5 0 0 1 5.5 5.5c0 .46-.06.9-.16 1.3H9.62L5.9 6.1A5.38 5.38 0 0 1 9 3.5Z" fill="url(#tbNavInner)"/>
      <path d="M4.7 10.6C5.54 12.4 7.1 13.5 9 13.5c2.06 0 3.85-1.3 4.6-3.15l-3.4-.08-1.9 2L4.7 10.6Z" fill="#f8fbff" fill-opacity=".92"/>
      <defs>
        <linearGradient id="tbNavOuter" x1="2" y1="2" x2="16" y2="16">
          <stop offset="0" stop-color="#5ab4ff"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
        <linearGradient id="tbNavInner" x1="5" y1="4" x2="13" y2="12">
          <stop offset="0" stop-color="#7ef7d3"/>
          <stop offset="1" stop-color="#1f75ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>`;

const APP_CATALOG = [
    { id: "browser", label: "Browser", icon: BROWSER_ICON, desc: "Web browser" },
    { id: "filemanager", label: "File Manager", icon: "\u{1F4C1}", desc: "Explorer mockup" },
    { id: "settings", label: "Settings", icon: "\u2699\uFE0F", desc: "Shell settings" },
    { id: "notepad", label: "Notepad", icon: "\u{1F4DD}", desc: "Text editor" },
    { id: "email", label: "Email", icon: "\u2709\uFE0F", desc: "Inbox UI" },
    { id: "stickynotes", label: "Sticky Notes", icon: "\u{1F5D2}\uFE0F", desc: "Quick notes" },
    { id: "calculator", label: "Calculator", icon: "\u{1F5A9}", desc: "Math tools" },
    { id: "paint", label: "Paint", icon: "\u{1F3A8}", desc: "Draw and sketch" },
    { id: "codeeditor", label: "Code Editor", icon: "\u{1F4BB}", desc: "Edit code" },
    { id: "markdown", label: "Markdown", icon: "\u{1F4C4}", desc: "Preview markdown" },
    { id: "tts", label: "Text to Speech", icon: "\u{1F50A}", desc: "Speech tools" },
    { id: "clock", label: "Clock", icon: "\u{1F550}", desc: "World time" },
    { id: "stopwatch", label: "Stopwatch", icon: "\u23F1\uFE0F", desc: "Elapsed timer" },
    { id: "converter", label: "Converter", icon: "\u{1F4D0}", desc: "Unit tools" },
    { id: "monitor", label: "System Monitor", icon: "\u{1F4CA}", desc: "Resource charts" },
    { id: "taskmanager", label: "Task Manager", icon: "\u26A1", desc: "Running windows" },
    { id: "terminal", label: "Terminal", icon: "\u2328\uFE0F", desc: "Command shell" },
    { id: "screenshot", label: "Screenshot", icon: "\u{1F4F8}", desc: "Capture tools" },
    { id: "recorder", label: "Screen Recorder", icon: "\u{1F3A5}", desc: "Record mockup" },
    { id: "diskspace", label: "Disk Space", icon: "\u{1F4BE}", desc: "Storage overview" },
    { id: "network", label: "Network", icon: "\u{1F4E1}", desc: "Connection stats" },
    { id: "devicemgr", label: "Device Manager", icon: "\u{1F5A5}\uFE0F", desc: "Device info" },
    { id: "eventviewer", label: "Event Viewer", icon: "\u{1F4CB}", desc: "System log" },
    { id: "regedit", label: "Registry Editor", icon: "\u{1F527}", desc: "Key browser" },
    { id: "services", label: "Services", icon: "\u{1F9E9}", desc: "Background services" },
    { id: "bootsettings", label: "Boot Settings", icon: "\u{1F680}", desc: "Startup settings" },
    { id: "themeeditor", label: "Theme Editor", icon: "\u{1F317}", desc: "Color tuning" },
    { id: "shortcuts", label: "Shortcuts", icon: "\u2328\uFE0F", desc: "Hotkeys" },
    { id: "startupapps", label: "Startup Apps", icon: "\u{1FA84}", desc: "Launch on boot" },
    { id: "about", label: "About", icon: "\u2139\uFE0F", desc: "OS information" },
    { id: "cleanup", label: "Disk Cleanup", icon: "\u{1F9F9}", desc: "Clear storage" },
    { id: "sounds", label: "System Sounds", icon: "\u{1F39A}\uFE0F", desc: "Audio settings" },
    { id: "snake", label: "Snake", icon: "\u{1F40D}", desc: "Arcade game" },
    { id: "tetris", label: "Tetris", icon: "\u{1F9F1}", desc: "Block puzzle" },
    { id: "minesweeper", label: "Minesweeper", icon: "\u{1F4A3}", desc: "Logic puzzle" },
    { id: "g2048", label: "2048", icon: "\u{1F522}", desc: "Tile merge game" },
    { id: "pong", label: "Pong", icon: "\u{1F3D3}", desc: "Retro arcade" },
    { id: "flappy", label: "Flappy Bird", icon: "\u{1F426}", desc: "Tap to fly" },
    { id: "breakout", label: "Breakout", icon: "\u{1F9E8}", desc: "Brick breaker" },
    { id: "wordle", label: "Wordle", icon: "\u{1F524}", desc: "Word puzzle" },
    { id: "memory", label: "Memory", icon: "\u{1F0CF}", desc: "Match cards" },
    { id: "tictactoe", label: "Tic-Tac-Toe", icon: "\u274C", desc: "Classic board game" }
];

const APP_LOOKUP = Object.fromEntries(APP_CATALOG.map(app => [app.id, app]));

const shell = {
    refs: {},
    pins: [],
    recent: [],
    notifications: [],
    theme: "light",
    wallpaper: "aurora",
    customWallpaper: "",
    z: 20,
    startOpen: false,
    trayOpen: false,
    cheatOpen: false,
    updateOpen: false,
    updateShownThisSession: false,
    konamiBuffer: []
};

window.addEventListener("load", initShell);

function initShell() {
    cacheRefs();
    loadShellState();
    registerPrimaryBrowserWindow();
    bindShellEvents();
    applyTheme(shell.theme, false);
    applyWallpaper(shell.wallpaper, shell.customWallpaper);
    renderStartMenu();
    renderTaskbar();
    renderNotifications();
    bootToLoginSequence();
}

function cacheRefs() {
    shell.refs.bootScreen = document.getElementById("bootScreen");
    shell.refs.loginScreen = document.getElementById("loginScreen");
    shell.refs.desktop = document.getElementById("desktop");
    shell.refs.browserWindow = document.getElementById("browserWindow");
    shell.refs.taskbar = document.getElementById("taskbar");
    shell.refs.taskIcons = document.getElementById("taskIcons");
    shell.refs.startMenu = document.getElementById("startMenu");
    shell.refs.startSearch = document.getElementById("startSearch");
    shell.refs.startAppsGrid = document.getElementById("startAppsGrid");
    shell.refs.recommendedApps = document.getElementById("recommendedApps");
    shell.refs.notificationPanel = document.getElementById("notificationPanel");
    shell.refs.notificationList = document.getElementById("notificationList");
    shell.refs.cheatMenu = document.getElementById("cheatMenu");
    shell.refs.updateWindow = document.getElementById("updateWindow");
    shell.refs.updateWindowBody = document.getElementById("updateWindowBody");
    shell.refs.snapPreview = document.getElementById("snapPreview");
    shell.refs.startBtn = document.getElementById("startBtn");
    shell.refs.systemTray = document.getElementById("systemTray");
}

function loadShellState() {
    shell.pins = loadArray(SHELL_KEYS.pins, DEFAULT_PINS);
    shell.recent = loadArray(SHELL_KEYS.recent, []);
    shell.notifications = loadArray(SHELL_KEYS.notifications, []).slice(0, 12);
    shell.theme = loadValue(SHELL_KEYS.theme, prefersDark() ? "dark" : "light");
    shell.wallpaper = loadValue(SHELL_KEYS.wallpaper, "aurora");
    shell.customWallpaper = loadValue(SHELL_KEYS.wallpaperCustom, "");
}

function bootToLoginSequence() {
    const { bootScreen, loginScreen, desktop } = shell.refs;
    loginScreen.style.display = "none";
    desktop.style.display = "none";

    setTimeout(() => {
        bootScreen.dataset.hidden = "true";
        setTimeout(() => {
            bootScreen.style.display = "none";
            loginScreen.style.display = "flex";
            loginScreen.style.opacity = "1";
            updateLoginClock();
        }, 500);
    }, 2100);
}

function registerPrimaryBrowserWindow() {
    const browserWindow = shell.refs.browserWindow;
    browserWindow.dataset.appId = "browser";
    browserWindow.style.display = "flex";
    addResizeHandles(browserWindow);
    wireWindow(browserWindow, "browser");

    document.getElementById("minBtn").onclick = () => hideWindow(browserWindow, "browser");
    document.getElementById("closeBtn").onclick = () => hideWindow(browserWindow, "browser");
    document.getElementById("maxBtn").onclick = () => toggleMaximize(browserWindow);
}

function bindShellEvents() {
    document.getElementById("loginSubmit").onclick = doLogin;
    document.getElementById("loginPassword").addEventListener("keydown", event => {
        if (event.key === "Enter") doLogin();
    });

    shell.refs.startBtn.addEventListener("click", event => {
        event.stopPropagation();
        toggleStartMenu();
    });

    shell.refs.systemTray.addEventListener("click", event => {
        event.stopPropagation();
        toggleNotificationPanel();
    });

    shell.refs.startSearch.addEventListener("input", renderStartMenu);
    document.getElementById("trayThemeToggle").onclick = () => toggleTheme();
    document.getElementById("lockShellBtn").onclick = lockShell;
    document.getElementById("clearRecentBtn").onclick = clearRecentApps;
    document.getElementById("pinHintBtn").onclick = () => notify("Pin apps", "Use the small pin button on any app tile to pin or unpin it from the taskbar.");
    document.getElementById("clearNotificationsBtn").onclick = clearNotifications;
    document.getElementById("closeCheatBtn").onclick = () => toggleCheatMenu(false);
    document.getElementById("openUpdatesBtn").onclick = () => toggleUpdateWindow(true);
    document.getElementById("closeUpdateBtn").onclick = () => toggleUpdateWindow(false);
    document.getElementById("dismissUpdateBtn").onclick = () => toggleUpdateWindow(false);

    shell.refs.startAppsGrid.addEventListener("click", handleStartGridClick);
    shell.refs.startAppsGrid.addEventListener("keydown", handleStartGridKeydown);
    shell.refs.recommendedApps.addEventListener("click", handleRecommendedClick);
    shell.refs.cheatMenu.addEventListener("click", event => {
        const btn = event.target.closest(".cheat-btn");
        if (!btn) return;
        runCheat(btn.dataset.cheat);
    });

    document.addEventListener("click", event => {
        if (shell.startOpen && !shell.refs.startMenu.contains(event.target) && !shell.refs.startBtn.contains(event.target)) {
            toggleStartMenu(false);
        }
        if (shell.trayOpen && !shell.refs.notificationPanel.contains(event.target) && !shell.refs.systemTray.contains(event.target)) {
            toggleNotificationPanel(false);
        }
        if (shell.cheatOpen && !shell.refs.cheatMenu.contains(event.target)) {
            toggleCheatMenu(false);
        }
        if (shell.updateOpen && !shell.refs.updateWindow.contains(event.target) && !document.getElementById("openUpdatesBtn").contains(event.target)) {
            toggleUpdateWindow(false);
        }
    });

    document.addEventListener("keydown", handleGlobalShortcuts);
}

function handleGlobalShortcuts(event) {
    if (event.key === "Escape") {
        toggleStartMenu(false);
        toggleNotificationPanel(false);
        toggleCheatMenu(false);
        toggleUpdateWindow(false);
        return;
    }

    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        toggleCheatMenu();
        return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    shell.konamiBuffer.push(key);
    shell.konamiBuffer = shell.konamiBuffer.slice(-KONAMI.length);
    if (shell.konamiBuffer.join("|") === KONAMI.join("|")) {
        toggleCheatMenu(true);
        notify("Cheat menu unlocked", "Secret shell controls are now available.");
        shell.konamiBuffer = [];
    }
}

function updateLoginClock() {
    const now = new Date();
    const timeEl = document.getElementById("loginTime");
    const dateEl = document.getElementById("loginDate");
    if (!timeEl || !dateEl) return;
    timeEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
setInterval(updateLoginClock, 1000);

function doLogin() {
    const passwordInput = document.getElementById("loginPassword");
    const card = document.getElementById("loginCard");

    if (passwordInput.value !== "67") {
        card.style.animation = "none";
        card.offsetWidth;
        card.style.animation = "shake .35s ease";
        passwordInput.value = "";
        passwordInput.placeholder = "Wrong password";
        setTimeout(() => { passwordInput.placeholder = "Password"; }, 1400);
        return;
    }

    shell.refs.loginScreen.style.transition = "opacity .3s ease";
    shell.refs.loginScreen.style.opacity = "0";
    setTimeout(() => {
        shell.refs.loginScreen.style.display = "none";
        shell.refs.desktop.style.display = "block";
        shell.refs.desktop.style.opacity = "1";
        notify("Welcome back", "Your Windows-11-inspired shell is ready.");
        renderTaskbar();
        maybeShowUpdateWindow();
    }, 300);
}

function lockShell() {
    toggleStartMenu(false);
    toggleNotificationPanel(false);
    toggleCheatMenu(false);
    shell.refs.desktop.style.display = "none";
    shell.refs.loginScreen.style.display = "flex";
    shell.refs.loginScreen.style.opacity = "1";
    document.getElementById("loginPassword").value = "";
    updateLoginClock();
}

function getAppMeta(id) {
    return APP_LOOKUP[id] || { id, label: id, icon: "\u25CC", desc: "Application" };
}

function renderTaskbar() {
    const visibleOpenIds = Array.from(document.querySelectorAll(".window[data-app-id]"))
        .filter(el => isVisible(el))
        .map(el => el.dataset.appId);

    const ids = unique([...shell.pins, ...visibleOpenIds]);
    shell.refs.taskIcons.innerHTML = ids.map(id => {
        const meta = getAppMeta(id);
        return `<button class="taskBtn ${visibleOpenIds.includes(id) ? "active" : ""}" data-app-id="${id}" title="${meta.label}" type="button">${taskbarIcon(meta.icon)}</button>`;
    }).join("");

    shell.refs.taskIcons.querySelectorAll(".taskBtn").forEach(btn => {
        btn.onclick = () => activateTaskbarApp(btn.dataset.appId);
    });
}

function renderStartMenu() {
    const filter = shell.refs.startSearch.value.trim().toLowerCase();
    const apps = APP_CATALOG.filter(app => !filter || `${app.label} ${app.desc}`.toLowerCase().includes(filter));

    shell.refs.startAppsGrid.innerHTML = apps.map(app => {
        const pinned = shell.pins.includes(app.id);
        return `
          <div class="start-app-card" data-app-id="${app.id}" role="button" tabindex="0">
            <button class="app-card-pin ${pinned ? "pinned" : ""}" data-pin-id="${app.id}" type="button" title="${pinned ? "Unpin from taskbar" : "Pin to taskbar"}">&#128204;</button>
            <div class="start-app-icon">${tileIcon(app.icon)}</div>
            <div class="start-app-meta">
              <strong>${app.label}</strong>
              <span>${app.desc}</span>
            </div>
          </div>`;
    }).join("");

    const recommendedIds = shell.recent.filter(id => APP_LOOKUP[id]).slice(0, 6);
    const fallbacks = DEFAULT_RECOMMENDED.filter(id => !recommendedIds.includes(id));
    const recommended = unique([...recommendedIds, ...fallbacks]).slice(0, 4);

    shell.refs.recommendedApps.innerHTML = recommended.map(id => {
        const app = getAppMeta(id);
        return `
          <button class="recommended-card" data-app-id="${id}" type="button">
            <div class="start-app-icon">${tileIcon(app.icon)}</div>
            <div class="start-app-meta">
              <strong>${app.label}</strong>
              <span>${shell.recent.includes(id) ? "Recently opened" : app.desc}</span>
            </div>
          </button>`;
    }).join("");
}

function handleStartGridClick(event) {
    const pinBtn = event.target.closest(".app-card-pin");
    if (pinBtn) {
        event.stopPropagation();
        togglePin(pinBtn.dataset.pinId);
        return;
    }

    const tile = event.target.closest(".start-app-card");
    if (!tile) return;
    launchApp(tile.dataset.appId);
}

function handleStartGridKeydown(event) {
    if (event.target.closest(".app-card-pin")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    const tile = event.target.closest(".start-app-card");
    if (!tile) return;

    event.preventDefault();
    launchApp(tile.dataset.appId);
}

function handleRecommendedClick(event) {
    const card = event.target.closest(".recommended-card");
    if (!card) return;
    launchApp(card.dataset.appId);
}

function togglePin(id) {
    shell.pins = shell.pins.includes(id)
        ? shell.pins.filter(item => item !== id)
        : [...shell.pins, id];
    saveValue(SHELL_KEYS.pins, shell.pins);
    renderTaskbar();
    renderStartMenu();
}

function clearRecentApps() {
    shell.recent = [];
    saveValue(SHELL_KEYS.recent, shell.recent);
    renderStartMenu();
}

function toggleStartMenu(force) {
    shell.startOpen = typeof force === "boolean" ? force : !shell.startOpen;
    shell.refs.startMenu.classList.toggle("open", shell.startOpen);
    shell.refs.startMenu.setAttribute("aria-hidden", String(!shell.startOpen));
    if (shell.startOpen) {
        shell.refs.startSearch.focus();
        toggleNotificationPanel(false);
    }
}

function toggleNotificationPanel(force) {
    shell.trayOpen = typeof force === "boolean" ? force : !shell.trayOpen;
    shell.refs.notificationPanel.classList.toggle("open", shell.trayOpen);
    shell.refs.notificationPanel.setAttribute("aria-hidden", String(!shell.trayOpen));
    if (shell.trayOpen) toggleStartMenu(false);
}

function toggleCheatMenu(force = !shell.cheatOpen) {
    shell.cheatOpen = force;
    shell.refs.cheatMenu.classList.toggle("open", shell.cheatOpen);
    shell.refs.cheatMenu.setAttribute("aria-hidden", String(!shell.cheatOpen));
}
window.toggleCheatMenu = toggleCheatMenu;

function toggleUpdateWindow(force = !shell.updateOpen) {
    if (!shell.refs.updateWindow) return;
    if (force) renderUpdateWindow();
    shell.updateOpen = force;
    shell.refs.updateWindow.classList.toggle("open", shell.updateOpen);
    shell.refs.updateWindow.setAttribute("aria-hidden", String(!shell.updateOpen));
    if (shell.updateOpen) {
        toggleStartMenu(false);
        toggleNotificationPanel(false);
        toggleCheatMenu(false);
    }
}
window.toggleUpdateWindow = toggleUpdateWindow;

function renderUpdateWindow() {
    if (!shell.refs.updateWindowBody) return;
    const updates = Array.isArray(window.SHELL_UPDATES) ? window.SHELL_UPDATES : [];
    if (!updates.length) {
        shell.refs.updateWindowBody.innerHTML = `<div class="update-entry"><div class="update-entry-summary">No update notes are available yet.</div></div>`;
        return;
    }

    shell.refs.updateWindowBody.innerHTML = updates.map((item, index) => `
      <article class="update-entry ${index === 0 ? "latest" : ""}">
        <div class="update-entry-head">
          <div>
            <h4>${item.title}</h4>
            <div class="update-entry-summary">${item.summary}</div>
          </div>
          <div class="update-badge-group">
            <span class="update-badge">v${item.version}</span>
            <span class="update-date">${item.date}</span>
          </div>
        </div>
        <ul class="update-list">${(item.changes || []).map(change => `<li>${change}</li>`).join("")}</ul>
      </article>`).join("");
}

function maybeShowUpdateWindow() {
    if (shell.updateShownThisSession) return;
    const updates = Array.isArray(window.SHELL_UPDATES) ? window.SHELL_UPDATES : [];
    if (!updates.length) return;

    shell.updateShownThisSession = true;
    saveValue(SHELL_KEYS.seenUpdateVersion, updates[0].version);
    setTimeout(() => toggleUpdateWindow(true), 220);
}

function notify(title, message) {
    const entry = {
        title,
        message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    shell.notifications.unshift(entry);
    shell.notifications = shell.notifications.slice(0, 12);
    saveValue(SHELL_KEYS.notifications, shell.notifications);
    renderNotifications();
}

function clearNotifications() {
    shell.notifications = [];
    saveValue(SHELL_KEYS.notifications, shell.notifications);
    renderNotifications();
}

function renderNotifications() {
    if (!shell.notifications.length) {
        shell.refs.notificationList.innerHTML = `<div class="notification-card"><strong>No new notifications</strong><span>Your desktop is quiet right now.</span></div>`;
        return;
    }

    shell.refs.notificationList.innerHTML = shell.notifications.map(item => `
      <div class="notification-card">
        <strong>${item.title}</strong>
        <div>${item.message}</div>
        <span>${item.time}</span>
      </div>`).join("");
}

function runCheat(code) {
    switch (code) {
        case "cascade":
            cascadeWindows();
            notify("Cheat: cascade", "All visible windows were neatly arranged.");
            break;
        case "matrix":
            setWallpaperPreset("matrix");
            notify("Cheat: matrix", "Matrix wallpaper enabled.");
            break;
        case "celebrate":
            notify("Cheat activated", "Confetti mode is simulated with a celebratory toast \u2728");
            break;
        case "pinall":
            shell.pins = unique([...DEFAULT_PINS, "paint", "terminal", "monitor", "about"]);
            saveValue(SHELL_KEYS.pins, shell.pins);
            renderTaskbar();
            renderStartMenu();
            notify("Cheat: pin all", "Core apps were pinned to the taskbar.");
            break;
        case "dark":
            applyTheme("dark");
            break;
        case "light":
            applyTheme("light");
            break;
    }
}

function cascadeWindows() {
    let index = 0;
    document.querySelectorAll(".window[data-app-id]").forEach(el => {
        if (!isVisible(el)) return;
        el.classList.remove("maximized");
        el.style.left = `${48 + index * 28}px`;
        el.style.top = `${34 + index * 24}px`;
        el.style.width = `${Math.min(920, shell.refs.desktop.clientWidth - 96)}px`;
        el.style.height = `${Math.min(620, shell.refs.desktop.clientHeight - 160)}px`;
        index += 1;
    });
}

function activateTaskbarApp(id) {
    const el = getWindowByAppId(id);
    if (!el) {
        launchApp(id);
        return;
    }

    if (!isVisible(el)) {
        showWindow(el, id);
        return;
    }

    const currentZ = Number(el.style.zIndex || 0);
    if (currentZ === shell.z) hideWindow(el, id);
    else bringToFront(el);
}

function launchApp(id) {
    toggleStartMenu(false);
    if (id === "browser") {
        showWindow(shell.refs.browserWindow, "browser");
        recordRecent(id);
        return;
    }

    if (typeof APPS !== "undefined" && APPS[id]) {
        APPS[id]();
        recordRecent(id);
    }
}
window.launchApp = launchApp;

function recordRecent(id) {
    shell.recent = [id, ...shell.recent.filter(item => item !== id)].slice(0, 12);
    saveValue(SHELL_KEYS.recent, shell.recent);
    renderStartMenu();
}

function createAppWindow(id, title, iconHtml, bodyHtml, width = 760, height = 520) {
    let existing = document.getElementById(`win_${id}`);
    if (existing) {
        showWindow(existing, id);
        return existing;
    }

    const offset = document.querySelectorAll(".window[data-app-id]").length * 24;
    existing = document.createElement("div");
    existing.className = "window";
    existing.id = `win_${id}`;
    existing.dataset.appId = id;
    existing.style.width = `${width}px`;
    existing.style.height = `${height}px`;
    existing.style.left = `${Math.max(32, 88 + offset)}px`;
    existing.style.top = `${Math.max(18, 42 + offset)}px`;
    existing.innerHTML = `
      <div class="window-header">
        <div class="window-title-area">
          ${normalizeWindowIcon(iconHtml)}
          <span class="window-title">${title}</span>
        </div>
        <div class="window-controls">
          <button class="app-min" title="Minimize"></button>
          <button class="app-max" title="Maximize"></button>
          <button class="app-close" title="Close"></button>
        </div>
      </div>
      <div class="window-body">${bodyHtml}</div>`;

    shell.refs.desktop.appendChild(existing);
    addResizeHandles(existing);
    wireWindow(existing, id);
    existing.querySelector(".app-min").onclick = () => hideWindow(existing, id);
    existing.querySelector(".app-close").onclick = () => hideWindow(existing, id);
    existing.querySelector(".app-max").onclick = () => toggleMaximize(existing);
    bringToFront(existing);
    renderTaskbar();
    return existing;
}
window.createAppWindow = createAppWindow;

function normalizeWindowIcon(iconHtml) {
    if (String(iconHtml).includes("<")) return iconHtml;
    return `<span class="window-icon shell-glyph">${iconHtml}</span>`;
}

function taskbarIcon(icon) {
    return String(icon).includes("<") ? icon : `<span class="shell-glyph">${icon}</span>`;
}

function tileIcon(icon) {
    return String(icon).includes("<") ? icon : `<span class="shell-glyph">${icon}</span>`;
}

function wireWindow(el) {
    if (el.dataset.wired === "true") return;
    el.dataset.wired = "true";
    el._wm = { maximized: false, snapped: null, prev: null };
    const header = el.querySelector(".window-header");

    el.addEventListener("mousedown", () => bringToFront(el));
    header.addEventListener("dblclick", () => toggleMaximize(el));
    header.addEventListener("mousedown", event => startWindowDrag(event, el));
}

function startWindowDrag(event, el) {
    if (event.button !== 0 || event.target.closest(".window-controls")) return;
    const wm = el._wm || { maximized: false };
    if (wm.maximized) return;

    bringToFront(el);
    const offsetX = event.clientX - el.offsetLeft;
    const offsetY = event.clientY - el.offsetTop;

    const onMove = moveEvent => {
        el.style.left = `${moveEvent.clientX - offsetX}px`;
        el.style.top = `${moveEvent.clientY - offsetY}px`;
        previewSnapZone(getSnapZone(moveEvent.clientX, moveEvent.clientY));
    };

    const onUp = upEvent => {
        const zone = getSnapZone(upEvent.clientX, upEvent.clientY);
        if (zone) applySnap(el, zone);
        previewSnapZone(null);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        renderTaskbar();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
}

function addResizeHandles(el) {
    if (el.querySelector(".resize-handle")) return;
    ["n", "s", "e", "w", "ne", "nw", "se", "sw"].forEach(dir => {
        const handle = document.createElement("div");
        handle.className = "resize-handle";
        handle.dataset.dir = dir;
        handle.addEventListener("mousedown", event => startResize(event, el, dir));
        el.appendChild(handle);
    });
}

function startResize(event, el, dir) {
    event.stopPropagation();
    event.preventDefault();
    bringToFront(el);

    const start = {
        x: event.clientX,
        y: event.clientY,
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight
    };

    const minWidth = 320;
    const minHeight = 220;

    const onMove = moveEvent => {
        const dx = moveEvent.clientX - start.x;
        const dy = moveEvent.clientY - start.y;
        let left = start.left;
        let top = start.top;
        let width = start.width;
        let height = start.height;

        if (dir.includes("e")) width = Math.max(minWidth, start.width + dx);
        if (dir.includes("s")) height = Math.max(minHeight, start.height + dy);
        if (dir.includes("w")) {
            width = Math.max(minWidth, start.width - dx);
            left = start.left + (start.width - width);
        }
        if (dir.includes("n")) {
            height = Math.max(minHeight, start.height - dy);
            top = start.top + (start.height - height);
        }

        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
    };

    const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
}

function bringToFront(el) {
    shell.z += 1;
    el.style.zIndex = String(shell.z);
    renderTaskbar();
}

function hideWindow(el) {
    el.style.transition = "opacity .18s ease, transform .18s ease";
    el.style.opacity = "0";
    el.style.transform = "scale(.98)";
    setTimeout(() => {
        el.style.display = "none";
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
        renderTaskbar();
    }, 180);
}

function showWindow(el) {
    el.style.display = "flex";
    el.style.opacity = "0";
    el.style.transform = "scale(.98)";
    bringToFront(el);
    requestAnimationFrame(() => {
        el.style.transition = "opacity .2s ease, transform .2s ease";
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
        renderTaskbar();
    });
}

function toggleMaximize(el) {
    const wm = el._wm || (el._wm = { maximized: false, snapped: null, prev: null });
    if (wm.maximized) {
        restoreWindow(el);
        return;
    }

    wm.prev = captureRect(el);
    applyRect(el, getSnapBounds("maximize"));
    wm.maximized = true;
    wm.snapped = "maximize";
    el.classList.add("maximized");
}

function restoreWindow(el) {
    const wm = el._wm;
    if (!wm || !wm.prev) return;
    applyRect(el, wm.prev);
    wm.maximized = false;
    wm.snapped = null;
    el.classList.remove("maximized");
}

function applySnap(el, zone) {
    const wm = el._wm || (el._wm = { maximized: false, snapped: null, prev: null });
    wm.prev = captureRect(el);
    applyRect(el, getSnapBounds(zone));
    wm.maximized = zone === "maximize";
    wm.snapped = zone;
    el.classList.toggle("maximized", zone === "maximize");
}

function captureRect(el) {
    return {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight
    };
}

function applyRect(el, rect) {
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
}

function getWorkArea() {
    const rect = shell.refs.desktop.getBoundingClientRect();
    const taskbarRect = shell.refs.taskbar.getBoundingClientRect();
    return {
        left: 8,
        top: 8,
        width: rect.width - 16,
        height: Math.max(280, taskbarRect.top - rect.top - 16)
    };
}

function getSnapZone(clientX, clientY) {
    const rect = shell.refs.desktop.getBoundingClientRect();
    const edge = 36;
    const work = getWorkArea();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (y <= edge && x <= rect.width * 0.34) return "top-left";
    if (y <= edge && x >= rect.width * 0.66) return "top-right";
    if (y <= edge) return "maximize";
    if (x <= edge && y <= work.height * 0.45) return "top-left";
    if (x <= edge && y >= work.height * 0.6) return "bottom-left";
    if (x >= rect.width - edge && y <= work.height * 0.45) return "top-right";
    if (x >= rect.width - edge && y >= work.height * 0.6) return "bottom-right";
    if (x <= edge) return "left";
    if (x >= rect.width - edge) return "right";
    return null;
}

function getSnapBounds(zone) {
    const area = getWorkArea();
    const halfW = Math.floor(area.width / 2);
    const halfH = Math.floor(area.height / 2);
    switch (zone) {
        case "left":
            return { left: area.left, top: area.top, width: halfW - 4, height: area.height };
        case "right":
            return { left: area.left + halfW + 4, top: area.top, width: halfW - 4, height: area.height };
        case "top-left":
            return { left: area.left, top: area.top, width: halfW - 4, height: halfH - 4 };
        case "top-right":
            return { left: area.left + halfW + 4, top: area.top, width: halfW - 4, height: halfH - 4 };
        case "bottom-left":
            return { left: area.left, top: area.top + halfH + 4, width: halfW - 4, height: halfH - 4 };
        case "bottom-right":
            return { left: area.left + halfW + 4, top: area.top + halfH + 4, width: halfW - 4, height: halfH - 4 };
        default:
            return { left: area.left, top: area.top, width: area.width, height: area.height };
    }
}

function previewSnapZone(zone) {
    if (!zone) {
        shell.refs.snapPreview.style.display = "none";
        return;
    }
    const rect = getSnapBounds(zone);
    shell.refs.snapPreview.style.display = "block";
    shell.refs.snapPreview.style.left = `${rect.left}px`;
    shell.refs.snapPreview.style.top = `${rect.top}px`;
    shell.refs.snapPreview.style.width = `${rect.width}px`;
    shell.refs.snapPreview.style.height = `${rect.height}px`;
}

function getWindowByAppId(id) {
    return id === "browser" ? shell.refs.browserWindow : document.getElementById(`win_${id}`);
}

function isVisible(el) {
    return !!el && el.style.display !== "none";
}

function applyTheme(theme, notifyUser = true) {
    shell.theme = theme;
    document.documentElement.dataset.theme = theme;
    saveValue(SHELL_KEYS.theme, theme);
    document.getElementById("trayThemeToggle").textContent = theme === "dark" ? "Light" : "Dark";
    if (notifyUser) notify("Theme updated", `${theme === "dark" ? "Dark" : "Light"} mode is active.`);
}
window.applyTheme = applyTheme;
window.setTheme = applyTheme;

function toggleTheme() {
    applyTheme(shell.theme === "dark" ? "light" : "dark");
}
window.toggleTheme = toggleTheme;

function applyWallpaper(name, custom) {
    if (custom) {
        shell.refs.desktop.style.background = `linear-gradient(180deg, rgba(15,23,42,.18), rgba(15,23,42,.42)), url(${custom}) center/cover no-repeat`;
        shell.refs.loginScreen.style.background = `linear-gradient(145deg, rgba(2,6,23,.62), rgba(23,37,84,.6)), url(${custom}) center/cover no-repeat`;
        return;
    }

    const wallpaper = WALLPAPERS[name] || WALLPAPERS.aurora;
    shell.refs.desktop.style.background = wallpaper.desktop;
    shell.refs.loginScreen.style.background = wallpaper.lock;
}

function setWallpaperPreset(name) {
    shell.wallpaper = name;
    shell.customWallpaper = "";
    saveValue(SHELL_KEYS.wallpaper, name);
    saveValue(SHELL_KEYS.wallpaperCustom, "");
    applyWallpaper(name, "");
    notify("Wallpaper updated", `${name[0].toUpperCase()}${name.slice(1)} wallpaper applied.`);
}
window.setWallpaperPreset = setWallpaperPreset;

function handleWallpaperUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

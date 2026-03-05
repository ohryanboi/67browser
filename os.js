// ── Boot → Login → Desktop ────────────────────────────────
window.addEventListener("load", () => {
    const bootScreen  = document.getElementById("bootScreen");
    const loginScreen = document.getElementById("loginScreen");
    const desktop     = document.getElementById("desktop");

    // Start with only boot screen visible
    loginScreen.style.display = "none";
    desktop.style.display     = "none";

    // After boot, fade to login
    setTimeout(() => {
        bootScreen.style.transition = "opacity 0.5s ease";
        bootScreen.style.opacity    = "0";
        setTimeout(() => {
            bootScreen.style.display  = "none";
            loginScreen.style.display = "flex";
            updateLoginClock();
        }, 500);
    }, 2500);
});

// Login clock (time + date on the lock screen)
function updateLoginClock() {
    const now  = new Date();
    const timeEl = document.getElementById("loginTime");
    const dateEl = document.getElementById("loginDate");
    if (!timeEl) return;
    timeEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
setInterval(updateLoginClock, 1000);

// Sign-in handler
function doLogin() {
    const pwd         = document.getElementById("loginPassword").value;
    const loginCard   = document.getElementById("loginCard");
    const loginScreen = document.getElementById("loginScreen");
    const desktop     = document.getElementById("desktop");

    if (pwd !== "67") {
        // Wrong password — shake the card
        loginCard.style.animation = "none";
        loginCard.offsetWidth;                      // reflow to restart
        loginCard.style.animation = "shake .35s ease";
        document.getElementById("loginPassword").value = "";
        document.getElementById("loginPassword").placeholder = "Wrong password";
        setTimeout(() => {
            document.getElementById("loginPassword").placeholder = "Password";
        }, 1500);
        return;
    }

    loginScreen.style.transition = "opacity 0.4s ease";
    loginScreen.style.opacity    = "0";
    setTimeout(() => {
        loginScreen.style.display = "none";
        desktop.style.display     = "block";
    }, 400);
}

document.getElementById("loginSubmit").onclick = doLogin;
document.getElementById("loginPassword").addEventListener("keydown", e => {
    if (e.key === "Enter") doLogin();
});

const win    = document.getElementById("browserWindow");
const header = win.querySelector(".window-header");

// ── Drag ──────────────────────────────────────────────
let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener("mousedown", e => {
    if (e.target.closest(".window-controls")) return;
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
});

document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top  = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => isDragging = false);

// ── Minimize ──────────────────────────────────────────
function hideWindow() {
    win.style.transition = "opacity .18s ease, transform .18s ease";
    win.style.opacity    = "0";
    win.style.transform  = "scale(0.96)";
    setTimeout(() => {
        win.style.display = "none";
        document.getElementById("browserTaskBtn").classList.remove("active");
    }, 180);
}

function showWindow() {
    win.style.display   = "flex";
    win.style.opacity   = "0";
    win.style.transform = "scale(0.96)";
    requestAnimationFrame(() => {
        win.style.transition = "opacity .18s ease, transform .18s ease";
        win.style.opacity    = "1";
        win.style.transform  = "scale(1)";
        document.getElementById("browserTaskBtn").classList.add("active");
    });
}

document.getElementById("minBtn").onclick = hideWindow;

// ── Close → just hide (keeps taskbar icon) ────────────
document.getElementById("closeBtn").onclick = hideWindow;

// ── Maximize / restore ────────────────────────────────
let isMaximized = false;
let prevState   = {};

document.getElementById("maxBtn").onclick = () => {
    win.style.transition = "all .2s cubic-bezier(.2,.8,.2,1)";
    if (!isMaximized) {
        prevState = { width: win.style.width, height: win.style.height,
                      top: win.style.top, left: win.style.left };
        win.style.width        = "100%";
        win.style.height       = "calc(100% - 48px)";
        win.style.top          = "0";
        win.style.left         = "0";
        win.style.borderRadius = "0";
    } else {
        win.style.width        = prevState.width  || "960px";
        win.style.height       = prevState.height || "620px";
        win.style.top          = prevState.top    || "40px";
        win.style.left         = prevState.left   || "80px";
        win.style.borderRadius = "8px";
    }
    isMaximized = !isMaximized;
};

// ── Taskbar button ────────────────────────────────────
document.getElementById("browserTaskBtn").classList.add("active");

document.getElementById("browserTaskBtn").onclick = () => {
    if (win.style.display === "none") {
        showWindow();
    } else {
        hideWindow();
    }
};

// ═══════════════════════════════════════════════════════
// GENERIC WINDOW FACTORY
// ═══════════════════════════════════════════════════════

let winZIndex = 10;

function bringToFront(el) {
    el.style.zIndex = ++winZIndex;
}

function createAppWindow(id, title, iconHtml, bodyHtml, w, h) {
    w = w || 760;
    h = h || 520;

    // If already created, just show it
    const existing = document.getElementById("win_" + id);
    if (existing) {
        appWindowShow(existing, id);
        return existing;
    }

    const desktop = document.getElementById("desktop");
    const offset  = document.querySelectorAll(".window").length * 24;

    const el = document.createElement("div");
    el.className = "window";
    el.id = "win_" + id;
    el.style.cssText = `width:${w}px;height:${h}px;top:${40 + offset}px;left:${80 + offset}px;`;

    el.innerHTML = `
      <div class="window-header">
        <div class="window-title-area">
          ${iconHtml}
          <span class="window-title" id="wtitle_${id}">${title}</span>
        </div>
        <div class="window-controls">
          <button class="app-min" title="Minimize"></button>
          <button class="app-max" title="Maximize"></button>
          <button class="app-close" title="Close"></button>
        </div>
      </div>
      <div class="window-body" id="wbody_${id}">${bodyHtml}</div>
    `;

    desktop.appendChild(el);
    wireAppWindow(el, id);
    ensureTaskbarBtn(id, title, iconHtml);
    bringToFront(el);
    return el;
}

function wireAppWindow(el, id) {
    const header = el.querySelector(".window-header");
    let dragging = false, ox = 0, oy = 0;
    let maxed = false, prevS = {};

    el.addEventListener("mousedown", () => bringToFront(el));

    header.addEventListener("mousedown", e => {
        if (e.target.closest(".window-controls")) return;
        dragging = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
    });
    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        el.style.left = (e.clientX - ox) + "px";
        el.style.top  = (e.clientY - oy) + "px";
    });
    document.addEventListener("mouseup", () => dragging = false);

    // Minimize
    el.querySelector(".app-min").onclick = () => appWindowHide(el, id);
    // Close = hide (keeps taskbar icon)
    el.querySelector(".app-close").onclick = () => appWindowHide(el, id);

    // Maximize
    el.querySelector(".app-max").onclick = () => {
        el.style.transition = "all .2s cubic-bezier(.2,.8,.2,1)";
        if (!maxed) {
            prevS = { w: el.style.width, h: el.style.height, t: el.style.top, l: el.style.left };
            el.style.cssText += ";width:100%;height:calc(100% - 48px);top:0;left:0;border-radius:0";
        } else {
            el.style.width = prevS.w; el.style.height = prevS.h;
            el.style.top = prevS.t;   el.style.left = prevS.l;
            el.style.borderRadius = "8px";
        }
        maxed = !maxed;
    };
}

function appWindowHide(el, id) {
    el.style.transition = "opacity .18s ease, transform .18s ease";
    el.style.opacity = "0"; el.style.transform = "scale(0.96)";
    setTimeout(() => {
        el.style.display = "none";
        const btn = document.getElementById("tbtn_" + id);
        if (btn) btn.classList.remove("active");
    }, 180);
}

function appWindowShow(el, id) {
    el.style.display = "flex";
    el.style.opacity = "0"; el.style.transform = "scale(0.96)";
    bringToFront(el);
    requestAnimationFrame(() => {
        el.style.transition = "opacity .18s ease, transform .18s ease";
        el.style.opacity = "1"; el.style.transform = "scale(1)";
        const btn = document.getElementById("tbtn_" + id);
        if (btn) btn.classList.add("active");
    });
}

function ensureTaskbarBtn(id, title, iconHtml) {
    if (document.getElementById("tbtn_" + id)) return;
    const icons = document.getElementById("taskIcons");
    const btn   = document.createElement("button");
    btn.className = "taskBtn active";
    btn.id = "tbtn_" + id;
    btn.title = title;
    btn.innerHTML = iconHtml;
    btn.onclick = () => {
        const el = document.getElementById("win_" + id);
        if (!el) return;
        if (el.style.display === "none") appWindowShow(el, id);
        else appWindowHide(el, id);
    };
    icons.appendChild(btn);
}

// ═══════════════════════════════════════════════════════
// START MENU
// ═══════════════════════════════════════════════════════

let startOpen = false;

document.getElementById("startBtn").onclick = e => {
    e.stopPropagation();
    startOpen = !startOpen;
    document.getElementById("startMenu").style.display = startOpen ? "flex" : "none";
};

document.addEventListener("click", e => {
    if (startOpen && !document.getElementById("startMenu").contains(e.target)
        && e.target.id !== "startBtn") {
        startOpen = false;
        document.getElementById("startMenu").style.display = "none";
    }
});

function launchApp(id) {
    startOpen = false;
    document.getElementById("startMenu").style.display = "none";
    if (typeof APPS !== "undefined" && APPS[id]) APPS[id]();
}

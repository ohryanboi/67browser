// ===============================
// 67Labs Browser Engine
// ===============================

const PROXY          = "https://67browser.ohryanho.workers.dev/?url=";
const PROXY_LIMIT    = 10000;
const PROXY_KEY      = "67labs_proxyCount";

// Read saved count
let proxyCount = 0;
try { proxyCount = parseInt(localStorage.getItem(PROXY_KEY)) || 0; } catch(_) {}

let proxyDisabled = proxyCount >= PROXY_LIMIT;

function isGoogleUrl(url) {
    return url.includes("google.com") || url.includes("googleapis.com");
}

function proxyUrl(url) {
    if (isGoogleUrl(url)) return url;
    if (proxyDisabled)    return url;          // limit hit — direct

    // Increment counter
    proxyCount++;
    try { localStorage.setItem(PROXY_KEY, String(proxyCount)); } catch(_) {}

    // Warn at 9,500 so user knows limit is approaching
    if (proxyCount === 9500) showProxyToast("⚠️ Proxy almost full — 500 requests left.", "#e6a817");

    // Disable at limit
    if (proxyCount >= PROXY_LIMIT) {
        proxyDisabled = true;
        showProxyToast("🚫 Proxy limit reached (10,000). Loading pages directly — some sites may not work.", "#c42b1c", 6000);
        return url;
    }

    return PROXY + encodeURIComponent(url);
}

function showProxyToast(msg, color = "#333", duration = 4000) {
    const t = document.createElement("div");
    t.style.cssText = `
        position:fixed; bottom:64px; left:50%; transform:translateX(-50%);
        background:${color}; color:#fff; padding:9px 18px; border-radius:6px;
        font-size:12px; font-family:inherit; box-shadow:0 4px 16px rgba(0,0,0,.25);
        z-index:99999; white-space:nowrap; pointer-events:none;
        animation:fadeIn .25s ease;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, duration);
}

/** Reset the proxy counter (call from console if needed: resetProxyCount()) */
function resetProxyCount() {
    proxyCount = 0;
    proxyDisabled = false;
    try { localStorage.setItem(PROXY_KEY, "0"); } catch(_) {}
    showProxyToast("✅ Proxy counter reset — proxy re-enabled.", "#0067c0");
}

const frame = document.getElementById("browserFrame");
const input = document.getElementById("urlInput");

// Navigation state
let backStack    = [];
let forwardStack = [];
let currentUrl   = "";

// Frame load tracking
let lastFrameProxySrc = "";
let pendingLoads = 0;

// -----------------------------------------------
// Core navigation
// -----------------------------------------------

function looksLikeUrl(value) {
    return !value.includes(" ") && /^[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})(\/|$|:|\?)/.test(value);
}

function setFrame(url) {
    lastFrameProxySrc = proxyUrl(url);
    pendingLoads++;
    frame.src = lastFrameProxySrc;
}

function setWindowTitle(url) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        document.querySelector(".window-title").textContent = host || "Browser";
    } catch(_) {}
}

function loadPage(value, pushHistory = true) {
    let url = value.trim();

    if (!url.startsWith("http")) {
        url = looksLikeUrl(url)
            ? "https://" + url
            : "https://www.google.com/search?q=" + encodeURIComponent(url) + "&igu=1";
    }

    if (pushHistory && currentUrl && currentUrl !== url) {
        backStack.push(currentUrl);
        forwardStack = [];
    }

    currentUrl = url;
    input.value = url;
    setFrame(url);
    setWindowTitle(url);
    updateNavButtons();
}

function goBack() {
    if (!backStack.length) return;
    forwardStack.push(currentUrl);
    const url = backStack.pop();
    currentUrl = url;
    input.value = url;
    setFrame(url);
    setWindowTitle(url);
    updateNavButtons();
}

function goForward() {
    if (!forwardStack.length) return;
    backStack.push(currentUrl);
    const url = forwardStack.pop();
    currentUrl = url;
    input.value = url;
    setFrame(url);
    setWindowTitle(url);
    updateNavButtons();
}

function updateNavButtons() {
    document.getElementById("backBtn").disabled = backStack.length === 0;
    document.getElementById("fwdBtn").disabled  = forwardStack.length === 0;
}

// -----------------------------------------------
// Controls
// -----------------------------------------------

input.addEventListener("keydown", e => {
    if (e.key === "Enter") loadPage(input.value);
});

document.getElementById("backBtn").onclick    = () => goBack();
document.getElementById("fwdBtn").onclick     = () => goForward();
document.getElementById("refreshBtn").onclick = () => {
    const url = lastFrameProxySrc || proxyUrl(input.value);
    pendingLoads += 2;
    frame.src = "about:blank";
    setTimeout(() => { frame.src = url; }, 30);
};

// -----------------------------------------------
// Bridge: postMessage from worker-injected script
// gives us the real URL on in-frame navigation
// -----------------------------------------------
window.addEventListener("message", e => {
    if (!e.data || typeof e.data.type !== "string") return;
    if (!e.data.type.startsWith("67labs:")) return;

    const { type, url: rawUrl } = e.data;
    if (type !== "67labs:load" && type !== "67labs:url") return;

    let realUrl = rawUrl;
    if (rawUrl && rawUrl.startsWith(PROXY)) {
        try { realUrl = decodeURIComponent(rawUrl.slice(PROXY.length)); } catch(_) {}
    }

    if (!realUrl || realUrl === "about:blank" || realUrl === currentUrl) return;

    // New URL from bridge → push old to back stack
    if (currentUrl) backStack.push(currentUrl);
    forwardStack = [];
    currentUrl = realUrl;
    input.value = realUrl;
    lastFrameProxySrc = proxyUrl(realUrl);
    setWindowTitle(realUrl);
    updateNavButtons();
});

// -----------------------------------------------
// frame load — detect link-click navigation
// -----------------------------------------------
frame.addEventListener("load", () => {
    if (pendingLoads > 0) {
        pendingLoads--;
    } else {
        // Not triggered by us → user clicked a link inside the iframe
        const lastBack = backStack[backStack.length - 1];
        if (currentUrl && currentUrl !== lastBack) {
            backStack.push(currentUrl);
            forwardStack = [];
            updateNavButtons();
        }
    }

    // Try to update window title from page
    try {
        const title = frame.contentDocument?.title;
        if (title) document.querySelector(".window-title").textContent =
            title.length > 40 ? title.slice(0, 40) + "…" : title;
    } catch(_) {}
});

// -----------------------------------------------
// Init
// -----------------------------------------------
loadPage("https://www.google.com/?igu=1", false);

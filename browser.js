// ===============================
// 67Labs Browser Engine PRO
// ===============================

const PROXY = "https://67browser.ohryanho.workers.dev/?url=";

function isGoogleUrl(url) {
    return url.includes("google.com") || url.includes("googleapis.com");
}

function proxyUrl(url) {
    return isGoogleUrl(url) ? url : PROXY + encodeURIComponent(url);
}

const frame = document.getElementById("browserFrame");
const input = document.getElementById("urlInput");
const tabBar = document.getElementById("tabBar");
const bookmarksBar = document.getElementById("bookmarksBar");

let tabs = [];
let activeTab = 0;

let historyList, bookmarks;
try {
    historyList = JSON.parse(localStorage.getItem("history")) || [];
    bookmarks   = JSON.parse(localStorage.getItem("bookmarks")) || [];
} catch(e) {
    historyList = [];
    bookmarks   = [];
}

// -------------------------------
// TAB SYSTEM
// -------------------------------

function saveTabs() {
    try {
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.setItem("activeTab", String(activeTab));
    } catch(e) {}
}

function createTabElement(tabData) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.draggable = true;
    tab.dataset.id = tabData.id;
    tab.innerHTML = `
        <span class="tabTitle">${tabData.title}</span>
        <span class="closeTab">✕</span>
    `;
    tab.onclick = () => switchTab(tabData.id);
    tab.querySelector(".closeTab").onclick = (e) => {
        e.stopPropagation();
        closeTab(tabData.id);
    };
    enableTabDrag(tab);
    tabBar.insertBefore(tab, document.getElementById("newTabBtn"));
    return tab;
}

function createTab(url="https://www.google.com/?igu=1", title="New Tab") {
    const tabId = Date.now();
    const tabData = { id: tabId, url, title, backStack: [], forwardStack: [] };
    tabs.push(tabData);
    createTabElement(tabData);
    switchTab(tabId);
    saveTabs();
}

function switchTab(id) {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;

    activeTab = id;
    setFrame(tab.url);
    input.value = tab.url;

    document.querySelectorAll(".tab").forEach(t => {
        t.classList.toggle("active", t.dataset.id == id);
    });
    updateNavButtons();
    updateBookmarkBtn();
    saveTabs();
}

function closeTab(id) {
    if (tabs.length === 1) return;

    tabs = tabs.filter(t => t.id !== id);
    document.querySelector(`.tab[data-id='${id}']`).remove();
    switchTab(tabs[tabs.length - 1].id);
    saveTabs();
}

document.getElementById("newTabBtn").onclick = () => createTab();

// -------------------------------
// TAB DRAG REORDER
// -------------------------------

function enableTabDrag(tab) {
    tab.addEventListener("dragstart", e => {
        e.dataTransfer.setData("id", tab.dataset.id);
    });

    tab.addEventListener("dragover", e => e.preventDefault());

    tab.addEventListener("drop", e => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("id");
        const dragged = document.querySelector(`.tab[data-id='${draggedId}']`);
        tabBar.insertBefore(dragged, tab);
    });
}

// -------------------------------
// LOAD PAGE
// -------------------------------

function looksLikeUrl(value) {
    // Has no spaces AND looks like a domain (letters, dots, optional path)
    return !value.includes(" ") && /^[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})(\/|$|:|\?)/.test(value);
}

function loadPage(value, addToHistory = true) {
    let url = value.trim();

    if (!url.startsWith("http")) {
        if (looksLikeUrl(url)) {
            url = "https://" + url;
        } else {
            url = "https://www.google.com/search?q=" + encodeURIComponent(url) + "&igu=1";
        }
    }

    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;

    if (addToHistory && tab.url && tab.url !== url) {
        tab.backStack = tab.backStack || [];
        tab.backStack.push(tab.url);
        tab.forwardStack = [];
    }

    tab.url = url;
    setFrame(url);
    input.value = url;

    historyList.push({ url, time: Date.now() });
    try { localStorage.setItem("history", JSON.stringify(historyList)); } catch(e) {}

    updateNavButtons();
    updateBookmarkBtn();
    saveTabs();
}

function goBack() {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab || !tab.backStack || !tab.backStack.length) return;
    tab.forwardStack = tab.forwardStack || [];
    tab.forwardStack.push(tab.url);
    const url = tab.backStack.pop();
    tab.url = url;
    setFrame(url);
    input.value = url;
    updateNavButtons();
    updateBookmarkBtn();
    saveTabs();
}

function goForward() {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab || !tab.forwardStack || !tab.forwardStack.length) return;
    tab.backStack = tab.backStack || [];
    tab.backStack.push(tab.url);
    const url = tab.forwardStack.pop();
    tab.url = url;
    setFrame(url);
    input.value = url;
    updateNavButtons();
    updateBookmarkBtn();
    saveTabs();
}

function updateNavButtons() {
    const tab = tabs.find(t => t.id === activeTab);
    document.getElementById("backBtn").disabled = !tab || !tab.backStack || !tab.backStack.length;
    document.getElementById("fwdBtn").disabled  = !tab || !tab.forwardStack || !tab.forwardStack.length;
}

input.addEventListener("keydown", e => {
    if (e.key === "Enter") loadPage(input.value);
});

document.getElementById("backBtn").onclick    = () => goBack();
document.getElementById("fwdBtn").onclick     = () => goForward();
document.getElementById("homeBtn").onclick    = () => loadPage("https://www.google.com/?igu=1");
document.getElementById("refreshBtn").onclick = () => {
    const url = lastFrameProxySrc || proxyUrl(input.value);
    pendingLoads += 2;          // about:blank load + real URL load
    frame.src = "about:blank";
    setTimeout(() => { frame.src = url; }, 30);
};

// -------------------------------
// BOOKMARKS
// -------------------------------

function renderBookmarks() {
    bookmarksBar.innerHTML = "";
    bookmarks.forEach((bm, index) => {
        const b = document.createElement("div");
        b.className = "bookmark";
        b.textContent = bm.title;
        b.onclick = () => loadPage(bm.url);

        b.oncontextmenu = (e) => {
            e.preventDefault();
            bookmarks.splice(index, 1);
            try { localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); } catch(e) {}
            renderBookmarks();
        };

        bookmarksBar.appendChild(b);
    });
}

// Track what we last explicitly sent to the frame (for refresh)
let lastFrameProxySrc = "";
// Count of loads WE triggered (setFrame / refresh) so frame.load can tell the difference
let pendingLoads = 0;

function setFrame(url) {
    lastFrameProxySrc = proxyUrl(url);
    pendingLoads++;
    frame.src = lastFrameProxySrc;
}

// -----------------------------------------------
// Bridge: listen for postMessage from worker.js's
// injected script → gives us the real URL after
// every in-frame navigation (link click, redirect)
// -----------------------------------------------
window.addEventListener("message", e => {
    if (!e.data || typeof e.data.type !== "string") return;
    if (!e.data.type.startsWith("67labs:")) return;

    const { type, url: rawUrl } = e.data;

    if (type === "67labs:load" || type === "67labs:url") {
        const tab = tabs.find(t => t.id === activeTab);
        if (!tab) return;

        // Decode proxy-wrapped URLs
        let realUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith(PROXY)) {
            try { realUrl = decodeURIComponent(rawUrl.slice(PROXY.length)); } catch(_) {}
        }

        if (!realUrl || realUrl === "about:blank" || realUrl === tab.url) return;

        // New URL arrived from the bridge — treat as navigation
        const lastBack = tab.backStack?.[tab.backStack.length - 1];
        if (tab.url && tab.url !== lastBack) {
            tab.backStack = tab.backStack || [];
            tab.backStack.push(tab.url);
        }
        tab.forwardStack = [];
        tab.url = realUrl;
        input.value = realUrl;
        lastFrameProxySrc = proxyUrl(realUrl);
        updateNavButtons();
        updateBookmarkBtn();
        saveTabs();
    }
});

// -----------------------------------------------
// frame load — detect link-click navigation
// -----------------------------------------------
frame.addEventListener("load", () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;

    if (pendingLoads > 0) {
        // We triggered this load (address bar / back / forward / refresh)
        pendingLoads--;
    } else {
        // We did NOT trigger this → user clicked a link inside the iframe
        // Push the last known URL onto the back stack so Back works
        const lastBack = tab.backStack?.[tab.backStack.length - 1];
        if (tab.url && tab.url !== lastBack) {
            tab.backStack = tab.backStack || [];
            tab.backStack.push(tab.url);
            tab.forwardStack = [];
            updateNavButtons();
            saveTabs();
        }
    }

    // Update tab title (may fail cross-origin — that's fine)
    try {
        const title = frame.contentDocument?.title || tab.url;
        if (title) {
            tab.title = title;
            const tabEl = document.querySelector(`.tab[data-id='${tab.id}'] .tabTitle`);
            if (tabEl) tabEl.textContent = title.length > 16 ? title.slice(0, 16) + "…" : title;
        }
    } catch(_) {}

    saveTabs();
});

renderBookmarks();

// -------------------------------
// BOOKMARKS BUTTON
// -------------------------------

function updateBookmarkBtn() {
    const url = input.value;
    const btn = document.getElementById("bookmarkBtn");
    const isBookmarked = bookmarks.some(b => b.url === url);
    btn.textContent = isBookmarked ? "★" : "☆";
    btn.title = isBookmarked ? "Remove bookmark" : "Bookmark this page";
}

document.getElementById("bookmarkBtn").onclick = () => {
    const url = input.value;
    const title = frame.contentDocument?.title || url;
    const idx = bookmarks.findIndex(b => b.url === url);
    if (idx === -1) {
        bookmarks.push({ title, url });
    } else {
        bookmarks.splice(idx, 1);
    }
    try { localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); } catch(e) {}
    renderBookmarks();
    updateBookmarkBtn();
};

// -------------------------------
// HISTORY PANEL
// -------------------------------

const historyPanel = document.getElementById("historyPanel");
let historyOpen = false;

function renderHistoryPanel() {
    historyPanel.innerHTML = `<div class="history-header"><span>History</span><button id="clearHistoryBtn">Clear</button></div>`;
    const entries = [...historyList].reverse();
    if (entries.length === 0) {
        historyPanel.innerHTML += `<div class="history-empty">No history yet.</div>`;
    } else {
        entries.forEach(entry => {
            const url = typeof entry === "string" ? entry : entry.url;
            const item = document.createElement("div");
            item.className = "history-item";
            item.textContent = url;
            item.title = url;
            item.onclick = () => { loadPage(url); toggleHistoryPanel(false); };
            historyPanel.appendChild(item);
        });
    }
    document.getElementById("clearHistoryBtn").onclick = () => {
        historyList = [];
        try { localStorage.setItem("history", JSON.stringify(historyList)); } catch(e) {}
        renderHistoryPanel();
    };
}

function toggleHistoryPanel(force) {
    historyOpen = force !== undefined ? force : !historyOpen;
    if (historyOpen) {
        renderHistoryPanel();
        historyPanel.style.display = "block";
    } else {
        historyPanel.style.display = "none";
    }
}

document.getElementById("historyBtn").onclick = () => toggleHistoryPanel();

// -------------------------------
// DOWNLOAD MANAGER
// -------------------------------

function fakeDownload(file="file.zip") {
    const panel = document.createElement("div");
    panel.className = "downloadItem";
    panel.innerHTML = `
        <div>${file}</div>
        <div class="progressBar"><div class="progress"></div></div>
    `;
    document.body.appendChild(panel);

    const progress = panel.querySelector(".progress");
    let width = 0;

    const interval = setInterval(() => {
        width += 5;
        progress.style.width = width + "%";
        if (width >= 100) clearInterval(interval);
    }, 200);
}

// -------------------------------
// DEVTOOLS PANEL
// -------------------------------

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    openDevTools();
});

function openDevTools() {
    const dev = document.createElement("div");
    dev.className = "devtools";
    dev.innerHTML = `
        <div class="devHeader">Developer Tools <span id="closeDev">✕</span></div>
        <div class="devContent">
            <pre>${input.value}</pre>
        </div>
    `;
    document.body.appendChild(dev);

    document.getElementById("closeDev").onclick = () => dev.remove();
}

// INIT - restore saved tabs or create default
let savedTabs = [], savedActiveTab = null;
try {
    savedTabs = JSON.parse(localStorage.getItem("tabs")) || [];
    savedActiveTab = parseInt(localStorage.getItem("activeTab")) || null;
    // Ensure all restored tabs have stacks
    savedTabs = savedTabs.map(t => ({
        ...t,
        backStack: t.backStack || [],
        forwardStack: t.forwardStack || []
    }));
} catch(e) {}

if (savedTabs.length > 0) {
    tabs = savedTabs;
    savedTabs.forEach(t => createTabElement(t));
    switchTab(savedActiveTab && savedTabs.find(t => t.id === savedActiveTab) ? savedActiveTab : tabs[tabs.length - 1].id);
} else {
    createTab();
}
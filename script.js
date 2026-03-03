/* ================= BASIC BROWSER ================= */

const frame = document.getElementById("browserFrame");
const urlInput = document.getElementById("urlInput");
const progress = document.getElementById("progress");
const lockIcon = document.getElementById("lockIcon");

const homeBtn = document.getElementById("homeBtn");
const refreshBtn = document.getElementById("refreshBtn");
const goBtn = document.getElementById("goBtn");

const HOME_PAGE = "https://www.google.com/search?igu=1";

/* ================= NAVIGATION ================= */

function navigate(url) {
    frame.style.opacity = "0";
    setTimeout(() => {
        frame.src = url;
        frame.style.opacity = "1";
    }, 150);

    urlInput.value = url;
    updateLock(url);
    simulateLoading();
}

function loadPage() {
    let value = urlInput.value.trim();
    if (!value) return;

    let finalUrl;

    if (!value.includes(".") || value.includes(" ")) {
        finalUrl = "https://www.google.com/search?q=" +
            encodeURIComponent(value) + "&igu=1";
    } else {
        if (!value.startsWith("http")) value = "https://" + value;
        finalUrl = value;
    }

    navigate(finalUrl);
}

homeBtn.onclick = () => navigate(HOME_PAGE);

refreshBtn.onclick = () => {
    frame.src = frame.src;
    simulateLoading();
};

goBtn.onclick = loadPage;

urlInput.addEventListener("keydown", e => {
    if (e.key === "Enter") loadPage();
});

function updateLock(url) {
    lockIcon.textContent = url.startsWith("https") ? "🔒" : "⚠️";
}

function simulateLoading() {
    progress.style.width = "20%";
    setTimeout(() => progress.style.width = "60%", 200);
    setTimeout(() => progress.style.width = "90%", 400);

    frame.onload = () => {
        progress.style.width = "100%";
        setTimeout(() => progress.style.width = "0%", 300);
    };
}

/* ================= WEB OS SYSTEM ================= */

function initOS() {

    /* BOOT SCREEN */
    const boot = document.createElement("div");
    boot.style.position = "fixed";
    boot.style.inset = "0";
    boot.style.background = "#000";
    boot.style.color = "#0f0";
    boot.style.display = "flex";
    boot.style.alignItems = "center";
    boot.style.justifyContent = "center";
    boot.style.fontSize = "22px";
    boot.style.zIndex = "9999";
    boot.innerText = "Booting WebOS...";
    document.body.appendChild(boot);

    setTimeout(() => {
        boot.innerText = "Loading system files...";
    }, 1500);

    setTimeout(() => {
        boot.remove();
        showLogin();
    }, 3000);
}

/* ================= LOGIN SCREEN ================= */

function showLogin() {

    const login = document.createElement("div");
    login.style.position = "fixed";
    login.style.inset = "0";
    login.style.background = "linear-gradient(135deg,#1e1e2f,#111)";
    login.style.display = "flex";
    login.style.flexDirection = "column";
    login.style.alignItems = "center";
    login.style.justifyContent = "center";
    login.style.color = "white";
    login.style.zIndex = "9999";

    const title = document.createElement("h1");
    title.innerText = "Welcome";

    const btn = document.createElement("button");
    btn.innerText = "Login";
    btn.style.padding = "10px 30px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
        login.remove();
        enableDesktop();
    };

    login.appendChild(title);
    login.appendChild(btn);
    document.body.appendChild(login);
}

/* ================= DESKTOP ================= */

function enableDesktop() {

    document.body.style.background =
        "url('https://images.unsplash.com/photo-1503264116251-35a269479413') center/cover no-repeat";

    createTaskbar();
    makeWindowDraggable();
}

/* ================= TASKBAR ================= */

function createTaskbar() {

    const taskbar = document.createElement("div");
    taskbar.style.position = "fixed";
    taskbar.style.bottom = "0";
    taskbar.style.left = "0";
    taskbar.style.width = "100%";
    taskbar.style.height = "40px";
    taskbar.style.background = "rgba(0,0,0,0.7)";
    taskbar.style.display = "flex";
    taskbar.style.alignItems = "center";
    taskbar.style.justifyContent = "space-between";
    taskbar.style.padding = "0 15px";
    taskbar.style.color = "white";

    const appBtn = document.createElement("button");
    appBtn.innerText = "🌐 Browser";
    appBtn.onclick = () => toggleWindow();

    const clock = document.createElement("div");
    setInterval(() => {
        clock.innerText = new Date().toLocaleTimeString();
    }, 1000);

    taskbar.appendChild(appBtn);
    taskbar.appendChild(clock);

    document.body.appendChild(taskbar);
}

/* ================= WINDOW CONTROL ================= */

function toggleWindow() {
    const win = document.getElementById("browserWindow");
    win.style.display = win.style.display === "none" ? "block" : "none";
}

function makeWindowDraggable() {

    const win = document.getElementById("browserWindow");
    const header = document.getElementById("browserHeader");

    let isDragging = false, offsetX, offsetY;

    header.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    };

    document.onmouseup = () => isDragging = false;

    document.onmousemove = (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";

        // SNAP LEFT
        if (e.clientX < 10) {
            win.style.left = "0";
            win.style.top = "0";
            win.style.width = "50%";
            win.style.height = "100%";
        }

        // SNAP RIGHT
        if (e.clientX > window.innerWidth - 10) {
            win.style.left = "50%";
            win.style.top = "0";
            win.style.width = "50%";
            win.style.height = "100%";
        }

        // SNAP FULL
        if (e.clientY < 5) {
            win.style.left = "0";
            win.style.top = "0";
            win.style.width = "100%";
            win.style.height = "100%";
        }
    };
}

/* ================= MINIMIZE / MAXIMIZE ================= */

document.getElementById("minBtn").onclick = () => {
    document.getElementById("browserWindow").style.display = "none";
};

document.getElementById("maxBtn").onclick = () => {
    const win = document.getElementById("browserWindow");
    win.style.left = "0";
    win.style.top = "0";
    win.style.width = "100%";
    win.style.height = "100%";
};

/* ================= START ================= */

initOS();
navigate(HOME_PAGE);
// Boot sequence
window.addEventListener("load", () => {
    const bootScreen = document.getElementById("bootScreen");
    const desktop = document.getElementById("desktop");
    desktop.style.display = "none";
    setTimeout(() => {
        bootScreen.style.transition = "opacity 0.6s ease";
        bootScreen.style.opacity = "0";
        setTimeout(() => {
            bootScreen.style.display = "none";
            desktop.style.display = "block";
        }, 600);
    }, 2500);
});

const win = document.getElementById("browserWindow");
const header = win.querySelector(".window-header");

let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
});

document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => isDragging = false);

// Smooth minimize animation
document.getElementById("minBtn").onclick = () => {
    win.style.transition = "all .4s cubic-bezier(.2,.8,.2,1)";
    win.style.transform = "scale(.1)";
    win.style.opacity = "0";
    setTimeout(() => win.style.display = "none", 400);
};

// Maximize / restore
let isMaximized = false;
let prevWinState = {};

document.getElementById("maxBtn").onclick = () => {
    win.style.transition = "all .3s cubic-bezier(.2,.8,.2,1)";
    if (!isMaximized) {
        prevWinState = { width: win.style.width, height: win.style.height, top: win.style.top, left: win.style.left };
        win.style.width = "100%";
        win.style.height = "calc(100% - 45px)";
        win.style.top = "0";
        win.style.left = "0";
        win.style.borderRadius = "0";
    } else {
        win.style.width = prevWinState.width || "900px";
        win.style.height = prevWinState.height || "600px";
        win.style.top = prevWinState.top || "50px";
        win.style.left = prevWinState.left || "100px";
        win.style.borderRadius = "12px";
    }
    isMaximized = !isMaximized;
};

// Taskbar browser button - toggle show/hide
document.getElementById("browserTaskBtn").onclick = () => {
    if (win.style.display === "none") {
        win.style.display = "flex";
        setTimeout(() => {
            win.style.transform = "scale(1)";
            win.style.opacity = "1";
        }, 10);
    } else {
        win.style.transition = "all .4s cubic-bezier(.2,.8,.2,1)";
        win.style.transform = "scale(.1)";
        win.style.opacity = "0";
        setTimeout(() => win.style.display = "none", 400);
    }
};
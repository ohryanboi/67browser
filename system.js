// Clock + date (Win11 system tray style)
function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("clockDate").textContent =
        now.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });
}
setInterval(updateClock, 1000);
updateClock();


const timerDiv = document.getElementById("timer-div");
const countdownMinutes = 2;
const reblockMinutes = 60;

let timeSet = Date.now();
let replacing = false;
setInterval(async () => {
    const timeLeft = countdownMinutes * 60 * 1000 - (Date.now() - timeSet);
    timerDiv.innerHTML = new Date(timeLeft)
        .toISOString().substr(11, 8);
    if (timeLeft < 1000) {
        chrome.alarms.create("reblock", {delayInMinutes: reblockMinutes});
        const reblockAlarm = await chrome.alarms.get("reblock");
        await chrome.storage.local.set({reblockTime: reblockAlarm.scheduledTime, blocking: false});
        loadUnblocked();
    }
});

function loadUnblocked() {
    const dest = new URL(window.location.href).searchParams.get("dest");
    replacing = true;
    window.location.replace(dest);
}

document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden" && !replacing) {
        const tab = await chrome.tabs.getCurrent();
        setTimeout(() => chrome.tabs.remove(tab.id), 1);
    }
});
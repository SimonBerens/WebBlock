import {setData, getData, renderMotivationHtml} from "./utils.js";

if (!document.hasFocus()) close();

getData().then(data => {

    const timerDiv = document.getElementById("timer-div");
    if (timerDiv === null) {
        console.error("Couldn't find timer-div");
        return;
    }

    let timeSet = Date.now();
    let replacing = false;
    setInterval(async () => {
        const timeLeft = data.countdownLengthMinutes * 60 * 1000 - (Date.now() - timeSet);
        timerDiv.innerHTML = new Date(timeLeft)
            .toISOString().substring(11, 19);
        if (timeLeft < 1000) {
            chrome.alarms.create("reblock", {delayInMinutes: data.reblockLengthMinutes});
            const reblockAlarm = await chrome.alarms.get("reblock");
            await setData({...data, reblockingAt: reblockAlarm.scheduledTime, blocking: false})
            loadUnblocked();
        }
    });

    function loadUnblocked() {
        const dest = new URL(window.location.href).searchParams.get("dest");
        if (dest === null) {
            console.error("Couldn't get 'dest' param from URL");
            return;
        }
        replacing = true;
        window.location.replace(dest);
    }

    window.addEventListener("blur", async () => {
        const tabId = (await chrome.tabs.getCurrent()).id ?? -1;
        if (tabId === -1) return;
        setTimeout(() => chrome.tabs.remove(tabId), 1);
    });
    renderMotivationHtml(data.motivationList, document.getElementById("suggested-actions-display") as HTMLDivElement);
});
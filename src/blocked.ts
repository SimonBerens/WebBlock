import {setData, useData} from "./utils.js";

useData(data => {

    const timerDiv = document.getElementById("timer-div");

    let timeSet = Date.now();
    let replacing = false;
    setInterval(async () => {
        const timeLeft = data.countdownLengthMinutes * 60 * 1000 - (Date.now() - timeSet);
        timerDiv.innerHTML = new Date(timeLeft)
            .toISOString().substr(11, 8);
        if (timeLeft < 1000) {
            chrome.alarms.create("reblock", {delayInMinutes: data.reblockLengthMinutes});
            const reblockAlarm = await chrome.alarms.get("reblock");
            await setData({...data, reblockingAt: reblockAlarm.scheduledTime, blocking: false})
            loadUnblocked();
        }
    });

    function loadUnblocked() {
        const dest = new URL(window.location.href).searchParams.get("dest");
        replacing = true;
        window.location.replace(dest);
    }

    window.addEventListener("blur", async () => {
        const tab = await chrome.tabs.getCurrent();
        setTimeout(() => chrome.tabs.remove(tab.id), 1);
    });

    (document.getElementById("suggested-actions-display") as HTMLDivElement).innerHTML = data.suggestedActions;
});
import {getData} from "./utils.js";

document.getElementById("goToOptions")?.addEventListener("click",
    () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}));

const popupTimerDiv = document.getElementById("popup-timer-div");


getData().then(({blocking, reblockingAt}) => {
    if (popupTimerDiv === null) {
        console.log("Cannot find popup-timer-div");
        return;
    }
    if (!blocking) {
        const interval = setInterval(async () => {
            const timeLeft = reblockingAt - Date.now();
            popupTimerDiv.innerHTML = new Date(timeLeft)
                .toISOString().substr(11, 8);
            if (timeLeft < 1000) {
                clearInterval(interval);
                popupTimerDiv.innerHTML = "Blocking";
            }
        });
    } else {
        popupTimerDiv.innerHTML = "Blocking";
    }
});
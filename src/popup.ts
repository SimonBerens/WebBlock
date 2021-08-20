import {useData} from "./utils.js";

document.getElementById("goToOptions").addEventListener("click",
    () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}));

const popupTimerDiv = document.getElementById("popup-timer-div");


useData(({blocking, reblockingAt}) => {
    if (!blocking) {
        const interval = setInterval(async () => {
            const timeLeft = reblockingAt - Date.now();
            popupTimerDiv.innerHTML = new Date(timeLeft)
                .toISOString().substr(11, 8);
            if (timeLeft < 1000) {
                clearInterval(interval);
                popupTimerDiv.innerHTML = "blocking";
            }
        });
    } else {
        popupTimerDiv.innerHTML = "blocking";
    }
});
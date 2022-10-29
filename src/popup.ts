import {getData} from "./utils.js";

document.getElementById("goToOptions")?.addEventListener("click",
    () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}));

const popupTimerDiv = document.getElementById("popup-timer-div") as HTMLDivElement;
const reblockingTextDiv = document.getElementById("reblocking-text") as HTMLDivElement;


getData().then(({blocking, reblockingAt}) => {
    if (popupTimerDiv === null) {
        console.log("Cannot find popup-timer-div");
        return;
    }
    if (!blocking) {
        const interval = setInterval(async () => {
            const timeLeft = reblockingAt - Date.now();
            if (timeLeft < 1000) {
                popupTimerDiv.innerHTML = "Blocking";
                reblockingTextDiv.innerHTML = "";
                clearInterval(interval);
            } else {
                reblockingTextDiv.innerHTML = "RE-BLOCKING IN";
                popupTimerDiv.innerHTML = new Date(timeLeft)
                    .toISOString().substring(11, 19);
            }
        });
    } else {
        popupTimerDiv.innerHTML = "Blocking";
        reblockingTextDiv.innerHTML = "";
    }
});
import {blockTab} from "./block.js";

document.getElementById("start_blocking")
    .addEventListener("click", () => {
        chrome.storage.sync.set({blocking: true});
        chrome.tabs.query({active: true}, tabs => blockTab(tabs[0]));
    })

document.getElementById("go_to_options")
    .addEventListener("click", () => {
        chrome.tabs.create({url: chrome.extension.getURL("options.html")});
    })

document.getElementById("temp_stop_blocking_button")
    .addEventListener("click", () => {
        const minutes = parseInt(document.getElementById("temp_stop_blocking_input").value);
        chrome.alarms.create({delayInMinutes: minutes});
        chrome.storage.sync.set({blocking: false});
    })
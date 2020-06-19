import {blockTab} from "./block.js";

document.getElementById("start_blocking")
    .addEventListener("click", () => {
        chrome.storage.sync.set({blocking: true});
        chrome.tabs.query({active: true}, tabs => {
            blockTab(tabs[0]);
        })
    })
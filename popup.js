import {blockTab} from "./block.js";
import {addOnClick, setFields} from "./utils.js";

addOnClick("start_blocking", () => {
    setFields({blocking: true});
    chrome.tabs.query({active: true}, tabs => blockTab(tabs[0]));
})

addOnClick("go_to_options", () => {
    chrome.tabs.create({url: chrome.extension.getURL("options.html")});
})

addOnClick("temp_stop_blocking_button", () => {
    const minutes = parseInt(document.getElementById("temp_stop_blocking_input").value);
    chrome.alarms.create({delayInMinutes: minutes});
    setFields({blocking: false});
})
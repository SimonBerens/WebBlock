import {addOnClick, changeBlockingAndRedirectCurTab} from "./utils.js";

addOnClick("start_blocking", () => changeBlockingAndRedirectCurTab(true))

addOnClick("go_to_options", () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}))

addOnClick("temp_stop_blocking_button", () => {
    const minutes = parseInt(document.getElementById("temp_stop_blocking_input").value);
    chrome.alarms.create({delayInMinutes: minutes});
    changeBlockingAndRedirectCurTab(false);
})
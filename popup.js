import {addOnClick, addEventListener, getFields, setBlocking} from "./utils.js";

const setBlockingAndBgColor = blocking => {
    setBlocking(blocking);
    document.body.style.backgroundColor = blocking? "green" : "red";
};

addOnClick("start_blocking", () => setBlockingAndBgColor(true));

addOnClick("go_to_options", () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}));

addOnClick("temp_stop_blocking_button", () => {
    const minutes = parseInt(document.getElementById("temp_stop_blocking_input").value);
    chrome.alarms.clear("temp_unblock_over", () => {
        chrome.alarms.create("temp_unblock_over", {delayInMinutes: minutes});
        setBlockingAndBgColor(false);
    });
});

addEventListener("temp_stop_blocking_input", "keyup", event => {
    if (event.keyCode === 13) document.getElementById("temp_stop_blocking_button").click();
});

getFields({blocking: true}, res => setBlockingAndBgColor(res.blocking));
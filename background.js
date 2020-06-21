import {blockTab} from "./block.js";
import {setFields} from "./utils.js";

// start blocking on startup
setFields({blocking: true});

chrome.tabs.onCreated.addListener(blockTab);

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, blockTab);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    blockTab(tab);
})

// only alarm is temp unblock
chrome.alarms.onAlarm.addListener(alarm => setFields({blocking: true}));
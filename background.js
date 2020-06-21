import {blockTab} from "./block.js";

// start blocking on startup
chrome.storage.sync.set({blocking: true});

chrome.tabs.onCreated.addListener(blockTab);

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, blockTab);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    blockTab(tab);
})

// only alarm is temp unblock
chrome.alarms.onAlarm.addListener(alarm => chrome.storage.sync.set({blocking: true}));
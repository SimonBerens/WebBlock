import {blockUnblockTab} from "./block.js";
import {setBlocking} from "./utils.js";

// start blocking on startup
setBlocking(true);

chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo => chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => blockUnblockTab(tab));

// only alarm is temp unblock
chrome.alarms.onAlarm.addListener(alarm => setBlocking(true));
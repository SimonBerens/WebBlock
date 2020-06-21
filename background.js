import {blockUnblockTab} from "./block.js";
import {changeBlockingAndRedirectCurTab} from "./utils.js";

// start blocking on startup
changeBlockingAndRedirectCurTab(true);

chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo => chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => blockUnblockTab(tab));

// only alarm is temp unblock
chrome.alarms.onAlarm.addListener(alarm => changeBlockingAndRedirectCurTab(true));
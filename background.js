import {blockUnblockTab} from "./block.js";
import {getFields, setBlocking} from "./utils.js";

// start blocking on startup
getFields({enable_on_startup: true}, res => setBlocking(res.enable_on_startup));

chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo => chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => blockUnblockTab(tab));

// only alarm is temp unblock
chrome.alarms.onAlarm.addListener(alarm => setBlocking(true));
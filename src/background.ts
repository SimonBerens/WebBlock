import {blockUnblockTab} from "./block.js";
import {getFields, setBlocking} from "./utils.js";

const blockOnExtensionStartup: () => void = () =>
    getFields({enable_on_startup: true}, res => setBlocking(res.enable_on_startup));

chrome.runtime.onStartup.addListener(blockOnExtensionStartup);
chrome.runtime.onInstalled.addListener(blockOnExtensionStartup);

chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "temp_unblock_over")
        setBlocking(true);
});
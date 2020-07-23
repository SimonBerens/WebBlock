import {blockUnblockTab} from "./block.js";
import {getThenSetBlocked} from "./utils.js";

const blockOnExtensionStartup = (): void => {
    getThenSetBlocked(async res => {
        for (const [listId, blockedList] of Object.entries(res.blockedListList))
            blockedList.isBlocking = blockedList.enabledOnStartup;
    });
};


chrome.runtime.onStartup.addListener(blockOnExtensionStartup);
chrome.runtime.onInstalled.addListener(blockOnExtensionStartup);

chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));

chrome.alarms.onAlarm.addListener(alarm => {
    getThenSetBlocked(async res => {
        res.blockedListList[alarm.name].isBlocking = true;
    });
});
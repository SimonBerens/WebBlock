import {BlockedList, StoredBlockedList} from "./utils";


chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        chrome.storage.local.set({blocking: true});
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        blockUnblockTab(tab);
    }
});



const isPrefixOfURL = (url: string) => ((site: string) => url.indexOf(site) === 0);

// todo rename func
export const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    // todo rearrange/inline vars
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;

    chrome.storage.local.get({blocking: true, blockedList: []}, ({blocking, blockedList} : {blockedList: BlockedList, blocking: boolean}) => {
        if (blocking && blockedList.some(blockedItem => isPrefixOfTabURL(blockedItem.urlPrefix))) {
            chrome.tabs.update(tab.id, {url: redirect});
        }
    });

};


chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));
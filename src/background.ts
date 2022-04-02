import {setData, getData} from "./utils.js";


chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        await setData({...(await getData()), blocking: true})
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        await blockUnblockTab(tab);
    }
});



const isPrefixOfURL = (url: string) => ((site: string) => url.indexOf(site) === 0);

// todo rename func
export const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    // todo rearrange/inline vars
    const isPrefixOfTabURL = isPrefixOfURL(tab.url ?? '');
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;
    const {blocking, blockedList} = await getData();
    if (blocking && blockedList.some(blockedItem => isPrefixOfTabURL(blockedItem.urlPrefix))) {
        if (tab.id) chrome.tabs.update(tab.id, {url: redirect});
    }

};

const blockOnExtensionStartup = async () => {
    setData({...(await getData()), blocking: true});
};


chrome.runtime.onStartup.addListener(blockOnExtensionStartup);
chrome.runtime.onInstalled.addListener(blockOnExtensionStartup);


chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));
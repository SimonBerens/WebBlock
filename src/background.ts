import {setData, useData} from "./utils.js";


chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        useData(async oldData => {
            await setData({...oldData, blocking: true})
        })
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        await blockUnblockTab(tab);
    }
});



const isPrefixOfURL = (url: string) => ((site: string) => url.indexOf(site) === 0);

// todo rename func
export const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    // todo rearrange/inline vars
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;
    useData( ({blocking, blockedList}) => {
        if (blocking && blockedList.some(blockedItem => isPrefixOfTabURL(blockedItem.urlPrefix))) {
            chrome.tabs.update(tab.id, {url: redirect});
        }
    });

};

const blockOnExtensionStartup = (): void => {
    useData(data => setData({...data, blocking: true}));
};


chrome.runtime.onStartup.addListener(blockOnExtensionStartup);
chrome.runtime.onInstalled.addListener(blockOnExtensionStartup);


chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));
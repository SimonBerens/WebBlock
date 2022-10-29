import {
    setData,
    getData,
    BlockedList,
    DEFAULT_SUGGESTED_ACTIONS,
    DEFAULT_REBLOCK_LENGTH_MINUTES,
    DEFAULT_COUNTDOWN_LENGTH_MINUTES
} from "./utils.js";


function isTabOnBlockedList(tab: chrome.tabs.Tab, blockedList: BlockedList) {
    return blockedList.some(blockedItem => (tab.url ?? '').indexOf(blockedItem.urlPrefix) === 0);
}

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        const data = await getData();
        await setData({...data, blocking: true})
        const tabs = await chrome.tabs.query({});
        await chrome.tabs.remove(tabs.filter(tab => isTabOnBlockedList(tab, data.blockedList)).map(tab => tab.id ?? -1));
    }
});

const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;
    const {blocking, blockedList} = await getData();
    if (blocking && isTabOnBlockedList(tab, blockedList)) {
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

chrome.runtime.setUninstallURL('https://dz0c2pw13zz.typeform.com/to/qY22xEZl');

chrome.runtime.onInstalled.addListener(async details => {
    if (details.previousVersion === "2.0.3") {
        const blockedListListRes = await chrome.storage.local.get({blockedListList: {}});
        const newBlockedSites = Object.entries(blockedListListRes).flatMap(([, {blockedSites}]) => blockedSites)
            .map(blockedSite => ({urlPrefix: blockedSite}));
        setData({
            blockedList: newBlockedSites,
            blocking: true,
            reblockingAt: Date.now(),
            suggestedActions: DEFAULT_SUGGESTED_ACTIONS,
            reblockLengthMinutes: DEFAULT_REBLOCK_LENGTH_MINUTES,
            countdownLengthMinutes: DEFAULT_COUNTDOWN_LENGTH_MINUTES
        })
    }
});
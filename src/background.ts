import {getData, setData} from "./utils.js";


async function syncStuff() {
    const syncData = await getData(true);
    const curData = await getData();
    if (curData.lastUpdate < syncData.lastUpdate) {
        setData(syncData)
    } else {
        setData(curData, true)
    }
}

function isTabOnBlockedList(tab: chrome.tabs.Tab, blockedList: string[]) {
    return blockedList.some(blockedItem => (tab.url ?? '').indexOf(blockedItem) === 0);
}

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        const data = await getData();
        await setData({...data, blocking: true}, true);
        const tabs = await chrome.tabs.query({});
        await chrome.tabs.remove(tabs.filter(tab => isTabOnBlockedList(tab, data.blockedList)).map(tab => tab.id ?? -1));
    }
    if (alarm.name === 'syncAlarm') await syncStuff()
});

const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    const {blocking, blockedList, overrideNewtab} = await getData();
    if (tab.url === 'chrome://newtab/' && overrideNewtab && tab.id) chrome.tabs.update(tab.id, {url: chrome.runtime.getURL("/suggested.html")});
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;
    if (blocking && isTabOnBlockedList(tab, blockedList)) {
        if (tab.id) chrome.tabs.update(tab.id, {url: redirect});
    }

};

const blockOnExtensionStartup = async () => {
    syncStuff();
    setData({...(await getData()), blocking: true}, false);
};


chrome.runtime.onStartup.addListener(blockOnExtensionStartup);
chrome.runtime.onInstalled.addListener(blockOnExtensionStartup);


chrome.tabs.onCreated.addListener(blockUnblockTab);

chrome.tabs.onActivated.addListener(activeInfo =>
    chrome.tabs.get(activeInfo.tabId, blockUnblockTab));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    blockUnblockTab(tab));

chrome.runtime.setUninstallURL('https://forms.gle/k1nGBymLgFL7R5vZ6');

chrome.alarms.create('syncAlarm', {
    delayInMinutes: 1,
    periodInMinutes: 1
})
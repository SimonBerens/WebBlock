import {getData, setData} from "./utils.js";


async function syncStuff() {
    console.group()
    const syncData = await getData(true);
    const curData = await getData();
    console.log('data pre update: ', curData, syncData);
    if (curData.lastUpdate + 10_000 < syncData.lastUpdate) {
        console.log('Local data stale')
        await setData({...syncData, blocking: curData.blocking, reblockingAt: curData.reblockingAt})
    } else {
        console.log('Server data stale')
        await setData(curData, true)
    }
    console.log('data post update: ', await getData(), await getData(true));
    console.groupEnd()
}

function isTabOnBlockedList(tab: chrome.tabs.Tab, blockedList: string[]) {
    return blockedList.some(blockedItem => (tab.url ?? '').indexOf(blockedItem) === 0);
}

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "reblock") {
        const data = await getData();
        await setData({...data, blocking: true});
        const tabs = await chrome.tabs.query({});
        await chrome.tabs.remove(tabs.filter(tab => isTabOnBlockedList(tab, data.blockedList)).map(tab => tab.id ?? -1));
    } else if (alarm.name === 'syncAlarm') {
        console.log('Sync alarm fired')
        await syncStuff();
    }
});

const blockUnblockTab = async (tab: chrome.tabs.Tab) => {
    const {blocking, blockedList, overrideNewtab} = await getData();
    if (tab.url === 'chrome://newtab/' && overrideNewtab && tab.id) {
        await chrome.tabs.update(tab.id, {url: chrome.runtime.getURL("/suggested.html")});
        return;
    }
    let redirect = `${chrome.runtime.getURL("/blocked.html")}?dest=${tab.url}`;
    if (blocking && isTabOnBlockedList(tab, blockedList) && tab.id)
        await chrome.tabs.update(tab.id, {url: redirect});
};

const blockOnExtensionStartup = async () => {
    console.log('syncing on startup')
    await syncStuff();
    await setData({...(await getData()), blocking: true});
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
chrome.storage.sync.set({blocking: true});

const blockTab = tab => {
    chrome.storage.sync.get({blocking: true}, res => {
        if (res.blocking)
            alert(tab.url);
    })
}

chrome.tabs.onCreated.addListener(blockTab);

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, blockTab);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    blockTab(tab);
})
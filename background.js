const blockTab = tab => {
    alert(tab.url);
}

chrome.tabs.onCreated.addListener(blockTab);

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, blockTab);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    blockTab(tab);
})
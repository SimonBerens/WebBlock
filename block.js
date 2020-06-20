export const blockTab = tab => {
    chrome.storage.sync.get({blocking: true, blocked_sites: []}, res => {
        if (res.blocking && res.blocked_sites.some(site => tab.url.indexOf(site) === 0)) {
            const absURL = chrome.extension.getURL("/images/thanosfailure.jpg");
            chrome.tabs.update(tab.id, {url: absURL});
        }
    })
}
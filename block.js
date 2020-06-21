export const blockUnblockTab = tab => {
    chrome.storage.sync.get({blocking: true, blocked_sites: []}, res => {
        if (res.blocking && res.blocked_sites.some(site => tab.url.indexOf(site) === 0)) {
            const absURL = chrome.runtime.getURL(`/images/thanosfailure.jpg?dest=${tab.url}`);
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (!res.blocking && tab.url.indexOf(chrome.runtime.getURL("")) === 0) {
            const url_obj = new URL(tab.url);
            chrome.tabs.update(tab.id, {url: url_obj.searchParams.get("dest")});
        }
    })
}
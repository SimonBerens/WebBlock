export const blockTab = tab => {
    chrome.storage.sync.get({blocking: true}, res => {
        if (res.blocking)
            alert(tab.url);
    })
}
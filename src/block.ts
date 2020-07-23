import {getBlocked} from "./utils.js";

const isPrefixOfURL = (url: string) => ((site: string) => url.indexOf(site) === 0);

export const blockUnblockTab = (tab: chrome.tabs.Tab) => {
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);
    const DEFAULT_REDIRECT = chrome.runtime.getURL("/images/thanosfailure.jpg");
    let redirect = DEFAULT_REDIRECT + `?dest=${tab.url}`;

    getBlocked(async res => {
        if (isPrefixOfTabURL(DEFAULT_REDIRECT)) {
            const dest = new URL(tab.url).searchParams.get("dest");
            for (const [listId, {isBlocking, blockedSites}] of Object.entries(res.blockedListList)) {
                if (blockedSites.some(isPrefixOfURL(dest))) {
                    if (!isBlocking)
                        chrome.tabs.update(tab.id, {url: dest});
                    return;
                }
            }
            chrome.tabs.update(tab.id, {url: dest});
        } else {
            for (const [listId, {isBlocking, blockedSites, customRedirect}] of Object.entries(res.blockedListList)) {
                if (isBlocking && blockedSites.some(isPrefixOfTabURL)) {
                    chrome.tabs.update(tab.id, {url: customRedirect ? customRedirect : redirect});
                    return;
                }
            }
        }
    });
};

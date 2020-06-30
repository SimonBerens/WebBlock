import {getFields} from "./utils.js";

const isPrefixOfURL = url => (site => url.indexOf(site) === 0);

export const blockUnblockTab = tab => {
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);

    getFields({blocking: true, blocked_sites: [], perm_blocked_sites: [], redirect: ""}, res => {
        if (res.perm_blocked_sites.some(isPrefixOfTabURL)) {
            const absURL = res.redirect ? res.redirect : chrome.runtime.getURL("/images/thanosfailure.jpg");
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (res.blocking && res.blocked_sites.some(isPrefixOfTabURL)) {
            const absURL = res.redirect ? res.redirect : chrome.runtime.getURL(`/images/thanosfailure.jpg?dest=${tab.url}`);
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (isPrefixOfTabURL(chrome.runtime.getURL(""))) {
            const url_obj = new URL(tab.url);
            const go = url_obj.searchParams.get("dest");
            if (go && (!res.blocking || !res.blocked_sites.some(isPrefixOfURL(go)))) chrome.tabs.update(tab.id, {url: go});
        }
    });
};
import {getFields} from "./utils.js";

const isPrefixOfTabURL = tab => (site => tab.url.indexOf(site) === 0);

export const blockUnblockTab = tab => {
    getFields({blocking: true, blocked_sites: [], perm_blocked_sites: [], redirect: ""}, res => {
        if (res.perm_blocked_sites.some(isPrefixOfTabURL(tab))) {
            const absURL = res.redirect ? res.redirect : chrome.runtime.getURL("/images/thanosfailure.jpg");
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (res.blocking && res.blocked_sites.some(isPrefixOfTabURL(tab))) {
            const absURL = res.redirect ? res.redirect : chrome.runtime.getURL(`/images/thanosfailure.jpg?dest=${tab.url}`);
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (!res.blocking && tab.url.indexOf(chrome.runtime.getURL("")) === 0) {
            const url_obj = new URL(tab.url);
            const go = url_obj.searchParams.get("dest");
            if (go) chrome.tabs.update(tab.id, {url: go});
        }
    });
};
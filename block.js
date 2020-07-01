import {getFields} from "./utils.js";

const isPrefixOfURL = url => (site => url.indexOf(site) === 0);
const DEFAULT_REDIRECT = "/images/thanosfailure.jpg";

export const blockUnblockTab = tab => {
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);

    getFields({blocking: true, blocked_sites: [], perm_blocked_sites: [], redirect: ""}, res => {
        const in_perm_list = res.perm_blocked_sites.some(isPrefixOfTabURL);
        if (in_perm_list || (res.blocking && res.blocked_sites.some(isPrefixOfTabURL))) {
            const absURL = res.redirect ? res.redirect :
                chrome.runtime.getURL(`${DEFAULT_REDIRECT}?dest=${tab.url}&perm=${in_perm_list}`);
            chrome.tabs.update(tab.id, {url: absURL});
        } else if (isPrefixOfTabURL(chrome.runtime.getURL(DEFAULT_REDIRECT))) {
            const url_obj = new URL(tab.url);
            const go = url_obj.searchParams.get("dest");
            const perm_blocked = url_obj.searchParams.get("perm") === "true";
            if (!perm_blocked && go &&
                (!res.blocking || !res.blocked_sites.some(isPrefixOfURL(go))) ||
                !res.perm_blocked_sites.some(isPrefixOfURL(go)))
                chrome.tabs.update(tab.id, {url: go});
        }
    });
};
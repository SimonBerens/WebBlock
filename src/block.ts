import {getFields, BlockedList, BlockedListListRes, getBlocked} from "./utils.js";

const isPrefixOfURL = (url: string) => ((site: string) => url.indexOf(site) === 0);
const DEFAULT_REDIRECT = chrome.runtime.getURL("/images/thanosfailure.jpg");
// todo set default redirect
export const blockUnblockTab = (tab: chrome.tabs.Tab) => {
    const isPrefixOfTabURL = isPrefixOfURL(tab.url);


    getBlocked(async res => {
        for (const [listId, blockedList] of Object.entries(res.blockedListList)) {
            if (blockedList.isBlocking && blockedList.blockedSites.some(isPrefixOfTabURL)) {
                console.log(blockedList.customRedirect, blockedList.customRedirect ? blockedList.customRedirect : DEFAULT_REDIRECT);
                chrome.tabs.update(tab.id, {url: blockedList.customRedirect ? blockedList.customRedirect : DEFAULT_REDIRECT});
            }
        }
    });
};
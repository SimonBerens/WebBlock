import {blockUnblockTab} from "./block.js";

export interface BlockedList {
    name: string;
    isBlocking: boolean;
    enabledOnStartup: boolean;
    customRedirect: string;
    blockedSites: Array<string>;
}

export interface BlockedListListRes {
    blockedListList: {[listId: string]: BlockedList}
}

export const addEventListener = (id: string, event: string, func: EventListenerOrEventListenerObject): void =>
    document.getElementById(id).addEventListener(event, func);

export const addOnClick = (id: string, func: EventListenerOrEventListenerObject): void =>
    addEventListener(id, "click", func);

export const getFields = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setFields = chrome.storage.sync.set.bind(chrome.storage.sync);

export const getBlocked = (callback: (res: BlockedListListRes) => Promise<void>): void => {
    getFields({blockedListList: {}}, callback);
};

export const getThenSetBlocked = (modifyRes: (res: BlockedListListRes) => Promise<void>): void => {
    getBlocked(async res => {
        await modifyRes(res);
        chrome.tabs.query({active: true}, tabs => tabs.forEach(blockUnblockTab));
        setFields({blockedListList: res.blockedListList});
    });
    window.location.reload();
};


export const getThenSetBlockedCallback = (modifyRes: (res: BlockedListListRes) => Promise<void>): () => void => {
    return () => getThenSetBlocked(modifyRes);
};

export const isValidUrl = (potentialUrl: string) : boolean => {
    try {
        new URL(potentialUrl);
        return true;
    } catch (_) {
        return false;
    }
}
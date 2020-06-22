import {blockUnblockTab} from "./block.js";

export const addOnClick = (id, func) => {
    document.getElementById(id).addEventListener("click", func);
};

export const getFields = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setFields = chrome.storage.sync.set.bind(chrome.storage.sync);

export const setBlocking = new_blocking_state => {
    setFields({blocking: new_blocking_state});
    chrome.tabs.query({active: true}, tabs => blockUnblockTab(tabs[0]));
};

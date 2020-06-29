import {blockUnblockTab} from "./block.js";

export const addEventListener = (id, event, func) =>
    document.getElementById(id).addEventListener(event, func);

export const addOnClick = (id, func) => addEventListener(id, "click", func);

export const getFields = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setFields = chrome.storage.sync.set.bind(chrome.storage.sync);

export const setBlocking = new_blocking_state => {
    setFields({blocking: new_blocking_state});
    chrome.tabs.query({active: true}, tabs => blockUnblockTab(tabs[0]));
};

import {blockUnblockTab} from "./block.js";

export const addEventListener = (id: string, event: string, func: EventListenerOrEventListenerObject): void =>
    document.getElementById(id).addEventListener(event, func);

export const addOnClick = (id: string, func: EventListenerOrEventListenerObject): void =>
    addEventListener(id, "click", func);

export const getFields = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setFields = chrome.storage.sync.set.bind(chrome.storage.sync);

export const setBlocking = new_blocking_state => {
    setFields({blocking: new_blocking_state});
    chrome.tabs.query({active: true}, tabs => blockUnblockTab(tabs[0]));
};

const nZeros = 10;

export const padWith0 = (n: number): string => ("0".repeat(nZeros) + n).slice(nZeros);

export const extractN = (s: string): number => parseInt(s.slice(0, nZeros - 1));
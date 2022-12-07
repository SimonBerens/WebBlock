import {marked} from "marked";

export interface Data {
    blockedList: string[],
    blocking: boolean,
    countdownLengthMinutes: number,
    reblockLengthMinutes: number,
    reblockingAt: number,
    motivationList: string[],
    overrideNewtab: boolean,
    lastUpdate: number
}

export interface StoredData {
    data: Data
}

export const DEFAULT_COUNTDOWN_LENGTH_MINUTES = 2;
export const DEFAULT_REBLOCK_LENGTH_MINUTES = 60;

export const DEFAULT_STORED_DATA: StoredData = {
    data: {
        blockedList: ["https://www.example.com"],
        blocking: true,
        countdownLengthMinutes: DEFAULT_COUNTDOWN_LENGTH_MINUTES,
        reblockLengthMinutes: DEFAULT_REBLOCK_LENGTH_MINUTES,
        reblockingAt: Date.now(),
        motivationList: ["Stretch", "Do a [pomodoro timer](https://pomofocus.io/)"],
        overrideNewtab: false,
        lastUpdate: 0
    }
};

export const getData = async (sync: boolean = false) => {
    const {data} = await (sync ? chrome.storage.sync : chrome.storage.local).get(DEFAULT_STORED_DATA) as StoredData;
    return data;
}

export const setData = async (data: Data, sync: boolean = false) => {
    if (sync) {
        await chrome.storage.sync.set({data});
    } else {
        data.lastUpdate = Date.now();
        await chrome.storage.local.set({data});
    }
}

const renderMotivationItem = (raw: string, parent: HTMLUListElement) => {
    const li = document.createElement('li');
    li.innerHTML = marked.parse(raw)
    parent.appendChild(li);
}

export const renderMotivationHtml = (motivationList: string[], div: HTMLDivElement) => {
    const ul = document.createElement('ul');
    motivationList.forEach(mi => renderMotivationItem(mi, ul))
    div.appendChild(ul);
}
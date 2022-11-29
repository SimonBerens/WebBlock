import {marked} from "marked";

export interface Data {
    blockedList: string[],
    blocking: boolean,
    countdownLengthMinutes: number,
    reblockLengthMinutes: number,
    reblockingAt: number,
    motivationList: string[],
}

export interface StoredData {
    data: Data
}

export const DEFAULT_COUNTDOWN_LENGTH_MINUTES = 2;
export const DEFAULT_REBLOCK_LENGTH_MINUTES = 60;

export const getData = async () => {
    const {data} = await chrome.storage.sync.get(
        {
            data: {
                blockedList: ["https://www.example.com"],
                blocking: true,
                countdownLengthMinutes: DEFAULT_COUNTDOWN_LENGTH_MINUTES,
                reblockLengthMinutes: DEFAULT_REBLOCK_LENGTH_MINUTES,
                reblockingAt: Date.now(),
                motivationList: ["Stretch", "Do a [pomodoro timer](https://pomofocus.io/)"]
            }
        } as StoredData) as StoredData;
    return data;
}

export const setData = async (data: Data) => {
    await chrome.storage.sync.set({data: data});
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
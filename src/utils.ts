export interface BlockedItem {
    urlPrefix: string
}

export type BlockedList = BlockedItem[];

export interface Data {
    blockedList: BlockedList,
    blocking: boolean,
    countdownLengthMinutes: number,
    reblockLengthMinutes: number,
    reblockingAt: number,
}

export interface StoredData {
    data: Data
}

export const useData = (f: (data: Data) => void) => {
    chrome.storage.local.get(
        {
            data: {
                blockedList: [],
                blocking: true,
                countdownLengthMinutes: 2,
                reblockLengthMinutes: 60,
                reblockingAt: Date.now(),
            }
        } as StoredData,
        ({data} : StoredData) => f(data));
}

export const setData = async (data: Data) => {
    await chrome.storage.local.set({data: data});
}
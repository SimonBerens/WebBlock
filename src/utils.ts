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
    suggestedActions: string
}

export interface StoredData {
    data: Data
}

export const DEFAULT_COUNTDOWN_LENGTH_MINUTES = 2;
export const DEFAULT_REBLOCK_LENGTH_MINUTES = 60;

export const useData = (f: (data: Data) => void) => {
    chrome.storage.local.get(
        {
            data: {
                blockedList: [],
                blocking: true,
                countdownLengthMinutes: DEFAULT_COUNTDOWN_LENGTH_MINUTES,
                reblockLengthMinutes: DEFAULT_REBLOCK_LENGTH_MINUTES,
                reblockingAt: Date.now(),
                suggestedActions: ""
            }
        } as StoredData,
        ({data}: StoredData) => f(data));
}

export const setData = async (data: Data) => {
    await chrome.storage.local.set({data: data});
}
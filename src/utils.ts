export interface BlockedItem {
    urlPrefix: string
}

export type BlockedList = BlockedItem[];

export type StoredBlockedList = {blockedList: BlockedList}
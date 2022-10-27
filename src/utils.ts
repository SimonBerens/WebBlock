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

const DEFAULT_SUGGESTED_ACTIONS  = `
<ol id="my-list">
<li><a href="https://google.com/"> REPLACE ME (this is a link) </a> </li>
<li> REPLACE ME (normal element) </li>
</ol>

<style>
#my-list {
height: 100vh;
text-align: center;
display: flex;
flex-direction: column;
justify-content: center;
font-size: 2.25rem;
}

a {
text-decoration-line: underline;
text-decoration-color: rgb(147 197 253);
}
</style>
`;

export const getData = async () => {
    const {data} = await chrome.storage.local.get(
        {
            data: {
                blockedList: [{urlPrefix: "https://www.example.com"}],
                blocking: true,
                countdownLengthMinutes: DEFAULT_COUNTDOWN_LENGTH_MINUTES,
                reblockLengthMinutes: DEFAULT_REBLOCK_LENGTH_MINUTES,
                reblockingAt: Date.now(),
                suggestedActions: DEFAULT_SUGGESTED_ACTIONS
            }
        } as StoredData) as StoredData;
    return data;
}

export const setData = async (data: Data) => {
    await chrome.storage.local.set({data: data});
}
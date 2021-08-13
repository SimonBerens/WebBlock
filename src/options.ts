import {BlockedList, StoredBlockedList} from "./utils";

async function setList(newList: BlockedList) {
    await chrome.storage.local.set({"blockedList": newList});
    window.location.reload();
}
const button = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
const url = document.getElementById("url-to-add") as HTMLInputElement;
chrome.storage.local.get({"blockedList": []}, ({blockedList} : {blockedList: BlockedList})  => {

    button.addEventListener("click", async () =>
        setList([...blockedList, {urlPrefix: url.value}])
    );

    const domList = document.getElementById("blocked-list") as HTMLDivElement;
    const domBlockedItem = document.getElementById("blocked-item-template") as HTMLTemplateElement;

    blockedList.forEach(blockedItem => {
        const bi = domBlockedItem.content.cloneNode(true) as DocumentFragment;
        const bu = bi.querySelector(".blocked-url") as HTMLSpanElement;
        bu.innerHTML = blockedItem.urlPrefix;
        bu.addEventListener("click", () =>
            setList(blockedList.filter(x => x!==blockedItem))
        );

        domList.appendChild(bi);
    });
});


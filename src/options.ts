import {BlockedList, Data, setData, useData} from "./utils.js";

async function setList(newList: BlockedList) {
    useData(async oldData => {
        await setData({...oldData, blockedList: newList});
        window.location.reload();
    });
}
const addToBlockedListButton = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
const url = document.getElementById("url-to-add") as HTMLInputElement;

useData(({blockedList}) => {

    addToBlockedListButton.addEventListener("click", async () =>
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


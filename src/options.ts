import {
    BlockedList,
    DEFAULT_COUNTDOWN_LENGTH_MINUTES,
    DEFAULT_REBLOCK_LENGTH_MINUTES,
    getData,
    setData
} from "./utils.js";

async function renderList(blockedList: BlockedList) {
    await setData({...(await getData()), blockedList})

    const addToBlockedListButton = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
    addToBlockedListButton.addEventListener("click", () =>
        renderList([...blockedList, {urlPrefix: "https://www.example.com"}])
    );

    const domList = document.getElementById("blocked-list") as HTMLDivElement;
    while (domList.firstChild) domList.removeChild(domList.firstChild);
    const domBlockedItem = document.getElementById("blocked-item-template") as HTMLTemplateElement;

    blockedList.forEach((blockedItem, i) => {
        const bi = domBlockedItem.content.cloneNode(true) as DocumentFragment;
        const bu = bi.querySelector(".blocked-url") as HTMLInputElement;
        const bb = bi.querySelector(".remove-blocked-url") as HTMLButtonElement;
        bu.value = blockedItem.urlPrefix;
        bu.addEventListener("blur", () => {
            blockedList[i].urlPrefix = bu.value;
            renderList(blockedList);
        })
        bb.addEventListener("click", () =>
            renderList(blockedList.filter(x => x !== blockedItem))
        );

        domList.appendChild(bi);
    });
}


getData().then(data => {
    {
        const countdownInput = document.getElementById("countdown-seconds") as HTMLInputElement;
        countdownInput.value = (data.countdownLengthMinutes * 60).toString();
        countdownInput.addEventListener("blur", async () => {
            const newCountdownLengthSeconds = parseFloat(countdownInput.value);
            if (isNaN(newCountdownLengthSeconds)) return;
            if (newCountdownLengthSeconds < 30) {
                alert("Countdown must be at least 30 seconds long");
                countdownInput.value = (DEFAULT_COUNTDOWN_LENGTH_MINUTES * 60).toString();
                return;
            }
            await setData({...data, countdownLengthMinutes: newCountdownLengthSeconds/60});
        })

        const reblockInput = document.getElementById("reblock-minutes") as HTMLInputElement;
        reblockInput.value = data.reblockLengthMinutes.toString();
        reblockInput.addEventListener("blur", async () => {
            const newReblockLengthMinutes = parseFloat(reblockInput.value);
            if (isNaN(newReblockLengthMinutes)) return;
            if (newReblockLengthMinutes > 180) {
                alert("Cannot unblock for more than 3 hours");
                reblockInput.value = DEFAULT_REBLOCK_LENGTH_MINUTES.toString();
                return;
            }
            await setData({...data, reblockLengthMinutes: newReblockLengthMinutes});
        })

        const suggestedActions = document.getElementById("suggested-actions") as HTMLTextAreaElement;
        suggestedActions.value = data.suggestedActions;
        suggestedActions.addEventListener("blur", async () => {
            const newActions = suggestedActions.value;
            await setData({...data, suggestedActions: newActions});
        })

        renderList(data.blockedList);
    }
});


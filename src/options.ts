import {
    BlockedList,
    DEFAULT_COUNTDOWN_LENGTH_MINUTES,
    DEFAULT_REBLOCK_LENGTH_MINUTES,
    getData,
    setData
} from "./utils.js";

async function setList(newList: BlockedList) {
    await setData({...(await getData()), blockedList: newList})
    window.location.reload();
}


getData().then(data => {
    {
        // todo clean up variable names

        const x = document.getElementById("countdown-minutes") as HTMLInputElement;
        x.value = data.countdownLengthMinutes.toString();
        x.addEventListener("blur", async () => {
            const newCountdownLengthMinutes = parseFloat(x.value);
            if (isNaN(newCountdownLengthMinutes)) return;
            if (newCountdownLengthMinutes < 1) {
                alert("Countdown must be at least 1 minute long");
                x.value = DEFAULT_COUNTDOWN_LENGTH_MINUTES.toString();
                return;
            }
            await setData({...data, countdownLengthMinutes: newCountdownLengthMinutes});
        })

        const y = document.getElementById("reblock-minutes") as HTMLInputElement;
        y.value = data.reblockLengthMinutes.toString();
        y.addEventListener("blur", async () => {
            const newReblockLengthMinutes = parseFloat(y.value);
            if (isNaN(newReblockLengthMinutes)) return;
            if (newReblockLengthMinutes > 180) {
                alert("Cannot unblock for more than 3 hours");
                y.value = DEFAULT_REBLOCK_LENGTH_MINUTES.toString();
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


        const blockedList = data.blockedList;

        const url = document.getElementById("url-to-add") as HTMLInputElement;
        const addToBlockedListButton = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
        addToBlockedListButton.addEventListener("click", async () => {
                if (url.value !== "")
                    await setList([...blockedList, {urlPrefix: url.value}])
            }
        );

        const domList = document.getElementById("blocked-list") as HTMLDivElement;
        const domBlockedItem = document.getElementById("blocked-item-template") as HTMLTemplateElement;

        blockedList.forEach(blockedItem => {
            const bi = domBlockedItem.content.cloneNode(true) as DocumentFragment;
            const bu = bi.querySelector(".blocked-url") as HTMLSpanElement;
            bu.innerHTML = blockedItem.urlPrefix;
            bu.addEventListener("click", () =>
                setList(blockedList.filter(x => x !== blockedItem))
            );

            domList.appendChild(bi);
        });

        const blockButton = document.getElementById("block-button") as HTMLButtonElement;
        blockButton.addEventListener("click", async () => {
            await setData({...data, blocking: true});
            await chrome.alarms.clear("reblock");
        });
    }
});


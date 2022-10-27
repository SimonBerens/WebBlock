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


        const blockedList = data.blockedList;

        const addToBlockedListButton = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
        addToBlockedListButton.addEventListener("click", () =>
            setList([...blockedList, {urlPrefix: "https://www.example.com"}])
        );

        const domList = document.getElementById("blocked-list") as HTMLDivElement;
        const domBlockedItem = document.getElementById("blocked-item-template") as HTMLTemplateElement;

        blockedList.forEach(blockedItem => {
            const bi = domBlockedItem.content.cloneNode(true) as DocumentFragment;
            const bu = bi.querySelector(".blocked-url") as HTMLDivElement;
            const bb = bi.querySelector(".remove-blocked-url") as HTMLButtonElement;
            bu.innerHTML = blockedItem.urlPrefix;
            bb.addEventListener("click", () =>
                setList(blockedList.filter(x => x !== blockedItem))
            );

            domList.appendChild(bi);
        });
    }
});


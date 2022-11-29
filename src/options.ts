import {
    DEFAULT_COUNTDOWN_LENGTH_MINUTES,
    DEFAULT_REBLOCK_LENGTH_MINUTES,
    getData,
    setData
} from "./utils.js";

async function renderBlockedList(blockedList: string[]) {
    await setData({...(await getData()), blockedList})

    const addToBlockedListButton = document.getElementById("add-to-blocked-list-button") as HTMLButtonElement;
    addToBlockedListButton.addEventListener("click", () =>
        renderBlockedList([...blockedList, "https://www.example.com"])
    );

    const domList = document.getElementById("blocked-list") as HTMLDivElement;
    while (domList.firstChild) domList.removeChild(domList.firstChild);
    const domBlockedItem = document.getElementById("list-item-template") as HTMLTemplateElement;

    blockedList.forEach((blockedItem, i) => {
        const bi = domBlockedItem.content.cloneNode(true) as DocumentFragment;
        const bu = bi.querySelector(".list-input") as HTMLInputElement;
        const bb = bi.querySelector(".remove-list-input") as HTMLButtonElement;
        bu.value = blockedItem;
        bu.addEventListener("blur", () => {
            blockedList[i] = bu.value;
            renderBlockedList(blockedList);
        })
        bb.addEventListener("click", () =>
            renderBlockedList(blockedList.filter(x => x !== blockedItem))
        );

        domList.appendChild(bi);
    });
}

async function renderMotivationList(motivationList: string[]) {
    await setData({...(await getData()), motivationList})

    const addToBlockedListButton = document.getElementById("add-to-motivation-list-button") as HTMLButtonElement;
    addToBlockedListButton.addEventListener("click", () =>
        renderBlockedList([...motivationList, "Be Productive!"])
    );

    const domList = document.getElementById("motivation-list") as HTMLDivElement;
    while (domList.firstChild) domList.removeChild(domList.firstChild);
    const domMotivationItem = document.getElementById("list-item-template") as HTMLTemplateElement;

    motivationList.forEach((motivationItem, i) => {
        const mi = domMotivationItem.content.cloneNode(true) as DocumentFragment;
        const mu = mi.querySelector(".list-input") as HTMLInputElement;
        const mb = mi.querySelector(".remove-list-input") as HTMLButtonElement;
        mu.value = motivationItem;
        mu.addEventListener("blur", () => {
            motivationList[i] = mu.value;
            renderMotivationList(motivationList);
        })
        mb.addEventListener("click", () =>
            renderMotivationList(motivationList.filter(x => x !== motivationItem))
        );

        domList.appendChild(mi);
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

        renderBlockedList(data.blockedList);
        renderMotivationList(data.motivationList);
    }
});


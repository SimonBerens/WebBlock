import {
    addOnClick,
    getBlocked,
    getThenSetBlocked, getThenSetBlockedCallback
} from "./utils.js";

addOnClick("startAllBlocking", getThenSetBlockedCallback(async res => {
    for (const [listId, blockedList] of Object.entries(res.blockedListList))
        blockedList.isBlocking = true;
}));

addOnClick("goToOptions",
    () => chrome.tabs.create({url: chrome.runtime.getURL("options.html")}));

getBlocked(async res => {
    const blockedListListContainer =
        document.getElementById("blockedListListContainer") as HTMLDivElement;
    const blockedListTemplate =
        document.getElementById("blockedListTemplate") as HTMLTemplateElement;

    for (const [listId, blockedList] of Object.entries(res.blockedListList)) {

        const blockedListTemplateClone = blockedListTemplate.content.cloneNode(true) as DocumentFragment;

        const name = blockedListTemplateClone.querySelector(".name") as HTMLSpanElement;
        name.innerHTML = blockedList.name;

        const setBlockingButton =
            blockedListTemplateClone.querySelector(".setBlockingButton") as HTMLButtonElement;
        if (blockedList.isBlocking) {
            setBlockingButton.innerText = "Blocking";
            setBlockingButton.disabled = true;
        } else {
            setBlockingButton.innerText = "Start Blocking";
            setBlockingButton.disabled = false;
        }
        setBlockingButton.addEventListener("click", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].isBlocking = !res.blockedListList[listId].isBlocking;
            chrome.alarms.clear(listId);
        }));

        const tempUnblockNumberField =
            blockedListTemplateClone.querySelector(".tempUnblockNumberField") as HTMLInputElement;
        tempUnblockNumberField.style.width = "3em";

        const tempUnblockButton =
            blockedListTemplateClone.querySelector(".tempUnblockButton") as HTMLButtonElement;

        tempUnblockNumberField.addEventListener("keyup", ev => {
            if (ev.key === "Enter")
                tempUnblockButton.click();
        });

        tempUnblockButton.addEventListener("click", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].isBlocking = false;
            const mins = parseInt(tempUnblockNumberField.value);
            chrome.alarms.clear(listId);
            chrome.alarms.create(listId, {delayInMinutes: mins});
        }));

        const timer =
            blockedListTemplateClone.querySelector(".timer") as HTMLSpanElement;
        chrome.alarms.get(listId, alarm => {
            if (alarm) {
                const foo = () => {
                    let timeLeft =  alarm.scheduledTime - Date.now();
                    const formattedTime = new Date(timeLeft).toISOString().substr(11, 8);
                    timer.innerHTML = formattedTime;
                    if (formattedTime === "00:00:00")
                        clearInterval(interval);
                };
                foo(); // todo rename
                const interval = setInterval(foo, 1000);
            } else {
                // remove parent div from blockedListContainer
                timer.parentElement.parentElement.removeChild(timer.parentElement);
            }
        });

        blockedListListContainer.appendChild(blockedListTemplateClone);
    }
})

chrome.alarms.onAlarm.addListener(alarm => {
    getThenSetBlocked(async res => {
        res.blockedListList[alarm.name].isBlocking = true;
    });
});
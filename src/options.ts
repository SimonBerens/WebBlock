import {
    addOnClick,
    getBlocked,
    getThenSetBlocked,
    getThenSetBlockedCallback,
    isValidUrl,
} from "./utils.js";

// https://gist.github.com/jed/982883
const uuid4 = (): string => {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

addOnClick("startAllBlocking", () => {
    getThenSetBlocked(async res => {
        for (const [id, blockedList] of Object.entries(res.blockedListList))
            blockedList.isBlocking = true;
    });
    chrome.alarms.clearAll();
});

addOnClick("stopAllBlocking", () => {
    getThenSetBlocked(async res => {
        for (const [id, blockedList] of Object.entries(res.blockedListList))
            blockedList.isBlocking = false;
    });
    chrome.alarms.clearAll();
});


addOnClick("addBlockedList", getThenSetBlockedCallback(async res => {
    res.blockedListList[uuid4()] = {
        name: "Click to Change Name",
        isBlocking: true,
        enabledOnStartup: true,
        customRedirect: "",
        blockedSites: []
    };
}))

getBlocked(async res => {

    const blockedListListContainer = document.getElementById("blockedListListContainer");

    const blockedListTemplate = document.getElementById("blockedListTemplate") as HTMLTemplateElement;


    for (const [listId, blockedList] of Object.entries(res.blockedListList)) {

        const addToHTMLBlockedList = (list: HTMLUListElement, ...sites) => {
            for (const site of sites) {
                const item = document.createElement("li");
                item.appendChild(document.createTextNode(site));
                item.addEventListener("click", () => {
                    getThenSetBlocked(async res => {
                        const curList = res.blockedListList[listId].blockedSites;
                        curList.splice(curList.indexOf(site), 1);
                    });
                    list.removeChild(item);
                });
                list.appendChild(item);
            }
        };

        const blockedListTemplateClone = blockedListTemplate.content.cloneNode(true) as DocumentFragment;

        const name =
            blockedListTemplateClone.querySelector(".name") as HTMLSpanElement;
        name.innerHTML = blockedList.name;
        name.addEventListener("blur", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].name = name.innerText;
        }));
        name.addEventListener("keydown", ev => {
            if (ev.key === "Enter")
                name.blur();
        });

        const setBlockingButton =
            blockedListTemplateClone.querySelector(".setBlockingButton") as HTMLButtonElement;
        if (blockedList.isBlocking) {
            setBlockingButton.innerText = "Stop Blocking";
            setBlockingButton.style.backgroundColor = "red";
        } else {
            setBlockingButton.innerText = "Start Blocking";
            setBlockingButton.style.backgroundColor = "green";
        }
        setBlockingButton.addEventListener("click", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].isBlocking = !res.blockedListList[listId].isBlocking;
            chrome.alarms.clear(listId);
        }));

        const enableOnStartupCheckbox =
            blockedListTemplateClone.querySelector(".enableOnStartupCheckbox") as HTMLInputElement;
        enableOnStartupCheckbox.checked = blockedList.enabledOnStartup;
        enableOnStartupCheckbox.addEventListener("click", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].enabledOnStartup = enableOnStartupCheckbox.checked;
        }));

        const customRedirectTextInput =
            blockedListTemplateClone.querySelector(".customRedirectTextInput") as HTMLInputElement;
        customRedirectTextInput.value = blockedList.customRedirect;
        customRedirectTextInput.addEventListener("blur", getThenSetBlockedCallback(async res => {
            res.blockedListList[listId].customRedirect = customRedirectTextInput.value;
        }));
        customRedirectTextInput.addEventListener("keydown", ev => {
           if (ev.key === "Enter")
               customRedirectTextInput.blur();
        });

        const importFromCsv =
            blockedListTemplateClone.querySelector(".importFromCsv") as HTMLInputElement;

        const blockedSites =
            blockedListTemplateClone.querySelector(".blockedSites") as HTMLUListElement;
        addToHTMLBlockedList(blockedSites, ...res.blockedListList[listId].blockedSites);

        importFromCsv.addEventListener("change", getThenSetBlockedCallback(async res => {
            for (const file of importFromCsv.files) {
                const csvStr = await file.text();
                const lines = csvStr.split(/\r\n|\n/);
                const urls = [];
                for (const line of lines)
                    urls.push(...line.split(",").filter(url => url.length !== 0));
                if (!urls.every(isValidUrl))
                    alert("Some URLs were detected to be invalid, make sure URLs start with http[s]://")
                else res.blockedListList[listId].blockedSites.push(...urls);
            }
        }));

        const addBlockedSiteInput =
            blockedListTemplateClone.querySelector(".addBlockedSiteInput") as HTMLInputElement;

        const addBlockedSiteButton =
            blockedListTemplateClone.querySelector(".addBlockedSiteButton") as HTMLButtonElement;

        addBlockedSiteInput.addEventListener("keyup", ev => {
           if (ev.key === "Enter")
               addBlockedSiteButton.click();
        });

        addBlockedSiteButton.addEventListener("click", getThenSetBlockedCallback(async res => {
            const url = addBlockedSiteInput.value;
            if (!isValidUrl(url))
                alert("URL was detected to be invalid, make sure URLs start with http[s]://")
            else res.blockedListList[listId].blockedSites.push(url);
        }));

        const deleteListButton =
            blockedListTemplateClone.querySelector(".deleteListButton") as HTMLButtonElement;
        deleteListButton.addEventListener("click", getThenSetBlockedCallback(async res => {
            delete res.blockedListList[listId];
        }));

        blockedListListContainer.appendChild(blockedListTemplateClone);

    }
});

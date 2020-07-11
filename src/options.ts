import {addEventListener, addOnClick, getFields, setBlocking, setFields} from "./utils.js";

getFields({enable_on_startup: true, redirect: ""}, res => {
    (document.getElementById("enable_on_startup_checkbox") as HTMLInputElement).checked = res.enable_on_startup;
    (document.getElementById("custom_redirect") as HTMLInputElement).value = res.redirect;
})

addOnClick("stop_blocking", () => {
    setBlocking(false);
    chrome.alarms.clear("temp_unblock_over");
});

addOnClick("enable_on_startup_checkbox", event =>
    setFields({enable_on_startup: (event.target as HTMLInputElement).checked}));

addEventListener("custom_redirect", "change", event => {
    const target = event.target as HTMLInputElement;
    setFields({redirect: target.value ? target.value : ""});
});

const addToHTMLBlockedList = (list_id, ...sites) => {
    const list = document.getElementById(list_id);
    for (const site of sites) {
        const item = document.createElement("li");
        item.appendChild(document.createTextNode(site));
        item.addEventListener("click", () => {
            getFields({[list_id]: []}, res => {
                const new_list = res[list_id];
                new_list.splice(new_list.indexOf(site), 1);
                setFields({[list_id]: new_list});
            });
            list.removeChild(item);
        });
        list.appendChild(item);
    }
};


for (const prefix of ["", "perm_"]) {

    const listId = prefix + "blocked_sites";
    getFields({[listId]: []}, res => {
        const list = document.createElement("ul");
        list.id = listId;
        document.getElementById(prefix + "blocked_list_container").appendChild(list);
        addToHTMLBlockedList(listId, ...res[listId]);
    });


    addEventListener(prefix + "new_site", "keyup", (event: KeyboardEvent) => {
        if (event.keyCode === 13) document.getElementById(prefix + "add_button").click();
    });

    addOnClick(prefix + "add_button", () => getFields({[listId]: []},
        res => {
            const input = document.getElementById(prefix + "new_site") as HTMLInputElement;
            const new_site = input.value;
            const list = res[listId];
            list.push(new_site);
            setFields({[listId]: list});
            addToHTMLBlockedList(listId, new_site);
            input.value = "";
        }));


    addEventListener(prefix + "import_from_csv", "change", async event => {
        const csv_str = await (event.target as HTMLInputElement).files[0].text();
        const lines = csv_str.split(/\r\n|\n/);
        const urls = [];
        for (const line of lines)
            urls.push(...line.split(",").filter(url => url.length !== 0));
        getFields({[listId]: []}, res => {
            res[listId].push(...urls);
            addToHTMLBlockedList(listId, ...urls);
            setFields({[listId]: res[listId]});
        });
    });

}
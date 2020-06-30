import {addOnClick, getFields, setFields, setBlocking, addEventListener} from "./utils.js";

getFields({enable_on_startup: true, redirect: ""}, res => {
    document.getElementById("enable_on_startup_checkbox").checked = res.enable_on_startup;
    document.getElementById("custom_redirect").value = res.redirect;
})

addOnClick("stop_blocking", () => {
    setBlocking(false);
    chrome.alarms.clear("temp_unblock_over");
});

addOnClick("enable_on_startup_checkbox", event =>
    setFields({enable_on_startup: event.target.checked}));

addEventListener("custom_redirect", "change", event =>
    setFields({redirect: event.target.value ? event.target.value : ""}));

const createKVObj = (k, v) => {
    const obj = {};
    obj[k] = v;
    return obj;
}

const addToHTMLBlockedList = (list_id, ...sites) => {
    const list = document.getElementById(list_id);
    for (const site of sites) {
        const item = document.createElement("li");
        item.appendChild(document.createTextNode(site));
        item.addEventListener("click", () => {
            getFields(createKVObj(list_id, []), res => {
                const new_list = res[list_id];
                new_list.splice(new_list.indexOf(site), 1);
                setFields(createKVObj(list_id, new_list));
            });
            list.removeChild(item);
        });
        list.appendChild(item);
    }
};


for (const prefix of ["", "perm_"]) {
    
    const listId = prefix + "blocked_sites";
    getFields(createKVObj(listId, []), res => {
        const list = document.createElement("ul");
        list.id = listId;
        document.getElementById(prefix + "blocked_list_container").appendChild(list);
        addToHTMLBlockedList(listId, ...res[listId]);
    });



    addOnClick(prefix + "add_button", () => getFields(createKVObj(listId, []),
        res => {
            const new_site = document.getElementById(prefix + "new_site").value;
            
            const list = res[listId];
            list.push(new_site);
            setFields(createKVObj(listId, list));
            addToHTMLBlockedList(listId, new_site);
        }));


    addEventListener(prefix + "import_from_csv", "change", async event => {
        const csv_str = await event.target.files[0].text();
        const lines = csv_str.split(/\r\n|\n/);
        const urls = [];
        for (const line of lines)
            urls.push(...line.split(",").filter(url => url.length !== 0));
        getFields(createKVObj(listId, []), res => {
            res[listId].push(...urls);
            addToHTMLBlockedList(listId, ...urls);
            setFields(createKVObj(listId, res[listId]));
        });
    });

}



import {addOnClick, getFields, setFields, setBlocking} from "./utils.js";

addOnClick("stop_blocking", () => {
    setBlocking(false);
    chrome.alarms.clear("temp_unblock_over");
});


const addToHTMLBlockedList = (...sites) => {
    const list = document.getElementById("blocked_list");
    for (const site of sites) {
        const item = document.createElement("li");
        item.appendChild(document.createTextNode(site));
        item.addEventListener("click", () => {
            getFields({blocked_sites: []}, res => {
                const new_list = res.blocked_sites;
                new_list.splice(new_list.indexOf(site), 1);
                setFields({blocked_sites: new_list});
            });
            list.removeChild(item);
        });
        list.appendChild(item);
    }
};


addOnClick("add_button", () => getFields({blocked_sites: []},
    res => {
        const new_site = document.getElementById("new_site").value;
        const list = res.blocked_sites;
        list.push(new_site);
        setFields({blocked_sites: list});
        addToHTMLBlockedList(new_site);
}));


getFields({blocked_sites: [], enable_on_startup: true}, res => {
    document.getElementById("enable_on_startup_checkbox").checked = res.enable_on_startup;

    const list = document.createElement("ul");
    list.id = "blocked_list";
    document.getElementById("blocked_list_container").appendChild(list);
    addToHTMLBlockedList(...res.blocked_sites);
});

addOnClick("enable_on_startup_checkbox", event => setFields({enable_on_startup: event.target.checked}));

document.getElementById("import_from_csv").addEventListener("change", async event => {
    const csv_str = await event.target.files[0].text();
    const lines = csv_str.split(/\r\n|\n/);
    const urls = [];
    for (const line of lines)
        urls.push(...line.split(",").filter(url => url.length !== 0));
    getFields({blocked_sites: []}, res => {
        res.blocked_sites.push(...urls);
        addToHTMLBlockedList(...urls);
        setFields({blocked_sites: res.blocked_sites});
    });
});
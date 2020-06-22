import {addOnClick, getFields, setFields, setBlocking} from "./utils.js";

addOnClick("stop_blocking", () => {
    setBlocking(false);
    chrome.alarms.clearAll();
});


const addTextToHtmlListAndSync = (list, text) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    item.addEventListener("click", () => {
        getFields({blocked_sites: []}, res => {
            const new_list = res.blocked_sites;
            new_list.splice(new_list.indexOf(text), 1);
            setFields({blocked_sites: new_list});
        })
        list.removeChild(item);
    })
    list.appendChild(item);
}


addOnClick("add_button", () => getFields({blocked_sites: []},
    res => {
        const new_site = document.getElementById("new_site").value;
        const list = res.blocked_sites;
        list.push(new_site);
        setFields({blocked_sites: list});
        const html_list = document.getElementById("blocked_list");
        addTextToHtmlListAndSync(html_list, new_site);
}));


getFields({blocked_sites: []}, res => {
    const list = document.createElement("ul");
    list.id = "blocked_list";
    for (const site of res.blocked_sites)
        addTextToHtmlListAndSync(list, site);
    document.getElementById("blocked_list_container").appendChild(list);
})




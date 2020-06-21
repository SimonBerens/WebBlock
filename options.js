import {addOnClick} from "./utils.js";

addOnClick("stop_blocking", () => chrome.storage.sync.set({blocking: false}));


const addTextToHtmlListAndSync = (list, text) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    item.addEventListener("click", () => {
        chrome.storage.sync.get({blocked_sites: []}, res => {
            const new_list = res.blocked_sites;
            new_list.splice(new_list.indexOf(text), 1);
            chrome.storage.sync.set({blocked_sites: new_list});
        })
        list.removeChild(item);
    })
    list.appendChild(item);
}


addOnClick("add_button", () => chrome.storage.sync.get({blocked_sites: []},
    res => {
        const new_site = document.getElementById("new_site").value;
        const list = res.blocked_sites;
        list.push(new_site);
        chrome.storage.sync.set({blocked_sites: list});
        const html_list = document.getElementById("blocked_list");
        addTextToHtmlListAndSync(html_list, new_site);
}));


chrome.storage.sync.get({blocked_sites: []}, res => {
    const list = document.createElement("ul");
    list.id = "blocked_list";
    for (const site of res.blocked_sites)
        addTextToHtmlListAndSync(list, site);
    document.getElementById("blocked_list_container").appendChild(list);
})




document.getElementById("stop_blocking")
    .addEventListener("click", () => chrome.storage.sync.set({blocking: false}));


const addTextToList = (list, text) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    list.appendChild(item);
}


document.getElementById("add_button")
    .addEventListener("click",
        () => chrome.storage.sync.get({blocked_sites: []},
            res => {
                const new_site = document.getElementById("new_site").value;
                const list = res.blocked_sites;
                list.push(new_site);
                chrome.storage.sync.set({blocked_sites: list});
                const html_list = document.getElementById("blocked_list");
                addTextToList(html_list, new_site);
            }));


chrome.storage.sync.get({blocked_sites: []}, res => {
    const list = document.createElement("ul");
    list.id = "blocked_list";
    for (const site of res.blocked_sites) {
        addTextToList(list, site);
    }
    document.getElementById("blocked_list_container").appendChild(list);
})




export const addOnClick = (id, func) => {
    document.getElementById(id).addEventListener("click", func);
}

export const getFields = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setFields = chrome.storage.sync.set.bind(chrome.storage.sync);
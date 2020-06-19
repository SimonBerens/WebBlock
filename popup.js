document.getElementById("start_blocking")
    .addEventListener("click", () => {
        chrome.storage.sync.set({blocking: true});
    })
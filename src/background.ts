chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "reblock") {
        chrome.storage.local.set({blocking: true});
    }
});
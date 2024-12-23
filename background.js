// background.js (for Manifest V2)

chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "someAction") {
        console.log('Action received in background:', request);
    }
});
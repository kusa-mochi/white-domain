function IsWhiteDomain(domain) {

    //TODO: check if a domain is in user's white list.

    // chrome.storage.sync.get(['whiteList'], function (result) {
    //     console.log('Value currently is ' + result.whiteList);
    // });

    return true;
}

function WhiteDomain() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [44, 148, 60, 100] });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            var tablink = tab.url;
            var domain = tablink.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
            chrome.browserAction.setBadgeText({ text: IsWhiteDomain(domain) ? "SAFE" : "" });
            alert(domain);
        }
    });
}

window.onload = WhiteDomain;

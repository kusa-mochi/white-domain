function IsWhiteDomain(domain) {

    //TODO: check if a domain is in user's white list.
    
    return true;
}

function WhiteDomain() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [44, 148, 60, 100] });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            var tablink = tab.url;
            var domain = tablink.replace('http://','').replace('https://','').split(/[/?#]/)[0];
            if(IsWhiteDomain(domain) == true) {
                chrome.browserAction.setBadgeText({ text: "SAFE" });
            }
            else {
                chrome.browserAction.setBadgeText({ text: "" });
            }
            alert(domain);
        }
    });
}

window.onload = WhiteDomain;

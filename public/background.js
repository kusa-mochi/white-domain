function GetDomainFromUrl(url) {
    return url.replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .split(/[/?#]/)[0];
}

function IsWhiteDomain(domain) {

    //TODO: check if a domain is in user's white list.

    // chrome.storage.sync.get(['whiteList'], function (result) {
    //     console.log('Value currently is ' + result.whiteList);
    // });

    // return true;


    //DEBUG
    return (
        domain == 'google.com' ||
        domain == 'youtube.com' ||
        domain == 'slash-mochi.net'
    );
}

function BadgeText(url) {
    const domain = GetDomainFromUrl(url);
    return IsWhiteDomain(domain) ? "SAFE" : "";
}

function SetBadgeTest(url) {
    chrome.browserAction.setBadgeText({ text: BadgeText(url) });
}

function WhiteDomain() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [44, 148, 60, 100] });

    // タブが更新されたときに実行する処理
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            SetBadgeTest(tab.url);
        }
    });

    // タブが切り替わったときに実行する処理
    chrome.tabs.onActivated.addListener(function (tabId) {
        chrome.tabs.query({ "active": true }, function (tab) {
            SetBadgeTest(tab[0].url);
        });
    });
}

window.onload = WhiteDomain;

function GetDomainFromUrl(url) {
    return url.replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .split(/[/?#]/)[0];
}

function deserialize(list) {
    output = [];
    tmpList = list.split(",");
    for (let i = 0; i < tmpList.length; i++) {
        output.push({
            id: i,
            domain: tmpList[i]
        });
    }
    return output;
}

function SetWhiteBadge() {
    chrome.browserAction.setBadgeText({ text: 'WHITE' });
}

function SetNoBadge() {
    chrome.browserAction.setBadgeText({ text: '' });
}

function SetBadgeText(url) {
    console.log('Begin SetBadgeText(url)');
    const domain = GetDomainFromUrl(url);
    console.log('SetBadgeText(url): domain=' + domain);
    if (domain !== undefined && domain !== null) {
        chrome.storage.sync.get("domains", function (result) {
            console.log("storage result: " + result);
            console.log("storage get: " + result.domains);
            if (result.domains === undefined || result.domains === null) {
                SetNoBadge();
                return;
            }

            const list = deserialize(result.domains);
            console.log('IsWhiteDomain(): whiteList=' + list);
            for(let iList = 0; iList < list.length; iList++) {
                console.log('domain #' + iList + ': ' + list[iList].domain);
            }

            if (list === undefined || list === null) {
                SetNoBadge();
                return;
            }

            if (list.some(item => { return item.domain == domain; })) {
                SetWhiteBadge();
            }
            else {
                SetNoBadge();
            }
        });
    }
    else {
        console.log('no domain in this url.');
        SetNoBadge();
    }
}

function WhiteDomain() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [44, 148, 60, 100] });

    // タブが更新されたときに実行する処理
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            console.log('tab updated. url=' + tab.url);
            SetBadgeText(tab.url);
        }
    });

    // タブが切り替わったときに実行する処理
    chrome.tabs.onActivated.addListener(function (tabId) {
        chrome.tabs.query({ "active": true }, function (tab) {
            console.log('tab switched. url=' + tab[0].url);
            SetBadgeText(tab[0].url);
        });
    });
}

window.onload = WhiteDomain;

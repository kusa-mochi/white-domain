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
    chrome.browserAction.setBadgeText({ text: 'OK' });
}

function SetNoBadge() {
    chrome.browserAction.setBadgeText({ text: '' });
}

function SetBadgeText(url) {
    console.log('Begin SetBadgeText(url)');
    const domain = GetDomainFromUrl(url);
    if (domain !== undefined && domain !== null) {
        chrome.storage.sync.get("domains", function (result) {
            if (result.domains === undefined || result.domains === null) {
                SetNoBadge();
                return;
            }

            const list = deserialize(result.domains);

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

function openOrFocusOptionsPage() {
    var optionsUrl = chrome.extension.getURL('index.html');
    chrome.tabs.query({}, function (extensionTabs) {
        var found = false;
        for (var i = 0; i < extensionTabs.length; i++) {
            if (optionsUrl == extensionTabs[i].url) {
                found = true;
                console.log("tab id: " + extensionTabs[i].id);
                chrome.tabs.update(extensionTabs[i].id, { "selected": true });
            }
        }
        if (found == false) {
            chrome.tabs.create({ url: "index.html" });
        }
    });
}

function WhiteDomain() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [44, 148, 60, 100] });

    chrome.storage.sync.get("initialized", function (result) {
        // if this extension is called NOT first after installed.
        if (result.initialized) return;

        openOrFocusOptionsPage();
        chrome.storage.sync.set({ initialized: true }, function () { });
    });

    // execute this code when a tab is opened/updated.
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && tab.active) {
            console.log('tab updated. url=' + tab.url);
            SetBadgeText(tab.url);
        }
    });

    // execute this code when a tab is switched.
    chrome.tabs.onActivated.addListener(function (tabId) {
        chrome.tabs.query({ "active": true }, function (tab) {
            console.log('tab switched. url=' + tab[0].url);
            SetBadgeText(tab[0].url);
        });
    });

    chrome.extension.onConnect.addListener(function (port) {
        var tab = port.sender.tab;
        // This will get called by the content script we execute in
        // the tab as a result of the user pressing the browser action.
        port.onMessage.addListener(function (info) {
            var max_length = 1024;
            if (info.selection.length > max_length)
                info.selection = info.selection.substring(0, max_length);
            openOrFocusOptionsPage();
        });
    });

    // Called when the user clicks on the browser action icon.
    chrome.browserAction.onClicked.addListener(function (tab) {
        openOrFocusOptionsPage();
    });
}

window.onload = WhiteDomain;

const activeTabs = new Set();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    try {
        if (message.action === 'playSound') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: (soundUrl) => {
                            const audio = new Audio(soundUrl);
                            audio.play().catch((err) => console.error('Ошибка воспроизведения звука:', err));
                        },
                        args: [chrome.runtime.getURL('assets/click.wav')],
                    });
                }
            });
        }
        if (message.action === 'createClicker') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const activeTab = tabs[0];
                    if (!activeTabs.has(activeTab.id)) {
                        activeTabs.add(activeTab.id);
                    }
                    chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        func: startClicker,
                        args: [message.clickRate, message.coordinates[0], message.coordinates[1]],
                    });
                }
            });
        }
        if (message.action === "duplicateClicker") {
            const currentUrl = message.url;
            chrome.windows.getAll({ populate: true }, (windows) => {
                windows.forEach((window) => {
                    window.tabs.forEach((tab) => {
                        if (tab.url.includes(currentUrl) && !activeTabs.has(tab.id)) {
                            activeTabs.add(tab.id);
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                func: startClicker,
                                args: [message.clickRate, message.coordinates[0], message.coordinates[1]],
                            });
                        }
                    });
                });
            });
        }
        if (message.action === "stopIntervals") {
            chrome.windows.getAll({ populate: true }, (windows) => {
                windows.forEach((window) => {
                    window.tabs.forEach((tab) => {
                        if (activeTabs.has(tab.id)) {
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                func: stopInterval,
                            });
                        }
                    });
                });
                activeTabs.clear();
            });

        }
        if (message.action === "setErrorIcon") {
            chrome.action.setIcon({
                path: {
                    "16": "icons/clickError16.png",
                    "64": "icons/clickError64.png",
                    "128": "icons/clickError128.png",
                }
            });
        }
    } catch (error) {
        console.log(error);

        chrome.action.setIcon({
            path: {
                "16": "icons/clickError16.png",
                "64": "icons/clickError64.png",
                "128": "icons/clickError128.png",
            }
        });
    }
});

async function startClicker(clickRate, coordinateX, coordinateY) {
    function simulateClickAt(x, y) {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        document.elementFromPoint(x, y).dispatchEvent(clickEvent);
    }

    if (!window.intervals) {
        window.intervals = []
    }

    const interval = setInterval(() => simulateClickAt(coordinateX, coordinateY), 1000 / clickRate);
    window.intervals.push(interval)
}

async function stopInterval() {
    window.intervals.forEach((interval) => {
        clearInterval(interval)
    })
    window.intervals = []
}

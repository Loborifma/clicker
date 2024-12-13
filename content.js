let mouseX;
let mouseY;

let savedX;
let savedY;

const intervalStarted = {
    createClicker: false,
    duplicateClicker: false
}

const defineAction = (e, action) => {
    e.preventDefault()
    savedX = mouseX;
    savedY = mouseY;

    const startInterval = async () => {
        const { clickRate } = await chrome.storage.local.get('clickRate')

        chrome.runtime.sendMessage({
            action,
            url: window.location.hostname,
            clickRate: clickRate || 1,
            coordinates: [savedX, savedY]
        });
    }

    if (intervalStarted[action]) {
        chrome.runtime.sendMessage({
            action: 'stopIntervals'
        });
        startInterval()
    } else {
        intervalStarted[action] = true
        startInterval()
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY
})

document.addEventListener("keyup", async (e) => {
    try {
        const { isAuthenticated } = await chrome.storage.local.get("isAuthenticated");
        const hotKeys = ['F2', 'F9', 'F8', 'F4', 'Escape', '`']

        if (!isAuthenticated && hotKeys.includes(e.key) || (e.shiftKey && e.key === '+') || (e.shiftKey && e.key === '-' || e.shiftKey && e.key === '_')) {
            chrome.runtime.sendMessage({
                action: "showLoginPopup"
            });
            return;
        }

        if (e.key === 'F2') defineAction(e, 'createClicker')
        if (e.key === 'F9') defineAction(e, 'duplicateClicker')

        if (e.key === 'F8' || e.key === 'F4') {
            e.preventDefault()
            e.key === 'F4' ? intervalStarted.createClicker = false : intervalStarted.duplicateClicker = false
            chrome.runtime.sendMessage({
                action: 'stopIntervals'
            });
        }

        if (e.key === 'Escape') {
            e.preventDefault()
            intervalStarted.createClicker = false;
            intervalStarted.duplicateClicker = false;
            chrome.runtime.sendMessage({
                action: 'stopIntervals'
            });
        }

        if (e.key === '`') {
            e.preventDefault()
            document.querySelectorAll('.sport-competition-wrap--x2876 > div').forEach((el) => {
                if (!el.classList.value.includes('collapsed')) {
                    el.click()
                }
            })
        }

        if (e.shiftKey && e.key === '+') {
            const input = document.querySelector('input.coupon-settings-sum__editor--KgfuY')
            const stepPariValue = await chrome.storage.local.get('stepPari').stepPari || 500
            input.value = Number(input.value) + stepPariValue
        }

        if (e.shiftKey && e.key === '-' || e.shiftKey && e.key === '_') {
            const input = document.querySelector('input.coupon-settings-sum__editor--KgfuY')
            const stepPariValue = await chrome.storage.local.get('stepPari').stepPari || 500
            input.value = Number(input.value) - stepPariValue
        }
    } catch (error) {
        console.log(error);

        chrome.runtime.sendMessage({
            action: 'setErrorIcon'
        });
    }
});

setInterval(() => {
    document.querySelectorAll('div.sport-base-event-wrap--WmtIb a.table-component-text--Tjj3g').forEach(async (el) => {
        try {
            const { matchTitles } = await chrome.storage.local.get('matchTitles')

            if (!matchTitles[0][0]) {
                el.removeAttribute('style')
                return
            }

            const matchTitlesRegex = matchTitles?.map((el) => new RegExp(`${el[0]}|${el[1]}`, 'i'))

            matchTitlesRegex?.forEach((regExp) => {
                if (el.textContent.search(regExp) !== -1 && el.getAttribute('style') !== 'background-color: #ff6666') {
                    el.setAttribute('style', 'background-color: #ff6666')
                    chrome.runtime.sendMessage({
                        action: 'playSound'
                    });
                }
            })

        } catch (error) {
            console.log(error);
        }
    })
}, 5000)

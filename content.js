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
        chrome.runtime.sendMessage({
            action,
            url: window.location.hostname,
            clickRate: await chrome.storage.local.get('clickRate').clickRate || 1,
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
    mouseX = e.clientX;
    mouseY = e.clientY
})

document.addEventListener("keyup", async (e) => {
    try {
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
            document.querySelectorAll('.sport-competition-wrap--x2876 > div').forEach((el) => {
                if (!el.classList.value.includes('collapsed')) {
                    el.click()
                }
            })
        }

        if (e.shiftKey && e.key === '+') {
            const input = document.querySelector('input.coupon-settings-sum__editor--KgfuY')
            const stepPari = await chrome.storage.local.get('stepPari').stepPari || 500
            input.value = Number(input.value) + stepPari
        }

        if (e.shiftKey && e.key === '-' || e.shiftKey && e.key === '_') {
            const input = document.querySelector('input.coupon-settings-sum__editor--KgfuY')
            const stepPari = await chrome.storage.local.get('stepPari').stepPari || 500
            input.value = Number(input.value) - stepPari
        }
    } catch (error) {
        console.log(error);

        chrome.runtime.sendMessage({
            action: 'setErrorIcon'
        });
    }
});
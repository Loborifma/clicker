document.getElementById('clickRate').addEventListener('input', (e) => {
  if (e.target.value <= 0) {
    document.getElementById('invalidClickRate').hidden = false
  }
  if (e.target.value > 100) {
    document.getElementById('invalidClickRate').hidden = false
  }
  if (e.target.value > 0 && e.target.value <= 100) {
    document.getElementById('invalidClickRate').hidden = true
  }
});

document.getElementById('saveClickRate').addEventListener('click', () => {
  const clickRate = Number(document.getElementById('clickRate').value);
  chrome.storage.local.set({ clickRate });
})

document.getElementById('saveMatchTitles').addEventListener('click', () => {
  const matchTitles = String(document.getElementById('matchTitles').value).split(',').map((el) => el.split(/ \W /));
  chrome.storage.local.set({ matchTitles });
})

document.getElementById('saveStepPari').addEventListener('click', () => {
  const stepPari = Number(document.getElementById('stepPari').value);
  chrome.storage.local.set({ stepPari });
})

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('clickRate', (result) => {
    const clickRate = result.clickRate;
    if (clickRate) {
      document.getElementById('clickRate').value = clickRate;
    }
  });
  chrome.storage.local.get('stepPari', (result) => {
    const stepPari = result.stepPari;
    if (stepPari) {
      document.getElementById('stepPari').value = stepPari;
    }
  });
  chrome.storage.local.get('matchTitles', (result) => {
    const matchTitles = result.matchTitles;
    if (matchTitles) {
      document.getElementById('matchTitles').value = matchTitles;
    }
  });
});

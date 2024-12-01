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

document.getElementById('saveStepPari').addEventListener('click', () => {
  const stepPari = Number(document.getElementById('stepPari').value);
  chrome.storage.local.set({ stepPari });
})

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('clickRate', (result) => {
    const clickRate = result.clickRate || '1';
    document.getElementById('clickRate').value = clickRate;
  });
  chrome.storage.local.get('stepPari', (result) => {
    const stepPari = result.stepPari || '500';
    document.getElementById('stepPari').value = stepPari;
  });
});

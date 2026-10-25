let stream = null;

const cameraBtn = document.getElementById('cameraAccessBtn');
const cameraVideo = document.getElementById('cameraPreview');
const fullScreenBtn = document.getElementById('fullScreenBtn');
const changeFolderBtn = document.getElementById('changeFolderBtn');
const folderDisplay = document.getElementById('folderDisplay');
const goToTestBtn = document.getElementById('goToTestBtn');

async function initFolder() {
  const api = window.athena || window.electronAPI;
  const savedFolder = localStorage.getItem('snapStorageFolder');
  if (savedFolder) {
    folderDisplay.textContent = savedFolder + ' 📁';
    return;
  }
  if (api && api.getStorageFolder) {
    const defaultFolder = await api.getStorageFolder();
    folderDisplay.textContent = defaultFolder + ' 📁';
    localStorage.setItem('snapStorageFolder', defaultFolder);
  }
}

initFolder();

cameraBtn.onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraVideo.srcObject = stream;
    cameraBtn.textContent = 'Camera Configured';
    cameraBtn.style.background = '#16a34a';
    goToTestBtn.classList.add('active');
  } catch (err) {
    alert('Could not access camera. Please allow camera permissions.');
  }
};

fullScreenBtn.onclick = () => {
  if (window.electronAPI && window.electronAPI.setFullScreen) {
    window.electronAPI.setFullScreen(true);
    fullScreenBtn.textContent = 'Full Screen Enabled';
    fullScreenBtn.style.background = '#16a34a';
  }
};

changeFolderBtn.onclick = async () => {
  if (window.electronAPI && window.electronAPI.selectFolder) {
    const selected = await window.electronAPI.selectFolder();
    if (selected) {
      localStorage.setItem('snapStorageFolder', selected);
      folderDisplay.textContent = selected + ' 📁';
    }
  }
};

goToTestBtn.onclick = () => {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  window.location.href = 'dashboard.html';
};

document.getElementById('btnVideoSnapshots').onclick = () => {
  alert('Periodic webcam snapshots are enabled and will be saved to your selected storage folder.');
};

document.getElementById('btnNativeRules').onclick = async () => {
  const api = window.athena || window.electronAPI;
  if (api && api.showRules) {
    await api.showRules();
  } else {
    alert('Native Rules:\n1. Full screen mode is enforced.\n2. Snapshots are captured periodically.\n3. Application must remain focused.');
  }
};

document.getElementById('btnChromiumRules').onclick = () => {
  alert('Chromium Rules:\n1. WebRTC video permissions are active.\n2. Local storage is enabled for offline sync.\n3. Hardware acceleration is active.');
};

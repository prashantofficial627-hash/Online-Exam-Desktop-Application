const { contextBridge, ipcRenderer } = require("electron");

const athenaAPI = {
  registerListenerForTimerTickFromMain: (callback) => {
    const fn = (_e, msg) => callback(msg);
    ipcRenderer.on("timer", fn);
    return () => ipcRenderer.removeListener("timer", fn);
  },
  startTimerOnMain: () => ipcRenderer.invoke("start-timer"),
  registerListenerForCameraSnapFromMain: (callback) => {
    ipcRenderer.on("camera-shot", callback);
    return () => ipcRenderer.removeListener("camera-shot", callback);
  },
  storeCameraSnapImageOnDisk: (data) => ipcRenderer.invoke("store-camera-snap-image-on-disk", data),
  showRules: () => ipcRenderer.invoke("show-rules"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  getStorageFolder: () => ipcRenderer.invoke("get-storage-folder"),
  setFullScreen: (flag) => ipcRenderer.send("set-fullscreen", flag)
};

contextBridge.exposeInMainWorld("athena", athenaAPI);
contextBridge.exposeInMainWorld("electronAPI", athenaAPI);

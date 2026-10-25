import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import path from "path";
import fs from "fs";

let win = null;
let startTimestamp = null;
let snapDirectory = path.join(import.meta.dirname, "user-camera-snap");

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js")
    }
  });

  win.loadFile(path.join(import.meta.dirname, "../pages/index.html"));
}

ipcMain.handle("start-timer", () => {
  startTimestamp = Date.now();
  setInterval(() => win.webContents.send("timer", (Date.now() - startTimestamp) / 1000), 1000);
  setInterval(() => win.webContents.send("camera-shot"), 5000);
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"]
  });

  if (!result.canceled && result.filePaths[0]) {
    snapDirectory = result.filePaths[0];
  }
  return snapDirectory;
});

ipcMain.handle("get-storage-folder", () => snapDirectory);

ipcMain.handle("store-camera-snap-image-on-disk", (event, data) => {
  if (!fs.existsSync(snapDirectory)) {
    fs.mkdirSync(snapDirectory, { recursive: true });
  }
  fs.writeFileSync(path.join(snapDirectory, `${Date.now()}.jpg`), Buffer.from(data));
});

ipcMain.handle("show-rules", async () => {
  return await dialog.showMessageBox(win, {
    type: "info",
    title: "Exam Rules",
    message: "Exam Rules & Instructions",
    detail: "1. Stay on the exam screen.\n2. Camera must remain enabled.\n3. Do not switch tabs or windows.\n4. Submit before the timer ends.",
    buttons: ["Accept & Proceed", "Cancel"],
    checkboxLabel: "I have read and agree to the rules"
  });
});

ipcMain.on("set-fullscreen", (event, flag) => {
  win.setFullScreen(flag);
});

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(permission === "media");
  });
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

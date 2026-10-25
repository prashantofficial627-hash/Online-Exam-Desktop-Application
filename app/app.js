import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import path from "path";
import fs from "fs";
import { Buffer } from "node:buffer";

let electronWindow = null;
let startTimestamp = null;
let snapDirectory = path.join(import.meta.dirname, "user-camera-snap");

function createWindow() {
  electronWindow = new BrowserWindow({
    height: 1000,
    width: 1000,
    webPreferences: {
      devTools: true,
      preload: path.join(import.meta.dirname, "preload.js")
    }
  });

  electronWindow.loadFile(path.join(import.meta.dirname, "../pages/index.html"));
}

ipcMain.handle("start-timer", () => {
  startTimestamp = Date.now();
  setInterval(() => {
    if (electronWindow && !electronWindow.isDestroyed()) {
      electronWindow.webContents.send("timer", (Date.now() - startTimestamp) / 1000);
    }
  }, 1000);
  setInterval(() => {
    if (electronWindow && !electronWindow.isDestroyed()) {
      electronWindow.webContents.send("camera-shot");
    }
  }, 5000);
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(electronWindow, {
    title: "Select Folder for Camera Snaps",
    properties: ["openDirectory", "createDirectory"]
  });

  if (!result.canceled && result.filePaths[0]) {
    snapDirectory = result.filePaths[0];
  }
  return snapDirectory;
});

ipcMain.handle("get-storage-folder", () => snapDirectory);

ipcMain.handle("store-camera-snap-image-on-disk", (_event, data) => {
  fs.mkdirSync(snapDirectory, { recursive: true });
  fs.writeFileSync(path.join(snapDirectory, `${Date.now()}.jpg`), Buffer.from(data));
});

ipcMain.handle("show-rules", async () => {
  const buttons = ["Accept & Proceed", "Decline", "Cancel"];
  const { response, checkboxChecked } = await dialog.showMessageBox(electronWindow, {
    type: "info",
    title: "Athena Exam Rules",
    message: "Exam Rules",
    detail:
      "1. Stay on the exam screen.\n" +
      "2. Camera must remain enabled.\n" +
      "3. Do not leave the exam.\n" +
      "4. Do not use external assistance.\n" +
      "5. Click Exit Exam when finished.",
    buttons,
    defaultId: 0,
    cancelId: 2,
    checkboxLabel: "I have read and agree to the exam rules"
  });

  const clickedButton = buttons[response] ?? `Button ${response}`;
  return { clickedButton, checkboxChecked };
});

ipcMain.on("set-fullscreen", (event, flag) => {
  if (electronWindow && !electronWindow.isDestroyed()) {
    electronWindow.setFullScreen(flag);
  }
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

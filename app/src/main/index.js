'use strict';

import fs from 'fs';
import {
  app,
  ipcMain,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut
} from 'electron';

let mainWindow = null;
let mainTray = null;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function createTray() {
  mainTray = new Tray(`${__dirname}/images/trayTemplate.png`);
  mainTray.setToolTip('Cama');
  mainTray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Toggle Cama',
        accelerator: 'CommandOrControl+Alt+/',
        click() {
          toggleWindow();
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ])
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 89,
    width: 720,
    alwaysOnTop: process.env.NODE_ENV !== 'development',
    center: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    frame: false
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    toggleWindow();
  });
  return mainWindow;
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
}

app.on('ready', () => {
  createTray();
  createWindow().hide();
  app.dock.hide();

  globalShortcut.register('CommandOrControl+Alt+/', () => {
    toggleWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('get-const:req', ({sender}) => {
  try {
    const home = app.getPath('home');
    const importData = fs.readFileSync(
      `${home}/.config/cama/import.json`,
      'utf-8'
    );
    sender.send('get-const:res', JSON.parse(importData));
  } catch (err) {
    console.log(err);
    sender.send('get-const:res', {});
  }
});

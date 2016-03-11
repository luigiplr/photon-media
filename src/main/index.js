'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
let mainWindow = null;


crashReporter.start();

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')();
}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 728 });

    mainWindow.loadURL(`file://${__dirname}/../render/app.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    if (process.env.NODE_ENV === 'development')
        mainWindow.openDevTools()

})

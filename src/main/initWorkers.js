'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const electron = require('electron')

const BrowserWindow = electron.BrowserWindow
const crashReporter = electron.crashReporter
const app = electron.app


crashReporter.start()

if (process.env.NODE_ENV === 'development') require('electron-debug')()


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        resizable: true,
        title: 'Photon Media',
        center: true,
        frame: true,
        show: false
    })

    mainWindow.loadURL(`file://${__dirname}/../render/app.html`);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
    })

    if (process.env.NODE_ENV === 'development') mainWindow.openDevTools()
})

import { crashReporter, BrowserWindow, app } from 'electron'
import jade from 'jade'

import initWorkers from './initWorkers'
import jadeINDEX from './index.jade'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

crashReporter.start({
    productName: 'Photon Media',
    companyName: 'Magics'
})

if (process.env.NODE_ENV === 'development') require('electron-debug')({
    showDevTools: true
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        resizable: true,
        title: 'Photon Media',
        center: true,
        'auto-hide-menu-bar': true,
        frame: true,
        show: false
    })

    const workers = new initWorkers()

    mainWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(jade.render(jadeINDEX).toString())}`);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
    })
})

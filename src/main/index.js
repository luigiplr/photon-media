import { crashReporter, BrowserWindow, app } from 'electron'
import minimist from 'minimist'
import path from 'path'

const args = minimist(process.argv.slice(2))

process.env.NODE_ENV = minimist(process.argv.slice(2)).dev ? 'development' : 'production'


if (process.env.NODE_ENV === 'development') require('electron-debug')({
    showDevTools: true
})

app.commandLine.appendSwitch('allow-file-access-from-files', true)

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
        show: true
    })

    const workers = new initWorkers()

    mainWindow.loadURL(`file://${path.join(__dirname, '../', 'app.html')}`)

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
    })
})

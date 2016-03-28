import { crashReporter, BrowserWindow, app, screen } from 'electron'
import windowStateKeeper from 'electron-window-state'
import minimist from 'minimist'
import path from 'path'

const args = minimist(process.argv.slice(2))

process.env.NODE_ENV = minimist(process.argv.slice(2)).dev ? 'development' : 'production'

/* BEGIN CHROME FLAGS */

app.commandLine.appendSwitch('allow-file-access-from-files', true)
//app.commandLine.appendSwitch('enable-zero-copy', true)
app.commandLine.appendSwitch('num-raster-threads', 4)
//app.commandLine.appendSwitch('enable-gpu-rasterization', true)


/* END CHROME FLAGS */

app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
    const { workAreaSize } = require('screen').getPrimaryDisplay()

    const mainWindowState = windowStateKeeper({
        defaultWidth: workAreaSize.width * 0.8,
        defaultHeight: workAreaSize.height * 0.8
    })

    const mainWindow = new BrowserWindow({
        resizable: true,
        title: 'Photon Media',
        center: true,
        frame: false,
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 768,
        minHeight: 468,
        backgroundColor: '#212121'
    })

    mainWindowState.manage(mainWindow)

    mainWindow.loadURL(`file://${path.join(__dirname, '../', 'app.html')}`)

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
    })

    if (process.env.NODE_ENV === 'development') {
        const { client } = require('electron-connect')
        client.create(mainWindow)
        mainWindow.toggleDevTools()
        mainWindow.focus()
    }
})
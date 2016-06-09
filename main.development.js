import { app, BrowserWindow, shell, screen } from 'electron'
import windowStateKeeper from 'electron-window-state'

let menu
let template
let mainWindow = null


if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.on('ready', () => {
  const { workAreaSize } = screen.getPrimaryDisplay()

  const mainWindowState = windowStateKeeper({
    defaultWidth: workAreaSize.width * 0.8,
    defaultHeight: workAreaSize.height * 0.8
  })

  mainWindow = new BrowserWindow({
    resizable: true,
    title: 'Photon Media',
    center: true,
    frame: false,
    show: false,
    minWidth: 768,
    minHeight: 468,
    backgroundColor: '#212121',
    ...mainWindowState
  })

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => mainWindow = null)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
  }
})

class Plugins extends EventEmitter {
  constructor(workers) {
    super()
    this.workers = workers

    this.plugins = {}
    this.appVersion = remote.app.getVersion()
    this.pluginDir = path.join(remote.app.getPath('appData'), remote.app.getName(), 'plugins')

    this.sockets = this.workers.socket.sockets

    this.init()
      .then(::this.checkInstalled)
  }

  init = () => new Promise(resolve => {
    const id = uuid()
    this.sockets.emit('plugins:init', { pluginDir: this.pluginDir, id })
    this.workers.once(id, resolve)
  })

  checkInstalled() {
    const id = uuid()
    console.info(`Plugins initializing from "${this.pluginDir}"`)
    this.sockets.emit('plugins:get', { appVersion: this.appVersion, id })
    this.workers.once(id, plugins => {
      this.plugins = plugins
      this.emit('initiated')
    })
  }

  verifyDefaultPlugins() {
    return new Promise(resolve => {
      const id = uuid()
      this.sockets.emit('plugins:verifyDefault', { pluginDir: this.pluginDir, installDir: path.join(__dirname, '..', 'plugins'), id })
      this.workers.once(id, resolve)
    })
  }

  install = (installPath) => new Promise(resolve => {
    console.info(`Installing: ${installPath}`)
    const id = uuid()

    this.sockets.emit('plugins:install', { installPath, id })
    this.workers.once(id, plugins => {
      this.plugins = plugins
      this.emit('plugin:installed', plugins)
      resolve()
    })
  })

  remove(pluginID) {
    console.info(`Removing Plugin: ${pluginID}`)
    const removalRequest = uuid()

    this.sockets.emit('plugins:remove', { id: removalRequest, pluginID })
    this.workers.once(removalRequest, () => this.emit(`${pluginID}:removed`))
  }
}

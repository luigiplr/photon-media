workers.plugins = class pluginsWorker {
  constructor(port) {
    this.socket = socketClient(`http://localhost:${port}`)

    this.socket.on('connect', () => {
      this.log('Socket Connected!', 'info')
      this.socket.emit('initiated')
    })
    this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

    this.pluginDir = null
    this.plugins = {}
    this.initEvents()
  }

  log = (message, type = 'log') => this.socket.emit('info', {
    source: 'Plugins Worker',
    type,
    message
  });

  pluginQueue = async.queue(({ pluginPath, operation, installPath }, next) => {
    switch (operation) {
      case 'install':
        const unzipper = new decompressZip(installPath)
        unzipper.extract({ path: path.join(this.pluginDir, path.parse(installPath).name) })

        unzipper.on('error', next)
        unzipper.on('extract', () => {
          this.pluginQueue.push({ pluginPath: path.join(this.pluginDir, path.parse(installPath).name), operation: 'query' })
          next()
        })
        break
      case 'remove':


        break
      case 'query':
        const pluginPackage = require(path.join(pluginPath, 'package.json'))
        const { dependencies, name } = pluginPackage

        this.plugins[name] = {
          package: pluginPackage,
          path: pluginPath
        }
        next()
        break
      default:
        next()
    }
  });

  initEvents() {

    this.socket.on('plugins:init', ({ id, pluginDir }) => {
      this.pluginDir = pluginDir
      if (!fs.existsSync(this.pluginDir)) fs.mkdirSync(this.pluginDir)
      this.socket.emit('plugins', { id, data: null })
    })

    this.socket.on('plugins:verifyDefault', ({ id, installDir }) => {
      if (fs.existsSync(installDir)) {
        this.pluginQueue.kill()
        _.forEach(fs.readdirSync(installDir), zip => this.pluginQueue.push({ installPath: path.join(installDir, zip), operation: 'install' }))
        this.pluginQueue.drain = () => this.socket.emit('plugins', { id, data: null })
      } else
        this.socket.emit('plugins', { id, data: null })
    })

    this.socket.on('plugins:get', ({ id, appVersion }) => {
      const plugins = fs.readdirSync(this.pluginDir)
      if (plugins.length > 0) {
        this.pluginQueue.kill()
        _.forEach(plugins.filter(file => fs.statSync(path.join(this.pluginDir, file)).isDirectory()), plugin => this.pluginQueue.push({ pluginPath: path.join(this.pluginDir, plugin), operation: 'query' }))
        this.pluginQueue.drain = () => this.socket.emit('plugins', { id, plugins: this.plugins })
      } else
        this.socket.emit('plugins', { id, plugins: this.plugins })
    })

    this.socket.on('plugins:install', ({ id, installPath }) => {
      this.pluginQueue.kill()
      this.pluginQueue.push({ installPath, operation: 'install' })
      this.pluginQueue.drain = () => this.socket.emit('plugins', { id, plugins: this.plugins })
    })

    this.socket.on('plugins:remove', ({ id, pluginID }) => {
      const plugin = this.plugins[pluginID]
      this.log(plugin)
    })
  }
}

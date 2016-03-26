workers.plugins = class pluginsWorker {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => {
            this.log('Socket Connected!', 'info')
            this.socket.emit('initiated')
        })
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.plugins = {}
        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Plugins Worker',
        type,
        message
    });

    npmQueue = async.queue((pluginPath, next) => {

        const pluginPackage = require(path.join(pluginPath, 'package.json'))
        const { dependencies, name } = pluginPackage

        this.plugins[name] = {
            package: pluginPackage,
            path: pluginPath
        }
        next()
    });

    initEvents() {
        this.socket.on('plugins:verifyDefault', ({ id, installDir, pluginDir }) => {
            _.forEach(fs.readdirSync(installDir), zip => {
                const pluginInstallPath = path.join(pluginDir, path.parse(zip).name)
                if (!fs.existsSync(pluginInstallPath)) new admZip(path.join(installDir, zip)).extractAllTo(pluginInstallPath, true)
            })
            this.socket.emit('plugins', { id, data: null })
        })

        this.socket.on('plugins:get', ({ id, pluginDir, appVersion }) => {
            _.forEach(fs.readdirSync(pluginDir).filter(file => fs.statSync(path.join(pluginDir, file)).isDirectory()), plugin => this.npmQueue.push(path.join(pluginDir, plugin)))
            this.npmQueue.drain = () => this.socket.emit('plugins', { id, plugins: this.plugins })
        })
        this.socket.on('plugin:install', ({ id, plugin }) => {
            this.log(plugin)
        })
    }
}

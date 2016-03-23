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
        if (fs.existsSync(path.join(pluginPath, 'node_modules'))) {
            const plugin = require(pluginPath)
            this.log(plugin)
            return next()
        }


        const { dependencies, name } = require(path.join(pluginPath, 'package.json'))
        let depArray = []
        _.forEach(dependencies, (version, dep) => depArray.push(`${dep}@${version}`))
        npm.load({}, (err) => {
            if (err) {
                this.log(err, 'error')
                return next()
            }
            npm.commands.install(pluginPath, depArray, (er, data) => {
                if (err) this.log(err, 'error')
                this.log(`Compleated dependencies install for ${name}`)

                const plugin = require(pluginPath)
                this.log(plugin)
                next()
            })
        })
    });

    initEvents() {
        this.socket.on('plugins:get', ({ id, pluginDir, appVersion }) => {
            const plugins = fs.readdirSync(pluginDir).filter(file => fs.statSync(path.join(pluginDir, file)).isDirectory())

            _.forEach(plugins, plugin => {
                this.npmQueue.push(path.join(pluginDir, plugin))
            })

            this.npmQueue.drain = () => this.log(this.plugins)
        })
        this.socket.on('plugin:install', ({ id, plugin }) => {
            this.log(plugin)
        })
    }

}

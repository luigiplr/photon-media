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
        if (fs.existsSync(path.join(pluginPath, 'node_modules'))) { // Check if npm install has already been run, if it has we dont need todo it again
            const plugin = require(pluginPath)
            const { pluginData, name } = require(path.join(pluginPath, 'package.json'))
            this.plugins[name] = {
                ...pluginData,
                path: pluginPath
            }
            return next()
        }

        const { dependencies, name, pluginData } = require(path.join(pluginPath, 'package.json'))
        let depArray = []

        _.forEach(dependencies, (version, dep) => depArray.push(`${dep}@${version}`)) //parse every production dep in the plugin and push to our npm install array

        npm.load({}, (err) => {
            if (err) {
                this.log(err, 'error')
                return next()
            }
            npm.commands.install(pluginPath, depArray, (er, data) => {
                if (err) this.log(err, 'error')
                this.log(`Compleated dependencies install for ${name}`)

                const plugin = require(pluginPath)
                this.plugins[name] = {
                    ...pluginData,
                    path: pluginPath
                }
                next()
            })
        })
    });

    initEvents() {
        this.socket.on('plugins:get', ({ id, pluginDir, appVersion }) => {
            _.forEach(fs.readdirSync(pluginDir).filter(file => fs.statSync(path.join(pluginDir, file)).isDirectory()), plugin => this.npmQueue.push(path.join(pluginDir, plugin)))
            this.npmQueue.drain = () => this.socket.emit('plugins', { id, plugins: this.plugins })
        })
        this.socket.on('plugin:install', ({ id, plugin }) => {
            this.log(plugin)
        })
    }
}
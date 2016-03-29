class Plugins extends EventEmitter {
    constructor(workers) {
        super()
        this.workers = workers

        this.plugins = {}
        this.appVersion = remote.app.getVersion()
        this.pluginDir = path.join(remote.app.getPath('appData'), remote.app.getName(), 'plugins')

        if (!fs.existsSync(this.pluginDir)) fs.mkdirSync(this.pluginDir)

        this.sockets = this.workers.socket.sockets
        this.verifyDefaultPlugins()
            .then(::this.checkInstalled)
    }

    checkInstalled() {
        const id = uuid()
        console.info(`Plugins initializing from "${this.pluginDir}"`)
        this.sockets.emit('plugins:get', { pluginDir: this.pluginDir, appVersion: this.appVersion, id })
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

    install(zip) {
        console.info(`Installing: ${zip}`)
        const installerRequest = uuid()

        return installerRequest
    }

    remove(pluginID) {
        console.info(`Removing Plugin: ${pluginID}`)
        const removalRequest = uuid()

        this.sockets.emit('plugins:remove', { id: removalRequest, pluginID })
        this.workers.once(removalRequest, () => this.emit(`${pluginID}:removed`))
    }
}

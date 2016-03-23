class Plugins extends EventEmitter {
    constructor(workers) {
        super()
        this.workers = workers

        this._installed = {}
        this.appVersion = remote.app.getVersion()
        this.pluginDir = path.join(remote.app.getPath('appData'), remote.app.getName(), 'plugins')

        if (!fs.existsSync(this.pluginDir)) fs.mkdirSync(this.pluginDir)

        this.workers.once('workers:initiated', () => {
            this.sockets = this.workers.socket.sockets
            this.checkInstalled()
        })
    }

    checkInstalled() {
        const id = uuid()
        console.info(`Plugins initializing from "${this.pluginDir}"`)
        this.sockets.emit('plugins:get', { pluginDir: this.pluginDir, appVersion: this.appVersion, id })
    }

    install(zip) {
        console.info(`Installing: ${zip}`)
        const installerRequest = uuid()

        return installerRequest
    }

    remove(id) {
        console.info(`Removing Plugin: ${id}`)
        const removalRequest = uuid()

        return removalRequest
    }
}

class Plugins extends EventEmitter {
    constructor(workers) {
        super()
        this.workers = workers

        this._installed = {}

        this.workers.once('workers:initiated', () => {
            console.info('Plugins Initializing')
            this.sockets = this.workers.socket.sockets
            this.checkInstalled()
        })
    }

    checkInstalled() {
        console.log(this.sockets)
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

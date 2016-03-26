class urlParser extends EventEmitter {
    constructor(workers, plugins, inputURL) {
        super()

        this.url = inputURL
        this.MATCHING_TIMEOUT = 10000
        this.workers = workers
        this.plugins = plugins

        this.checkEngines()
    }

    checkEngines() {
        const engines = _.filter(this.plugins.plugins, plugin => plugin.package.pluginData.roles.includes('engine'))
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise(resolve => {
            sockets.emit('engines:parse', { id, engines, url: this.url })
            this.workers.once(id, engine => {
                console.log(engine)
                this.workers.removeAllListeners(`${id}:error`)
            })
            this.workers.once(`${id}:error`, error => {
                console.log(error)
                this.workers.removeAllListeners(id)
            })
        })
    }
}

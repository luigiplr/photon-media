class urlParser extends EventEmitter {
    constructor({ id, workers, plugins, url }) {
        super()

        this.MATCHING_TIMEOUT = 10000
        this.workers = workers
        this.plugins = plugins

        this.checkEngines(id, url)
    }

    checkEngines(id, url) {
        const engines = _.filter(this.plugins.plugins, plugin => plugin.package.pluginData.roles.includes('engine'))
        const { sockets } = this.workers.socket

        sockets.emit('engines:parse', { id, engines, url })
        this.workers.once(id, engine => {
            console.log('whoa')
            this.emit(id, engine)
            this.workers.removeAllListeners(`${id}:error`)
        })
        this.workers.once(`${id}:error`, error => {
            this.emit(`${id}:error`, error)
            this.workers.removeAllListeners(id)
        })

    }
}

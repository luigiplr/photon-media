workers.engines = class {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => {
            this.log('Socket Connected!', 'info')
            this.socket.emit('initiated')
        })
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Engine Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('engines:parse', ({ id, engines, url }) => this.parseURL(engines, url)
            .then(data => this.socket.emit('engines', { id, data }))
            .catch(() => this.socket.emit('engines:error', { id, error: 'No Engine Found' })))
    }

    parseURL(engines, url) {
        return new Promise((resolve, reject) => {
            let foundEngine = false
            _.forEach(engines, engine => {
                let engineModule = require(engine.path)
                engineModule = new engineModule({ url })

                engineModule.once('incompatible', () => engineModule.removeAllListeners('parsed'))
                engineModule.once('parsed', data => {
                    engineModule.removeAllListeners('incompatible')
                    foundEngine = true
                    this.log(data)
                    resolve(data)
                })
            })
            _.delay(() => {
                if (!foundEngine) reject()
            }, 5000)
        })
    }
}

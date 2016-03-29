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
        this.socket.on('engines:parse', ({ id, engines, type, value }) => this.parseURL(engines, type, value)
            .then(data => this.socket.emit('engines', { id, data }))
            .catch(() => this.socket.emit('engines:error', { id, error: 'No Engine Found' })))
    }

    parseURL(engines, type, value) {
        return new Promise((resolve, reject) => Promise.all([engines.map(::this.spawnEngine)]).then(compatible => {






        }))
    }


    spawnEngine(engine) {
        return new Promise(resolve => {
            let engineModule = require(engine.path)
            const timeoutTimer = 
            engineModule = new engineModule({ url })

            engineModule.once('incompatible', () => {
                engineModule.removeAllListeners('parsed')
                resolve(false)
            })
            engineModule.once('compatible', data => {
                engineModule.removeAllListeners('incompatible')
                foundEngine = true
                resolve(data)
            })

            _.delay(() => {
                if (!foundEngine) reject()
            }, 5000)
        })
    }
}

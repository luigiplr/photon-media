workers.npm = class npmWorker {
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
        source: 'NPM Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('npm:install', ({ id, pluginPath }) => {
            this.log(pluginPath)
        })
    }
}

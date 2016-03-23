workers.plugins = class pluginsWorker {
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
        source: 'Plugins Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('plugins:get', ({ id, pluginDir, appVersion }) => {
            this.log({ id, pluginDir, appVersion })
        })
        this.socket.on('plugin:install', ({ id, plugin }) => {
            this.log(plugin)
        })
    }
}

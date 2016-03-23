workers.players = class players {
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
        source: 'Player Discovery Worker',
        type,
        message
    });

    initEvents() {

        this.socket.on('players:get', ({ id }) => {

        })

    }
}
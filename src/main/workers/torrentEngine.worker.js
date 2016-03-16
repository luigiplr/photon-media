import socketClient from 'socket.io-client'

self.onmessage = ({ data }) => new torrentEngine(data) // init socket connection when we get the message (port)

class torrentEngine {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => this.log('Socket Connected!'))
        this.socket.on('disconnect', () => this.log('Socket Disconnected!'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Torrent Engine Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('torrentEngine:stats', ({ type, data }) => {

        })
    }
}

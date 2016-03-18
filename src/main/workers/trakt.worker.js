import socketClient from 'socket.io-client'
import request from 'request'

self.onmessage = ({ data }) => new trakt(data) // init socket connection when we get the message (port)

class trakt {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => this.log('Socket Connected!'))
        this.socket.on('disconnect', () => this.log('Socket Disconnected!'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Trakt Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('trakt:fetch', ({ type, data }) => {

        })

        this.socket.on('trakt:authed', ({ traktToken, traktTokenRefresh, traktTokenTTL }) => {

        })
    }
}

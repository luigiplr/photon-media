import socketClient from 'socket.io-client'
import request from 'request'
import traktAPI from 'trakt-api'

self.onmessage = ({ data }) => new trakt(data) // init socket connection when we get the message (port)

class trakt {
    constructor(port) {
        this.trakt = traktAPI('021d98ace731891d1d77ae3ae380c84f8cfe17b0f1960de5148535ab049d20a7')
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

        this.socket.on('trakt:search', ({ id, params }) => this.trakt.search(...params, results => this.socket.emit(`trakt:search:response`, { id, results })))

        this.socket.on('trakt:fetch', ({ type, data }) => {

        })

        this.socket.on('trakt:authed', ({ traktToken, traktTokenRefresh, traktTokenTTL }) => {

        })
    }
}

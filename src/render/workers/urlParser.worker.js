import socketClient from 'socket.io-client'
import _ from 'lodash'


self.onmessage = ({ data }) => new urlParser(data) // init socket connection when we get the message (port)


class urlParser {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => this.log('Socket Connected!', 'info'))
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'URLParser Worker',
        type,
        message
    });

    initEvents() {

    }
}
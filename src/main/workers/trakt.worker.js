import socketClient from 'socket.io-client'

console.log = () => self.postMessage({
    type: 'log',
    message: arguments
})

self.onmessage = ({ data }) => new trakt(data) // init socket connection when we get the message


class trakt {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => self.postMessage({
            type: 'info',
            message: 'Socket connected!'
        }))
        this.socket.on('disconnect', () => self.postMessage({
            type: 'info',
            message: 'Socket disconnected!'
        }))

        this.initEvents()
    }

    initEvents() {
        this.socket.on('trakt:fetch', ({ type, data }) => {

        })
    }
}

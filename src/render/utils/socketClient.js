import { ipcRenderer } from 'electron'
import { EventEmitter } from 'events'
import socketClient from 'socket.io-client'


class photonSocketClient extends EventEmitter {
    constructor() {
        super()

        if (!process.env.WORKERS_PORT) {
            console.info('Workers Port not detected, waiting for main thread event')
            ipcRenderer.on('workers:port', port => this.initSockets(port))
        } else {
            console.info('Workers Port detected, connecting to sockets immediately')
            this.initSockets(process.env.WORKERS_PORT)
        }

    }

    initSockets(port) {
        this.socketPort = port
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => console.info('Connected to main sockets'))
        this.socket.on('disconnect', () => {
            console.info('Main sockets disconnected!')
            this.emit('disconnected')
        })
    }
}


export default new photonSocketClient()

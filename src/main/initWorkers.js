import getPort from 'get-port'
import socketIO from 'socket.io'
import path from 'path'
import Worker from 'workerjs'



export default class initWorkers {
    constructor() {
        getPort().then(port => {
            this.port = port
            this.initSocketServer()
            this.trakt()
        })
    }

    initSocketServer() {
        this.socketServer = socketIO()
        this.socketServer.on('connection', socket => {
           // console.log(socket)
        })
        this.socketServer.listen(this.port)
    }

    trakt() {
        this.traktWorker = new Worker(path.join(__dirname, 'workers', 'trakt.worker.js'), true)
        this.traktWorker.postMessage(this.port)
        this.traktWorker.onmessage = ({ data }) => {
            const { type, message } = data

            switch (type) {
                case 'info':
                case 'log':
                    console.log('Trakt Worker log:', message)
                    break
                case 'error':
                    console.error('Trakt Worker error:', message)
                    break
            }
        }
    }
}

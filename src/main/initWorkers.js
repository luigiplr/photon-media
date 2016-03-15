import getPort from 'get-port'
import express from 'express'
import { createServer } from 'http'
import socketIO from 'socket.io'
import path from 'path'
import Worker from 'workerjs'



export default class initWorkers {
    constructor() {
        getPort()
            .then(port => this.port = port)
            .then(() => this.initSocketServer())
            .then(() => this.initSocketEvents())
            .then(() => {
                this.trakt()
            })
            .catch(console.error)
    }

    initSocketServer() {
        return new Promise((resolve, reject) => {
            this.express = express()
            this.http = createServer(this.expressServer)
            this.socket = socketIO(this.http)
            console.log(`Socket Server running @ port ${this.port}`)
            this.http.listen(this.port, resolve)
        })
    }

    initSocketEvents() {
        this.socket.on('connection', socket => {
            socket.on('info', ({ type, source, message }) => console[type](`${source}:`, message))
        })
    }

    trakt() {
        this.traktWorker = new Worker(path.join(__dirname, 'workers', 'trakt.worker.js'), true)
        this.traktWorker.postMessage(this.port)
    }
}

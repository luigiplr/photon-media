import getPort from 'get-port'
import express from 'express'
import { createServer } from 'http'
import socketIO from 'socket.io'
import path from 'path'
import Worker from 'workerjs'


class initWorkers {
    constructor(webContents) {
        getPort()
            .then(port => this.port = port)
            .then(() => this.initSocketServer())
            .then(() => this.initSocketEvents())
            .then(() => {
                this.trakt()
                this.torrentEngine()
            })
            .then(() => {
                process.env.WORKERS_PORT = this.port
                webContents.send('workers:port', this.port)
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

    torrentEngine() {
        this.torrentEngineWorker = new Worker(path.join(__dirname, 'workers', 'torrentEngine.worker.js'), true)
        this.torrentEngineWorker.postMessage(this.port)
    }

    trakt() {
        this.traktWorker = new Worker(path.join(__dirname, 'workers', 'trakt.worker.js'), true)
        this.traktWorker.postMessage(this.port)
    }
}

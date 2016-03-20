import getPort from 'get-port'
import express from 'express'
import { EventEmitter } from 'events'
import { createServer } from 'http'
import socketIO from 'socket.io'
import path from 'path'
import Worker from 'workerjs'

export default class initWorkers extends EventEmitter {
    constructor() {
        super()

        this.initiated = false

        getPort()
            .then(port => this.port = port)
            .then(() => this.initSocketServer())
            .then(() => {
                const workerDir = path.join(__dirname, '../', 'workers')
                this.workers = [
                    new Worker(path.join(workerDir, 'torrentEngine.worker.js'), true).postMessage(this.port),
                    new Worker(path.join(workerDir, 'trakt.worker.js'), true).postMessage(this.port),
                    new Worker(path.join(workerDir, 'color.worker.js'), true).postMessage(this.port),
                    new Worker(path.join(workerDir, 'urlParser.worker.js'), true).postMessage(this.port)
                ]
            })
            .then(() => this.initSocketEvents())
            .catch(console.error)
    }

    initSocketServer() {
        return new Promise((resolve, reject) => {
            const httpServer = createServer(express())
            this.socket = socketIO(httpServer)
            console.info(`Socket Server running @ port ${this.port}`)
            httpServer.listen(this.port, resolve)
        })
    }

    initSocketEvents() {
        let loggedWorkers = 0
        this.socket.on('connection', socket => {
            loggedWorkers++
            if (loggedWorkers === this.workers.length) {
                this.initiated = true
                this.emit('workers:initiated')
            }

            socket.on('urlParser', ({ id, data }) => this.emit(id, data))
            socket.on('trakt', ({ id, data }) => this.emit(id, data))
            socket.on('color', ({ id, palette }) => this.emit(id, palette))
            socket.on('info', ({ type, source, message }) => console[type](`${source}:`, message))
        })
    }
}
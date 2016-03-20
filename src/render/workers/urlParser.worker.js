import socketClient from 'socket.io-client'
import http from 'http'
import _ from 'lodash'
import readTorrent from 'read-torrent'


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
        this.socket.on('urlParser:get', ({ id, url }) => {
            this.getType(url).then(type => {
                switch (type) {
                    case 'torrent':
                    case 'magnet':
                        readTorrent(url, (err, parsed) => this.socket.emit('urlParser', { id, data: { type: 'torrent', parsed } }))
                        break
                    case 'http':

                        break
                }
            })

            //   this.socket.emit('urlParser', { id, url })
        })
    }

    getType(url) {
        return new Promise(resolve => {
            if (url.includes('magnet:'))
                return resolve('magnet')

            return getRemoteType(url)
        })
    }

    getRemoteType(url) {
        return new Promise(resolve => http.get(url, res => {
            this.log(JSON.stringify(res.headers))
            res.once('data', chunk => res.destroy())
        }))
    }
}
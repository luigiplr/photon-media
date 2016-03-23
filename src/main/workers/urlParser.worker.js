workers.urlParser = class {
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

            if (url.includes('youtube.com') || url.includes('youtu.be'))
                return resolve('youtube')

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
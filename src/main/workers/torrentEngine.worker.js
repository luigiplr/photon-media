workers.torrentEngine = class {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => this.log('Socket Connected!', 'info'))
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Torrent Engine Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('torrentEngine:stats', ({ infohash, target = 'all' }) => {

        })

        this.socket.on('torrentEngine:add', infohash => webtorrentInstance.add(infohash, (torrent) => {
            this.log(`Client is downloading: ${torrent.infoHash}`)

        }))

        this.socket.on('torrentEngine:remove', infohash => {

        })
    }
}
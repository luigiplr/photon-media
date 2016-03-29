workers.players = class players {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => {
            this.log('Socket Connected!', 'info')
            this.socket.emit('initiated')
        })
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.initEvents()
        this.definePaths()
    }

    scanQueue = async.queue((player, next) => {
        _.forEach(this.searchPaths, systemPath => _.forEach(player.paths, playerPath => _.forEach(player.execs, exec => {
            let checkPath = path.join(systemPath, playerPath, exec)
            try {
                fs.accessSync(checkPath, fs.F_OK)
                player.path = checkPath
                delete player.paths
                delete player.execs
                this.foundPlayers[player.id] = player
            } catch (e) {}
        })))
        next()
    });

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Player Discovery Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('players:get', ({ id }) => this.scan().then(players => this.socket.emit('players', { id, players })))
    }

    scan() {
        this.foundPlayers = {}
        return new Promise(resolve => {
            _.forEach(this.playerDefinitions(), player => this.scanQueue.push(player))
            this.scanQueue.drain = () => resolve(this.foundPlayers)
        })
    }

    definePaths() {
        switch (process.platform) {
            case 'win32':
                this.searchPaths = [
                    process.env['ProgramFiles(x86)'],
                    process.env.ProgramFiles
                ]
                break
            default:
                this.searchPaths = []
        }
    }

    playerDefinitions() {
        return [{
            name: 'VLC',
            id: 'vlc',
            subswitch: '--sub-file=',
            paths: ['VideoLAN/VLC'],
            execs: ['vlc.exe'],
            srcIcon: 'images/players/vlc-player-icon.png'
        }, {
            name: 'Powder Player',
            id: 'powder',
            subswitch: '--sub-file=',
            paths: ['Powder Player'],
            execs: ['powder.exe'],
            srcIcon: 'images/players/powder-player-icon.png'
        }, {
            name: 'Windows Media Player',
            id: 'wmplayer',
            subswitch: null,
            paths: ['Windows Media Player'],
            execs: ['wmplayer.exe'],
            icon: null
        }]
    }
}

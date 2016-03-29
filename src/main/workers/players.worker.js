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

    log = (message, type = 'log', source = 'Player Discovery Worker') => this.socket.emit('info', { source, type, message });

    initEvents() {
        this.socket.on('players:get', ({ id }) => this.scan().then(players => this.socket.emit('players', { id, players })))

        this.socket.on('players:play', ({ id, playerID, url, subs }) => {
            this.startPlayer({ playerID, url, subs })
        })
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

    startPlayer({ playerID, url, subs }) {
        return new Promise((resolve, reject) => {
            try {
                const player = this.foundPlayers[playerID]
                const playerArgs = []

                if (player.urlswitch && url) playerArgs.push(urlswitch + url)
                else if (url) playerArgs.push(url)

                if (player.subswitch && subs) playerArgs.push(player.subswitch + subs)
                else if (subs) playerArgs.push(subs)

                const spawnedPlayer = child_process.spawn(player.path, playerArgs)

                spawnedPlayer.stdout.on('data', data => {
                    if (data) this.log(`[${player.name}] stdout: ${data.toString()}`, 'info', 'Player Worker')
                })

                spawnedPlayer.stderr.on('data', data => {
                    if (data) this.log(`[${player.name}] stderr: ${data.toString()}`, 'info', 'Player Worker')
                })

                spawnedPlayer.on('close', code => this.log(`[${player.name}] exited with: code ${code}`, 'info', 'Player Worker'))

                resolve()
            } catch (e) {
                reject()
            }
        })
    }

    playerDefinitions() {
        return [{
            name: 'VLC',
            id: 'vlc',
            urlswitch: null,
            subswitch: '--sub-file=',
            paths: ['VideoLAN/VLC'],
            execs: ['vlc.exe'],
            srcIcon: 'images/players/vlc-player-icon.png',
            cast: false
        }, {
            name: 'Powder Player',
            id: 'powder',
            urlswitch: null,
            subswitch: '--sub-file=',
            paths: ['Powder Player'],
            execs: ['powder.exe'],
            srcIcon: 'images/players/powder-player-icon.png',
            cast: false
        }, {
            name: 'Windows Media Player',
            id: 'wmplayer',
            subswitch: null,
            urlswitch: null,
            paths: ['Windows Media Player'],
            execs: ['wmplayer.exe'],
            srcIcon: 'images/players/windows-media-player-icon.png',
            cast: false
        }]
    }
}

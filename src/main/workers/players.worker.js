workers.players = class players {
  constructor(port) {
    this.socket = socketClient(`http://127.0.0.1:${port}`)

    this.socket.on('connect', () => {
      this.log('Socket Connected!', 'info')
      this.socket.emit('initiated')
    })
    this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

    this.definePaths()
    this.initEvents()
  }

  foundPlayers = {};

  playerScanQueue = async.queue(({ player, caster }, next) => {
    if (player) {
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
    } else if (caster) {
      next()
    }
  })

  log = (message, type = 'log', source = 'Player Discovery Worker') => this.socket.emit('info', { source, type, message })

  initEvents() {
    this.socket.on('players:get', ({ id }) => this.scanPlayers()
      .then(players => this.socket.emit('players', { id, players })))

    this.socket.on('players:play', ({ id, playerID, castID, url, subs }) => {
      if (playerID) this.startPlayer({ playerID, url, subs }).then(() => this.socket.emit('players', { id, data: 'playing' })).catch(() => this.socket.emit('players', { id, data: 'error' }))

      //else if (castID)
      //la-la-ka
    })
  }

  scanPlayers = () => new Promise(resolve => {
    this.playerScanQueue.kill()
    _.forEach(this.playerDefinitions, player => this.playerScanQueue.push({ player }))
    this.playerScanQueue.drain = () => resolve(this.foundPlayers)
  })

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

  startPlayer = ({ playerID, url, subs }) => new Promise((resolve, reject) => {
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

  castingDefinitions = [{
    name: 'Chromecast',
    id: 'chromecast',
    srcIcon: 'images/players/vlc-player-icon.png'
  }]

  playerDefinitions = [{
    name: 'VLC',
    id: 'vlc',
    urlswitch: null,
    subswitch: '--sub-file=',
    paths: ['VideoLAN/VLC'],
    execs: ['vlc.exe'],
    srcIcon: 'images/players/vlc-player-icon.png'
  }, {
    name: 'Powder Player',
    id: 'powder',
    urlswitch: null,
    subswitch: '--sub-file=',
    paths: ['Powder Player'],
    execs: ['powder.exe'],
    srcIcon: 'images/players/powder-player-icon.png'
  }, {
    name: 'Windows Media Player',
    id: 'wmplayer',
    subswitch: null,
    urlswitch: null,
    paths: ['Windows Media Player'],
    execs: ['wmplayer.exe'],
    srcIcon: 'images/players/windows-media-player-icon.png'
  }]
}

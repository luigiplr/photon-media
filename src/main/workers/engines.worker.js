workers.engines = class engineWorker {
  constructor(port) {
    this.socket = socketClient(`http://localhost:${port}`)

    this.socket.on('connect', () => {
      this.log('Socket Connected!', 'info')
      this.socket.emit('initiated')
    })
    this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

    this.initEvents()
  }

  log = (message, type = 'log') => this.socket.emit('info', {
    source: 'Engine Worker',
    type,
    message
  })

  initEvents() {
    this.socket.on('engines:parse', ({ id, engines, type, value }) => Promise.all(engines.map(engine => this.spawnEngine(engine, type, value)))
      .then(compatible => this.socket.emit('engines', { id, data: compatible.filter(engine => engine !== false) })))
  }

  spawnEngine = (engine, type, value) => new Promise(resolve => {
    let engineModule = require(engine.path)
    const timeoutTimer = setTimeout(() => resolve(false), 30000)
    engineModule = new engineModule({ type, value })

    engineModule.once('incompatible', () => {
      engineModule.removeAllListeners('parsed')
      clearTimeout(timeoutTimer)
      resolve(false)
    })
    engineModule.once('compatible', data => {
      engineModule.removeAllListeners('incompatible')
      clearTimeout(timeoutTimer)
      resolve(data)
    })
  })
}

class urlParser extends EventEmitter {
  constructor({ id, workers, plugins, url }) {
    super()

    this.workers = workers
    this.plugins = plugins

    this.checkEngines(id, this.parseType(url))
  }

  parseType(value) {
    let type = 'string'
    try {
      if (fs.existsSync(path.normalize(value))) type = 'localpath'
    } catch (e) {}
    if (type === 'string' && isUri(value)) type = 'url'
    return { type, value }
  }

  checkEngines(id, { type, value }) {
    const engines = _.filter(this.plugins.plugins, plugin => plugin.package.pluginData.roles.includes('engine'))
    const { sockets } = this.workers.socket

    sockets.emit('engines:parse', { id, engines, type, value })
    this.workers.once(id, compatibleEngines => this.emit(id, compatibleEngines))
  }
}

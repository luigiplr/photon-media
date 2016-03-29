class Settings extends EventEmitter {
    constructor(localforageInstance) {
        super()

        this._localforage = localforageInstance

        _.forEach(this._defaultSettings(), (defaultValue, setting) => this._settingsLoader.push({ setting, defaultValue }))

        this._settingsLoader.drain = () => {
            console.info('Settings initialized successfully')
            this.emit('initiated')
        }
    }

    _settingsLoader = async.queue(({ setting, defaultValue }, next) => this._localforage.getItem(setting)
        .then(loadedSetting => this[setting] = loadedSetting ? loadedSetting : defaultValue)
        .then(next)
        .catch(err => {
            console.error(err)
            this[setting] = defaultValue
            next()
        }));

    setSetting(setting, value) {
        this[setting] = value
        return this._localforage.setItem(setting, value)
    }

    _defaultSettings() {
        return {
            /* Backdrop */
            cycleBackdrop: true,
            'last-search-backdrop': null,

            /* Detail */
            dontDisplayPirateWarning: false,
            adaptiveColorization: true
        }
    }
}

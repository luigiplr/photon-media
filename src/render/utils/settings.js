class Settings extends EventEmitter {
    constructor(localforageInstance) {
        this.localforage = localforageInstance


    }


    _defaultSettings() {
        return {
            cycleBackdrop: true,


        }
    }

}

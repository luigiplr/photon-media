import getPort from 'get-port'
import Worker from 'workerjs'



export default class initWorkers {
    constructor() {
        getPort().then(port => {
            this.port = port
            
            console.log(this.port)
            this.trakt()
        })
    }

    trakt() {
        this.traktWorker = new Worker('./workers/trakt.worker.js')
        this.traktWorker.postMessage(this.port)
    }
}

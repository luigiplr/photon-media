import getPort from 'get-port'
import path from 'path'
import Worker from 'workerjs'



export default class initWorkers {
    constructor() {
        getPort().then(port => {
            this.port = port
            console.log(port)
            this.trakt()
        })
    }

    trakt() {
        console.log('that thing!')
        const traktWorkerPath = path.join(__dirname, 'workers', 'trakt.worker.js')
        console.log(traktWorkerPath)
        this.traktWorker = new Worker(traktWorkerPath)
        console.log(this.traktWorker)
        this.traktWorker.postMessage(this.port)
    }
}

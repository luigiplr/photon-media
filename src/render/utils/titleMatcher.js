import { EventEmitter } from 'events'
import { v4 as uuid } from 'node-uuid'


export default class matchTitle extends EventEmitter {
    constructor(workers, name) {
        super()
        this.workers = workers

        this.formatTitle(name)
            .then(({ title, season, episode }) => {
                Promise.race([this.searchEpisode(title, season, episode), this.searchMovie(title)])
                    .then(outcome => {
                        console.log(outcome)
                    })

                /*
                                if (type === 'movie')
                                    return this.searchMovie(title).then(movie => {
                                        return {...movie, type: 'movie' }
                                    })
                                else
                                    return this.searchShow(title).then(show => {
                                        return {...show, type: 'show', season, episode }
                                    })
                                    */
            })
            .then(data => this.emit('success', data))
            .catch(error => this.emit('error', error))
    }

    formatTitle(title) {
        return new Promise((resolve, reject) => {

            let formatted = {}

            // regex match
            let se_re = title.match(/(.*)S(\d\d)E(\d\d)/i); // regex try (ex: title.s01e01)
            if (se_re !== null) {
                formatted.episode = se_re[3]
                formatted.season = se_re[2]
                formatted.title = se_re[1]
            } else {
                se_re = title.match(/(.*)(\d\d\d\d)+\W/i); // try another regex (ex: title.0101)
                if (se_re !== null) {
                    formatted.episode = se_re[2].substr(2, 4)
                    formatted.season = se_re[2].substr(0, 2)
                    formatted.title = se_re[1]
                } else {
                    se_re = title.match(/(.*)(\d\d\d)+\W/i); // try yet another (ex: title.101)
                    if (se_re !== null) {
                        formatted.episode = se_re[2].substr(1, 2)
                        formatted.season = se_re[2].substr(0, 1)
                        formatted.title = se_re[1]
                    } else {
                        se_re = title.replace(/\[|\]|\(|\)/, '').match(/.*?0*(\d+)?[xE]0*(\d+)/i) // try a last one (ex: 101, or 1x01)
                        if (se_re !== null) {
                            formatted.episode = se_re[2]
                            formatted.season = se_re[1]
                            formatted.title = se_re[0].replace(/0*(\d+)?[xE]0*(\d+)/i, '')
                        } else {
                            // nothing worked :(
                        }
                    }
                }
            }

            // format
            formatted.title = formatted.title || title.replace(/\..+$/, '') // remove extension;
            formatted.title = formatted.title.replace(/[\.]/g, ' ').trim()
                .replace(/^\[.*\]/, '') // starts with brackets
                .replace(/[^\w ]+/g, '') // remove brackets
                .replace(/ +/g, '-') // has multiple spaces
                .replace(/_/g, '-') // has '_'
                .replace(/\-$/, '') // ends with '-'
                .replace(/\s.$/, '') // ends with ' '
                .replace(/^\./, '') // starts with '.'
                .replace(/^\-/, '') // starts with '-'

            // just in case
            if (!formatted.title || formatted.title.length === 0) {
                formatted.title = title
            }

            // return :)

            console.log(formatted)
            resolve(formatted)
        })
    }

    searchMovie(title) {
        const { sockets } = this.workers.socket
        const requestID = uuid()

        return new Promise((resolve, reject) => {
            console.log(title)
            sockets.emit('trakt:get:movie', { id, slug: title })
            this.workers.once(id, resolve)
        })
    }

    searchEpisode(title, season, episode) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise((resolve, reject) => {
            sockets.emit('trakt:get:episode', { id, slug: title, season, episode })
            this.workers.once(id, resolve)
            this.workers.once(`${id}:error`, reject)
        })
    }

    searchShow(title) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise((resolve, reject) => {
            sockets.emit('trakt:get:show', { id, slug: title })
            this.workers.once(id, resolve)
            this.workers.once(`${id}:error`, reject)
        })
    }

    searchQuality(title) {
        // 480p
        if (title.match(/480[pix]/i)) {
            return '480p'
        }
        // 720p
        if (title.match(/720[pix]/i) && !title.match(/dvdrip|dvd\Wrip/i)) {
            return '720p'
        }
        // 1080p
        if (title.match(/1080[pix]/i)) {
            return '1080p'
        }

        // not found, trying harder
        if (title.match(/DSR|DVDRIP|DVD\WRIP/i)) {
            return '480p'
        }
        if (title.match(/hdtv/i) && !title.match(/720[pix]/i)) {
            return '480p'
        }
        return false
    }

    checkTraktSearch(traktRes, filename) {
        return new Promise((resolve, reject) => {
            const traktObj = trakt.match(/[\w+\s+]+/ig)[0].split(' ')
            traktObj.forEach(word => {
                if (word.length >= 4) {
                    let regxp = new RegExp(word.slice(0, 3), 'ig')
                    if (filename.replace(/\W/ig, '').match(regxp) === null)
                        return reject(new Error('Trakt search result did not match the filename'))
                }
            })
            resolve(true)
        })
    }
}
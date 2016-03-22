import { EventEmitter } from 'events'
import { v4 as uuid } from 'node-uuid'
import _ from 'lodash'
import commonTitleMappings from './commonTitleMappings'


const MATCHING_TIMEOUT = 10000 // 10 seconds

const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

export default class matchTitle extends EventEmitter {
    constructor(workers, name) {
        super()
        this.workers = workers

        this.formatTitle(name)
            .then(::this.mapTitle)
            .then(({ title, season, episode }) => {
                console.info('Searching for data on:', title, `S${season}`, `E${episode}`)
                this.timeout = setTimeout(() => this.emit('error', `Timed out attempting to match "${title}"`), MATCHING_TIMEOUT)
                return new Promise(resolve => Promise.all([this.searchEpisode(title, season, episode), this.searchMovie(title, ((season && episode) ? (season + episode) : null))]).then(([showEpisode, movie]) => {
                    if (showEpisode) {
                        this.title = `${toTitleCase(title.replace(/-/g, ' '))} S${season}E${episode} - ${showEpisode.title}`
                        this.emit('status', `Fetching Data for "${this.title}"`)
                        this.getShow(title)
                            .then(show => resolve({...show, type: 'show', episode: showEpisode }))
                    } else if (movie) {
                        this.title = movie.title
                        this.emit('status', `Fetching Data for "${movie.title}"`)
                        this.getMovie(movie)
                            .then(movie => resolve({...movie, type: 'movie' }))
                    }
                }))
            })
            .then(data => {
                this.emit('status', `Extracting color palette for "${this.title}"`)
                return this.getColors(data)
            })
            .then(data => {
                clearTimeout(this.timeout)
                this.emit('success', {
                    ...data,
                    orginalTitle: name,
                    quality: this.searchQuality(name),
                    illegitimate: this.testIllegitimate(name)
                })
            })
            .catch(error => {
                clearTimeout(this.timeout)
                this.emit('error', 'Data Matching has run into a critical error!')
            })
    }

    getColors(data) {
        const { sockets } = this.workers.socket
        const id = uuid()
        return new Promise(resolve => {
            sockets.emit('color:get', { id, image: data.images.poster.full })
            this.workers.once(id, palette => {
                this.workers.removeAllListeners(`${id}:error`)
                resolve({
                    ...data,
                    palette
                })
            })
            this.workers.once(`${id}:error`, error => {
                this.workers.removeAllListeners(id)
                resolve({
                    ...data,
                    palette: undefined
                })
            })
        })
    }

    searchMovie(title) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise(resolve => {
            sockets.emit('trakt:get:search', { id, slug: title, type: 'movie' })
            this.workers.once(id, result => {
                this.workers.removeAllListeners(`${id}:error`)
                resolve((result && result.movie) ? result.movie : false)
            })
            this.workers.once(`${id}:error`, error => {
                this.workers.removeAllListeners(id)
                resolve(false)
            })
        })
    }

    searchEpisode(title, season, episode) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise(resolve => {
            sockets.emit('trakt:get:episode', { id, slug: title, season, episode })
            this.workers.once(id, episodeData => {
                this.workers.removeAllListeners(`${id}:error`)
                resolve(episodeData)
            })
            this.workers.once(`${id}:error`, error => {
                this.workers.removeAllListeners(id)
                resolve(false)
            })
        })
    }

    getMovie({ ids }) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise((resolve, reject) => {
            sockets.emit('trakt:get:movie', { id, ...ids })
            this.workers.once(id, movie => {
                this.workers.removeAllListeners(`${id}:error`)
                resolve(movie)
            })
            this.workers.once(`${id}:error`, error => {
                this.workers.removeAllListeners(id)
                reject(error)
            })
        })
    }

    getShow(slug) {
        const { sockets } = this.workers.socket
        const id = uuid()

        return new Promise((resolve, reject) => {
            sockets.emit('trakt:get:show', { id, slug })
            this.workers.once(id, show => {
                this.workers.removeAllListeners(`${id}:error`)
                resolve(show)
            })
            this.workers.once(`${id}:error`, error => {
                this.workers.removeAllListeners(id)
                reject(error)
            })
        })
    }

    mapTitle(data) {
        const { title } = data
        let match = false
        _.filter(commonTitleMappings, (matchs, mapped) => {
            if (matchs.indexOf(title) > -1) return match = mapped
            else return false
        })
        if (match) data.title = match
        return data
    }

    testIllegitimate(title) {
        const keywords = ['ettv', 'webrip', 'fum', 'skidrow', '3dm', 'tjet', 'batv', 'skgtv', 'stb', 'rartv', 'eztv', 'jyk', 'etrg']

        return new RegExp(keywords.join('|')).test(title.toLowerCase())
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
            resolve(formatted)
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
        return undefined
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
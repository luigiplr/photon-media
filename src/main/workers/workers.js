/* common imports */
import socketClient from 'socket.io-client'
import _ from 'lodash'

/* Worker imports */
import vibrant from 'node-vibrant'
import traktAPI from 'trakt-api'
import readTorrent from 'read-torrent'
import http from 'http'
import webtorrent from 'webtorrent'

const workers = {}

self.onmessage = ({ data }) => new workers[data.worker](data.port)
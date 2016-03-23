/* common imports */
import socketClient from 'socket.io-client'
import _ from 'lodash'
import async from 'async'
import path from 'path'
import fs from 'fs'

/* Worker imports */
import vibrant from 'node-vibrant'
import traktAPI from 'trakt-api'
import readTorrent from 'read-torrent'
import http from 'http'
import npm from 'npm'


const workers = {}

self.onmessage = ({ data }) => new workers[data.worker](data.port)
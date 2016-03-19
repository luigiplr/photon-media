import socketClient from 'socket.io-client'
import vibrant from 'node-vibrant'
import _ from 'lodash'


self.onmessage = ({ data }) => new color(data) // init socket connection when we get the message (port)


class color {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => this.log('Socket Connected!', 'info'))
        this.socket.on('disconnect', () => this.log('Socket Disconnected!', 'info'))

        this.initEvents()
    }

    log = (message, type = 'log') => this.socket.emit('info', {
        source: 'Color Worker',
        type,
        message
    });

    initEvents() {
        this.socket.on('color:get', ({ id, image }) => vibrant.from(image, {
            colorCount: 70,
            quality: 7
        }).getPalette((err, palette) => {
            _.forEach(palette, swatch => {
                swatch.hex = swatch.getHex()
                swatch.population = swatch.getPopulation()
                swatch.titleTextColor = swatch.getTitleTextColor()
            })
            this.socket.emit('color', { id, palette })
        }))
    }
}
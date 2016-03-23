workers.color = class {
    constructor(port) {
        this.socket = socketClient(`http://localhost:${port}`)

        this.socket.on('connect', () => {
            this.log('Socket Connected!', 'info')
            this.socket.emit('initiated')
        })
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
            colorCount: 100,
            quality: 10
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
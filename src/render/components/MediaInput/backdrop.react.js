class Backdrop extends Component {

  state = {
    trending: [],
    backdrop: { image: '' }
  };

  defaultDelay = 20000;
  initialDelay = 5000;

  static propTypes = {
    settingsStore: React.PropTypes.object.isRequired,
    workers: React.PropTypes.object.isRequired
  };

  componentWillUnmount() {
    this.mounted = false
    clearTimeout(this.backdropTimeout)
  }

  componentDidMount() {
    this.mounted = true
    const { settingsStore } = this.props

    if (!settingsStore.cycleBackdrop) return

    const lastItem = settingsStore['last-search-backdrop']

    let delay = 0
    if (lastItem) {
      delay = this.initialDelay
      this._loadBackdrop(lastItem).then(() => {
        if (!this.mounted) return
        this.setState({ backdrop: lastItem })
        if (lastItem.palette)
          this.props.setPalette(lastItem.palette)
      })
    }
    if (this.props.workers.initiated)
      this._getTrending(delay)
    else
      this.props.workers.once('workers:initiated', () => this._getTrending(delay))
  }

  _getTrending = (delay = 0) => {
    if (!this.mounted) return
    const { sockets } = this.props.workers.socket
    const requestID = uuid()
    sockets.emit('trakt:get:trending', { id: requestID, type: 'all' })
    this.props.workers.once(requestID, ({ movies, shows }) => {
      if (!this.mounted) return
      let trending = movies.concat(shows)

      if (this.state.backdrop.title)
        trending = _.filter(trending, ({ show, movie }) => !((show || movie).title === this.state.backdrop.title)) //Filter out current (cached) backdrop from list

      this.setState({ trending })
      this.backdropTimeout = setTimeout(this._getNewBackdrop, delay)
    })
  };

  _getNewBackdrop = () => {
    if (!this.mounted || this.state.trending.length === 0) return

    const { settingsStore } = this.props
    const { sockets } = this.props.workers.socket
    const requestID = uuid()

    const { trending } = this.state
    const trendingItem = trending[Math.floor(Math.random() * trending.length)]
    const itmeType = trendingItem.show ? 'show' : 'movie'

    sockets.emit(`trakt:get:${itmeType}`, { id: requestID, ...trendingItem[itmeType].ids })

    this.props.workers.once(requestID, ({ images, certification = 'Unrated', title, year, homepage }) => {
      const backdrop = {
        homepage,
        image: images.fanart.full,
        certification: certification.length > 0 ? certification : 'Unrated',
        title,
        year
      }
      Promise.all([this._loadBackdrop(backdrop), this._getColorPalette(backdrop)]).then(([foo, palette]) => {
        if (!this.mounted) return
        this.props.setPalette(palette)
        backdrop.palette = palette
        this.setState({
          trending: _.filter(trending, item => !_.isEqual(item, trendingItem)),
          backdrop
        })
        settingsStore.setSetting('last-search-backdrop', backdrop)
        this.backdropTimeout = setTimeout(this._getNewBackdrop, this.defaultDelay)
      })
    })
  };

  _getColorPalette = ({ image }) => {
    return new Promise((resolve, reject) => {
      const { sockets } = this.props.workers.socket
      const requestID = uuid()

      sockets.emit('color:get', { id: requestID, image })
      this.props.workers.once(requestID, palette => resolve(palette))
    })
  };

  _loadBackdrop = ({ image }, sockets) => {
    return new Promise(resolve => {
      let backdropImage = new Image()
      backdropImage.onload = () => {
        resolve(image)
        _.defer(() => backdropImage = null)
      }
      backdropImage.src = image
    })
  };

  _openBackDropURL = () => {
    if (!this.state.backdrop || !this.state.backdrop.homepage) return
    shell.openExternal(this.state.backdrop.homepage)
  };

  render() {
    return (
      <ReactCSSTransitionGroup className="transition-container" transitionName="cross-fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='transition-container' key={this.state.backdrop.image}>
          <div style={{ backgroundImage: `url(${this.state.backdrop.image})` }} className="search-container-backdrop" />
          <div className="bottom-info-container">
            <h1 onClick={this._openBackDropURL} className="title">{this.state.backdrop.title}</h1>
            <span className="year">{this.state.backdrop.year}</span>
            <p className="rating">{this.state.backdrop.certification}</p>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

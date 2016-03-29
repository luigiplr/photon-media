export default class Detail extends Component {

    state = {
        error: null,
        status: `Parsing: "${this.props.url}"`,
        loading: true,
        detail: {
            type: 'none'
        }
    };

    static propTypes = {
        url: React.PropTypes.string.isRequired,
        workers: React.PropTypes.object.isRequired,
        settingsStore: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this._initURLEngineParse()
    }

    _initURLEngineParse() {
        const { workers, plugins, url } = this.props
        const parseRequest = uuid()
        const urlParse = new urlParser({ id: parseRequest, workers, plugins, url })

        urlParse.on(parseRequest, (compatibleEngines = []) => {
            switch (compatibleEngines.length) {
                case 0:
                    break
                case 1:
                    this._initNameParse({...compatibleEngines[0] })
                    break
                default:
                    //for when there is more than one
            }
        })
    }

    _initNameParse({ name, url }) {
        const { workers, settingsStore } = this.props

        this.setState({ status: `Parsing: "${name}"` })
        const matcher = new titleMatcher({ workers, settingsStore }, name)

        matcher.on('status', status => {
            if (!this.mounted) return
            this.setState({ status })
        })
        matcher.once('success', detail => {
            if (!this.mounted) return
            this.setState({ detail: {...detail, url } })
        })
        matcher.once('error', error => {
            if (!this.mounted) return
            this.setState({ error: 'There was a error during parsing', loading: false })
        })
    }

    _close() {
        _.defer(() => this.props.updatePage('home'))
    }

    _play(player, url, subs) {
        const { workers } = this.props
        const { sockets } = workers.socket
        const id = uuid()

        sockets.emit('players:play', { id, url, playerID: player.id, subs })
        workers.once(id, playing => {
            workers.removeAllListeners(`${id}:error`)
        })
        workers.once(`${id}:error`, error => {
            workers.removeAllListeners(id)
        })
    }

    _getSubDetail() {
        switch (this.state.detail.type) {
            case 'show':
            case 'movie':
                return <LoadedDetail play={::this._play} {...this.state.detail} />
                break
            default:
                return null
        }
    }

    _getLoadingContents() {
        const { error, status } = this.state

        return (
            <div className="loading-spinner-wrapper">
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>
                <h1 className="status-text">{(status ? status : error)}</h1>
                <paper-spinner className="loading-spinner thin" active={this.state.loading}/>
            </div>
        )
    }

    render() {
        return (
            <div className="detail">                
                {(!this.state.error ? <paper-icon-button onClick={::this._close} className="back" icon="arrow-back"/> : null)}
                {::this._getLoadingContents()}
                {(this.state.detail.illegitimate ? <WarningDialog {...this.state.detail} settingsStore={this.props.settingsStore} /> : null)}
                <ReactCSSTransitionGroup className="transition-container" transitionName="cross-fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    <div className='transition-container' key={this.state.detail.type}>
                       {::this._getSubDetail()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

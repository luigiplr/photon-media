const settingsStore = localforage.createInstance({
    name: 'photon-media',
    version: 1.0
})


class Framework extends Component {

    state = {
        initializing: 'App Initializing',
        initializingDots: '',
        page: 'home',
        pageData: {}
    };

    componentWillMount() {
        this.workers = new InitWorkers()
        this.workers.once('initiated', () => this.setState({ initializing: 'Loading Plugins' }))

        this.plugins = new Plugins(this.workers)
        this.plugins.once('initiated', () => this.setState({ initializing: false }))

        this.setupContextMenus()
    }

    componentDidMount() {
        this.addDaDots()
    }

    setupContextMenus() {
        const buildEditorContextMenu = remote.require('electron-editor-context-menu');

        window.addEventListener('contextmenu', ({ target }) => {
            if (!target.closest('textarea, input, [contenteditable="true"]')) return

            const menu = buildEditorContextMenu(null, [{
                label: 'Cut',
                role: 'cut'
            }, {
                label: 'Copy',
                role: 'copy'
            }, {
                label: 'Paste',
                role: 'paste'
            }])
        
            setTimeout(() => menu.popup(remote.getCurrentWindow()), 30)
        })
    }

    addDaDots() {
        const loadingDotsAdder = setInterval(() => {
            const { initializing, initializingDots } = this.state
            if (!initializing) return clearInterval(loadingDotsAdder)

            let initializingDotsNew = initializingDots

            if (initializingDots.length === 3)
                initializingDotsNew = ''
            else
                initializingDotsNew = initializingDotsNew + '.'

            this.setState({ initializingDots: initializingDotsNew })
        }, 400)
    }

    _changePage = (page = 'home', pageData = {}) => this.setState({ page, pageData });

    _getContents() {
        switch (this.state.page) {
            case 'home':
                return <MediaInput workers={this.workers} updatePage={this._changePage} plugins={this.plugins} settingsStore={settingsStore}/>
            case 'detail':
                return <Detail settingsStore={settingsStore} updatePage={this._changePage} {...this.state.pageData} plugins={this.plugins} workers={this.workers}/>
            case 'settings':
                return <Settings plugins={this.plugins} updatePage={this._changePage} />
            default:
                return null
        }
    }

    _getCoreContents() {
        const { initializing, initializingDots } = this.state
        if (initializing) {
            return (
                <div className="loading-spinner-wrapper">
                    <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>
                    <h1 className="status-text">{initializing + initializingDots}</h1>
                    <paper-spinner className="loading-spinner thin" active={true}/>
                </div>
            )
        } else {
            return (
                <ReactCSSTransitionGroup transitionName="cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    <div className='transition-container' key={this.state.page}>
                        {::this._getContents()}
                    </div>
                </ReactCSSTransitionGroup>
            )
        }
    }

    render() {
        return (
            <div className='app-framework'>
                <Header />
                {::this._getCoreContents()}
            </div>
        )
    }
}

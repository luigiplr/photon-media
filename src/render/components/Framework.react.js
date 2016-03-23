const settingsStore = localforage.createInstance({
    name: 'photon-media',
    version: 1.0
})


class Framework extends Component {

    state = {
        page: 'search',
        pageData: {}
    }

    componentWillMount() {
        this.workers = new InitWorkers()
        this.plugins = new Plugins(this.workers)
    }

    _changePage = (page = 'home', pageData = {}) => this.setState({ page, pageData });

    getContents = () => {
        switch (this.state.page) {
            case 'home':
            case 'search':
                return <Search workers={this.workers} updatePage={this._changePage} settingsStore={settingsStore}/>
            case 'detail':
                return <Detail settingsStore={settingsStore} updatePage={this._changePage} {...this.state.pageData} workers={this.workers}/>
            case 'settings':
                return <Settings updatePage={this._changePage} />
            default:
                return null
        }
    };

    render() {
        return (
            <div className='app-framework'>
                <Header workers={this.workers} />
                <ReactCSSTransitionGroup transitionName="cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    <div className='transition-container' key={this.state.page}>
                        {this.getContents()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
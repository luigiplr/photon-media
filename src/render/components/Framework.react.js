class Framework extends Component {

  state = {
    initializing: 'App Initializing',
    initializingDots: '',
    page: 'home',
    pageData: {}
  }

  componentDidMount() {
    this.setupContextMenus()
    this.addDaDots()

    Promise.all([this._initSettings(), this._initWorkers()]).then(() => {
      this.setState({ initializing: 'Loading Plugins' })

      this.plugins = new Plugins(this.workers)
      this.plugins.once('initiated', () => this.setState({ initializing: false }))
    })
  }

  _initSettings = () => new Promise(resolve => {
    this.settingsStore = new Settings()
    this.settingsStore.once('initiated', resolve)
  })

  _initWorkers = () => new Promise(resolve => {
    this.workers = new InitWorkers()
    this.workers.once('initiated', resolve)
  })

  setupContextMenus() {
    const buildEditorContextMenu = remote.require('electron-editor-context-menu');

    window.addEventListener('contextmenu', ({ target }) => {
      if (!target.closest('textarea, input, [contenteditable="true"]')) return

      const menu = buildEditorContextMenu(null, [
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' }
      ])

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
    const { page } = this.state
    let contents = null
    switch (page) {
      case 'home':
        contents = <MediaInput workers={this.workers} updatePage={this._changePage} plugins={this.plugins} settingsStore={this.settingsStore}/>
        break
      case 'detail':
        contents = <Detail settingsStore={this.settingsStore} updatePage={this._changePage} {...this.state.pageData} plugins={this.plugins} workers={this.workers}/>
        break
      case 'settings':
        contents = <SettingsComponent settingsStore={this.settingsStore} plugins={this.plugins} workers={this.workers} updatePage={this._changePage} />
        break
    }
    return (
      <ReactCSSTransitionGroup transitionName="cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        <div className='transition-container' key={page}>
          {contents}
        </div>
      </ReactCSSTransitionGroup>
    )
  }

  _getLoadingContents() {
    const { initializing, initializingDots } = this.state
    return (
      <div className="loading-spinner-wrapper">
        <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>
        <h1 className="status-text">{initializing + initializingDots}</h1>
        <paper-spinner className="loading-spinner thin" active={true}/>
      </div>
    )
  }

  render = () => (
    <div className='app-framework'>
      <Header />
      {this.state.initializing ? this._getLoadingContents() : this._getContents() }
    </div>
  )
}

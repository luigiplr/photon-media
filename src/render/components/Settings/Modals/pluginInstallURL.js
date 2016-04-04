class PluginsInstallFromURL extends Component {

    static propTypes = {
        close: React.PropTypes.func.isRequired,
        install: React.PropTypes.func.isRequired,
        plugins: React.PropTypes.object.isRequired
    };

    state = {
        indeterminate: false,
        downloading: false,
        valid: true
    }

    componentDidMount() {
        this.mounted = true
        _.defer(() => this.refs.backdrop.appendChild(document.getElementsByTagName('iron-overlay-backdrop')[0]))
    }

    componentWillUnmount() {
        this.mounted = false
    }

    _getDialogUpStyle() {
        return `
            paper-dialog.install {
                position: fixed;
                width: 50vw;
                min-width: 500px;
                overflow: auto;
                z-index: 100;
            }
            paper-progress.progress {
  			  --paper-progress-active-color: var(--paper-indigo-500);
  			  --paper-progress-secondary-color: var(--paper-indigo-100);
  			  width: calc(100% - 50px);
  			  padding-bottom: 20px;
  			}
            `
    }

    urlChange() {
        if (!this.state.valid) this.setState({ valid: true })
    }

    _downloadAndCacheZip() {
        const pluginURL = this.refs.url_input.value

        const filename = path.basename(pluginURL)
        const tempPath = remote.app.getPath('temp')

        progress(request(pluginURL), { throttle: 10, delay: 0 })
            .on('progress', ({ percentage = 0 }) => this.setState({ downloading: percentage }))
            .on('error', (err) => {
                console.error(err)
            })
            .on('end', () => {
                this.setState({ indeterminate: true })
                this.props.plugins.install(path.join(tempPath, filename)).then(() => {
                    this.refs.modal.close()
                    this.props.close()
                })
            })
            .pipe(fs.createWriteStream(path.join(tempPath, filename)))
    }

    submit() {
        if (!isUri(this.refs.url_input.value.trim())) return remote.dialog.showMessageBox({
            noLink: true,
            type: 'error',
            message: 'Invalid Plugin URL Entered',
            detail: 'Please enter a valid plugin URL',
            buttons: ['Dismiss']
        })

        this.setState({ downloading: 0 })
        this._downloadAndCacheZip()
    }

    render() {
        return (
            <div className="dialog-back">
                <div ref="backdrop"/>
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDialogUpStyle()}}/>
                <paper-dialog ref="modal" modal className="install" opened={true} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                    <h2>{!this.state.downloading ? 'Install From URL' : 'Installing from URL'}</h2>
                    {this.state.downloading ? <paper-progress indeterminate={this.state.indeterminate} className="progress" value={this.state.downloading * 100}/> : null}
                    <div style={{display: this.state.downloading ? 'none' : null}}>
                    	<paper-input ref="url_input" onChange={::this.urlChange} label="URL"/>
                        <paper-button onClick={this.props.close} dialog-dismiss className="dialog-button right">Cancel</paper-button>
                        <paper-button className="dialog-button right" onClick={::this.submit}>Install</paper-button>
                    </div>
                </paper-dialog>
            </div>
        )
    }
}

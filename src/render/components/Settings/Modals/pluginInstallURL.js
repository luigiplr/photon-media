class PluginsInstallFromURL extends Component {

    static propTypes = {
        abort: React.PropTypes.func.isRequired,
        install: React.PropTypes.func.isRequired
    };

    state = {
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
            `
    }

    urlChange() {
        if (!this.state.valid) this.setState({ valid: true })
    }

    checkValid() {
        const { value } = this.refs.url_input
        return isUri(value)
    }

    submit() {
        if (!this.checkValid()) return remote.dialog.showMessageBox({
            noLink: true,
            type: 'error',
            message: 'Invalid Plugin URL Entered',
            detail: 'Please enter a valid plugin URL',
            buttons: ['Dismiss']
        })

    }

    render() {
        return (
            <div className="dialog-back">
                <div ref="backdrop"/>
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDialogUpStyle()}}/>
                <paper-dialog modal className="install" opened={true} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                    <h2>Install From URL</h2>
                    <paper-input ref="url_input" onChange={::this.urlChange} label="URL"/>
                    <div>
                        <paper-button onClick={this.props.abort} dialog-dismiss className="dialog-button right">Cancel</paper-button>
                        <paper-button className="dialog-button right" onClick={::this.submit}>Install</paper-button>
                    </div>
                </paper-dialog>
            </div>
        )
    }
}

class MediaInput extends Component {

    state = {
        color: void 0
    };

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired,
        workers: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
    }

    _setPalette = swatches => {
        if (!swatches) return

        let color
        let textColor

        if (swatches['Vibrant']) {
            if (swatches['Vibrant'].population < 20) {
                color = swatches['Muted'].hex
                textColor = swatches['Muted'].titleTextColor
            } else {
                color = swatches['Vibrant'].hex
                textColor = swatches['Vibrant'].titleTextColor
            }
        } else if (swatches['Muted']) {
            color = swatches['Muted'].hex
            textColor = swatches['Muted'].titleTextColor
        }

        if (textColor === '#000' || textColor === '#000000') {
            textColor = '#111214';
        }
        if (this.mounted)
            this.setState({ color })
    };

    _handleKeyPress = event => {
        if (event.key !== 'Enter' || !this.refs.searchtext.value || this.refs.searchtext.value.trim().length === 0) return
        this.props.updatePage('detail', { url: this.refs.searchtext.value })
    };

    render() {
        return (
            <div className="search-container">

                <Backdrop {...this.props} setPalette={this._setPalette} />

                <div className="bottom-button-container">
                    <paper-icon-button className="bottom-btn" icon="settings" onClick={() => this.props.updatePage('settings')}/>
                </div>

                <div style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <input ref="searchtext" onKeyPress={this._handleKeyPress} className="searchtext" />
                        <paper-icon-button style={{color: this.state.color}} className="search-btn" icon="link"/>
                    </paper-material>
                </div>
            </div>
        )
    }
}

class MediaInput extends Component {

  state = {
    color: void 0,
    text: false
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
    this.parseInput()
  };

  parseInput = (url = this.refs.searchtext.value) => _.defer(() => this.props.updatePage('detail', { url }));

  _handleOpenFilePicker = () => remote.dialog.showOpenDialog({
    title: 'Select file',
    properties: ['openFile', 'createDirectory'],
    filters: [{ name: 'Video Files', extensions: ['MP4', 'MKV', 'MOV', 'AVI', 'WMV', 'WMA', 'ASF', '3GP', 'OGM', 'OGG', 'WAV', 'Real'] }]
  }, file => {
    if (!file) return
    this.parseInput(file[0])
  });

  render() {
    return (
      <div className="search-container">
        <Backdrop {...this.props} setPalette={this._setPalette} />

        <div className="bottom-button-container">
          <paper-icon-button className="bottom-btn" icon="settings" onClick={() => this.props.updatePage('settings')}/>
        </div>
        
        <div style={{textAlign: 'center'}}>
          <paper-material className="search-box-contain" elevation="1">
            <input ref="searchtext" onChange={() => this.setState({ text: (this.refs.searchtext.value.trim().length === 0) ? false : true })} onKeyPress={this._handleKeyPress} className="searchtext" />
            <paper-icon-button onClick={() => !this.state.text ? _.defer(::this._handleOpenFilePicker) :  this.parseInput()} style={{color: this.state.color}} className="search-btn" icon={!this.state.text ? 'folder-open' :  'chevron-right'}/>
          </paper-material>
        </div>
      </div>
    )
  }
}

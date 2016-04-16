class WarningDialog extends Component {

  static propTypes = {
    settingsStore: React.PropTypes.object.isRequired,
    orginalTitle: React.PropTypes.string.isRequired
  }

  state = {
    open: false
  }

  componentDidMount() {
    if (!settingsStore.dontDisplayPirateWarning) {
      this.setState({ open: true })
      _.defer(() => this.refs.backdrop.appendChild(document.getElementsByTagName('iron-overlay-backdrop')[0]))
    }
  }

  _dialogUpStyle = `
    paper-dialog.warning {
        position: fixed;
        width: 50vw;
        min-width: 500px;
        overflow: auto;
        z-index: 999;
    }
  `

  _reportIncorrectMatch() {
    const { orginalTitle, title, ids, type } = this.props
    const { NODE_ENV } = process.env

    const header = `Incorrect Match: "${orginalTitle}"`
    const body = `Parsed Title: ${title} | Parsed IMDB: ${ids.imdb} | Parsed Type: ${type} | Build ENV: ${NODE_ENV}`

    shell.openExternal(`https://github.com/luigiplr/photon-media/issues/new?title=${header}&body=${body.trim()}`)
  }

  render() {
    return (
      <div className="dialog-back">
        <div ref="backdrop"/>
        <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._dialogUpStyle}}/>
        <paper-dialog modal className="warning" opened={this.state.open} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
          <h2>Possibly illegitimate media source detected</h2>
          <paper-dialog-scrollable>
            While Photon Media was designed with the idea to create a general purpose casting client, using it to cast illegitimate (pirated) materal is unendorsed nor encouraged.
            <br/><br/>
            We display this warning in hopes you will support the creators of the media in question and use a legitimate source.
          </paper-dialog-scrollable>
          <paper-checkbox onClick={() => this.props.settingsStore.setSetting(dontDisplayPirateWarning, this.refs['pirate-checkbox'].checked)} ref="pirate-checkbox">Dont display again</paper-checkbox>
          <div>
            <paper-button onClick={::this._reportIncorrectMatch} dialog-dismiss className="dialog-button">Report incorrect match</paper-button>
            <paper-button className="dialog-button" dialog-dismiss>Dismiss</paper-button>
          </div>
        </paper-dialog>
      </div>
    )
  }
}

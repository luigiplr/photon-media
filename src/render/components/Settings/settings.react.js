class SettingsComponent extends Component {

  state = {
    tab: 'general'
  }

  static propTypes = {
    settingsStore: React.PropTypes.object.isRequired,
    workers: React.PropTypes.object.isRequired,
    plugins: React.PropTypes.object.isRequired
  }

  _getSettingsTab() {
    let TabContents = null
    switch (this.state.tab) {
      case 'general':
        TabContents = <SettingsTabGeneral {...this.props} />
        break
      case 'plugins':
        TabContents = <SettingsTabPlugins {...this.props} />
        break
    }
    return TabContents
  }

  _settingsTabStyles() {
    return `
            paper-checkbox {
                --paper-checkbox-label-color: #fff;
                --paper-checkbox-unchecked-color: var(--paper-grey-500);
            }
        `
  }

  render = () => (
    <div className="settings">
      <paper-icon-button onClick={() => _.defer(() => this.props.updatePage('home'))} className="back" icon="arrow-back"/>
      <div className="container">
        <h1>Settings</h1>
        <div className="panel-container">
          <SettingsSidebar changeTab={tab => this.setState({ tab })} tab={this.state.tab} />
          <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._settingsTabStyles()}}/>
          {::this._getSettingsTab()}
        </div>
      </div>
    </div>
  )
}

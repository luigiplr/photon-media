export default class SettingsComponent extends Component {

    state = {
        tab: 'general'
    };

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired,
        workers: React.PropTypes.object.isRequired,
        plugins: React.PropTypes.object.isRequired
    };

    _changeTab(tab) {
        console.log(`Switch settings tab to ${tab}`)
        this.setState({ tab })
    }

    _getSettingsTab() {
        let TabContents = null
        switch (this.state.tab) {
            case 'general':
                TabContents = <SettingsTabGeneral {...this.props} />
                break
            case 'ui':
                TabContents = <SettingsTabUI {...this.props} />
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

    render() {
        return (
            <div className="settings">
                <paper-icon-button onClick={() => _.defer(() => this.props.updatePage('home'))} className="back" icon="arrow-back"/>
                <div className="container">
                    <h1>Settings</h1>
                    <div className="panel-container">
                        <SettingsSidebar changeTab={::this._changeTab} tab={this.state.tab} />
                        <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._settingsTabStyles()}}/>
                        {::this._getSettingsTab()}
                    </div>
                </div>
            </div>
        )
    }
}

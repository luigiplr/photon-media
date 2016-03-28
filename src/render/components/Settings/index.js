export default class Settings extends Component {

    state = {
        tab: 'general'
    };

    _changeTab(tab) {
        console.log(`Switch settings tab to ${tab}`)
        this.setState({ tab })
    }

    _getSettingsTab() {
        let tabContents = null
        switch (this.state.tab) {
            case 'general':
                tabContents = <SettingsTabGeneral />
                break
        }
        return tabContents
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
        const { tab } = this.state

        return (
            <div className="settings">
                <paper-icon-button onClick={() => _.defer(() => this.props.updatePage('home'))} className="back" icon="arrow-back"/>
                <div className="container">
                    <h1>Settings</h1>
                    <div className="panel-container">
                        <SettingsSidebar changeTab={::this._changeTab} tab={tab} />
                        <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._settingsTabStyles()}}/>
                        {::this._getSettingsTab()}
                    </div>
                </div>
            </div>
        )
    }
}

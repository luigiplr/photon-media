export default class Settings extends Component {

    state = {
        tab: 'general'
    };

    _changeTab(tab) {

    }

    _getSettingsTab() {
        switch (this.state.tab.toLowerCase()) {
            case 'general':
                break
        }
        return null
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
                <paper-icon-button onClick={() => _.defer(() => this.props.updatePage('search'))} className="back" icon="arrow-back"/>
                <div className="container">
                    <h1>Settings</h1>
                    <div className="panel-container">
                        <SettingsSidebar changeTab={::this._changeTab} tab={tab} />
                        <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._settingsTabStyles()}}/>
                        <div className="right-panel">
                            <div id="ui-settings" className="hidden">
                                <div className="setting display-settings flex-checkbox">
                                    <h2>Display Options</h2>
                                    <div className="setting-inner">
                                        <paper-checkbox checked="1">Enable loading random background images</paper-checkbox>
                                        <paper-checkbox checked="1">Confim when deleting shows</paper-checkbox>
                                        <paper-checkbox>Show confirmation dialog on exit</paper-checkbox>
                                        <paper-checkbox>Show window when intercepting magnets</paper-checkbox>
                                    </div>
                                </div>
                                <div className="setting tray-settings flex-checkbox">
                                    <h2>System Tray</h2>
                                    <div className="setting-inner">
                                        <paper-checkbox checked="1">Minimize button minimizes to tray</paper-checkbox>
                                        <paper-checkbox>Close button minimizes to tray</paper-checkbox>
                                        <paper-checkbox>Always display icon in tray</paper-checkbox>
                                        <paper-checkbox>Single click opens program</paper-checkbox>
                                        <paper-checkbox checked="1">Show notifications in tray</paper-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

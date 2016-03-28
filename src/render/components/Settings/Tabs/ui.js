export default class SettingsTabUI extends Component {

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired
    };

    _changeSetting(setting, checkbox) {
        const value = checkbox ? this.refs[setting].checked : this.refs[setting].value
        this.props.settingsStore.setSetting(setting, value)
    }

    render() {
        const { settingsStore } = this.props
        return (
            <div className="right-panel">
                <div className="setting display-settings flex-checkbox">
                    <h2>Display Options</h2>
                    <div className="setting-inner">
                        <paper-checkbox ref="cycleBackdrop" onClick={() => this._changeSetting('cycleBackdrop', true)} checked={settingsStore.cycleBackdrop}>Cycle trending series & movies backdrop</paper-checkbox>
                    </div>
                </div>
            </div>
        )
    }
}

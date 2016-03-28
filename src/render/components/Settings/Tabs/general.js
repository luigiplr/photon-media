export default class SettingsTabGeneral extends Component {

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
                    <h2>Window Behavior</h2>
                    <div className="setting-inner">
                        <paper-checkbox>Close button minimizes to tray</paper-checkbox>
                        <paper-checkbox checked="1">Minimize to system tray</paper-checkbox>
                        <paper-checkbox>Always display icon in tray</paper-checkbox>
                        <paper-checkbox>Show confirmation dialog on exit</paper-checkbox>
                    </div>
                </div>
            </div>
        )
    }
}

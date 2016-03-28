export default class SettingsTabGeneral extends Component {
    render() {
        return (
            <div className="right-panel">
                <div className="setting display-settings flex-checkbox">
                    <h2>Display Options</h2>
                    <div className="setting-inner">
                        <paper-checkbox checked="1">Cycle trending series & movies backdrop</paper-checkbox>
                    </div>
                </div>
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

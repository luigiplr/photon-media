export default class SettingsTabPlugins extends Component {

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
                    <div id="plugin-settings">
                        <div class="setting">
                            <div class="setting-inner">
                                <paper-checkbox checked="1">Enable Plugins</paper-checkbox>
                            </div>
                        </div>
                        <div class="setting plugins-list">
                            <style is="custom-style">
                                .settings .right-panel .plugins-list paper-listbox {
                                    --paper-listbox-background-color: rgba(45, 45, 45, 0.7);
                                    --paper-listbox-color: #fff;
                                }
                            </style>
                            <h2>Plugins List</h2>
                            <div class="setting-inner">
                                <paper-listbox>
                                    <paper-item>
                                        <div class="plugin-name">Memes</div>
                                        <div class="plugin-btns">
                                            <div class="btn">
                                                <paper-icon-button icon="update"></paper-icon-button>
                                                <paper-tooltip offset="-2" position="top">Download plugin update</paper-tooltip>
                                            </div>
                                            <div class="btn">
                                                <paper-icon-button icon="info-outline"></paper-icon-button>
                                                <paper-tooltip offset="-2" position="top">View plugin info</paper-tooltip>
                                            </div>
                                            <div class="btn">
                                                <paper-icon-button icon="delete"></paper-icon-button>
                                                <paper-tooltip offset="-2" position="top">Remove plugin</paper-tooltip>
                                            </div>
                                        </div>
                                    </paper-item>
                                </paper-listbox>
                                
                                <paper-button raised class="install-plugin">Install</paper-button>
                            </div>
                        </div>
                    </div>
        )
    }
}

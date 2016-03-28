export default class SettingsTabPlugins extends Component {

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired,
        workers: React.PropTypes.object.isRequired,
        plugins: React.PropTypes.object.isRequired
    };
    
    componentDidMount() {
        console.log(this.props.plugins)
    }

    _changeSetting(setting, checkbox) {
        const value = checkbox ? this.refs[setting].checked : this.refs[setting].value
        this.props.settingsStore.setSetting(setting, value)
    }

    _getStyles() {
        return `
            paper-listbox {
                --paper-listbox-background-color: rgba(45, 45, 45, 0.7);
                --paper-listbox-color: #fff;
            }
        `
    }

    render() {
        const { settingsStore } = this.props
        return (
            <div className="right-panel">
                <div className="setting plugins-list">
                    <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._getStyles()}}/>
                    <h2>Plugins List</h2>
                    <div className="setting-inner">
                        <paper-listbox>
                            <paper-item>
                                <div className="plugin-name">Memes</div>
                                <div className="plugin-btns">
                                    <div className="btn">
                                        <paper-icon-button icon="info-outline"/>
                                        <paper-tooltip offset="-2" position="top">View plugin info</paper-tooltip>
                                    </div>
                                    <div className="btn">
                                        <paper-icon-button icon="delete"/>
                                        <paper-tooltip offset="-2" position="top">Remove plugin</paper-tooltip>
                                    </div>
                                </div>
                            </paper-item>
                            <paper-item>
                                <div className="plugin-name">Memes</div>
                                <div className="plugin-btns">
                                    <div className="btn">
                                        <paper-icon-button icon="info-outline"/>
                                        <paper-tooltip offset="-2" position="top">View plugin info</paper-tooltip>
                                    </div>
                                    <div className="btn">
                                        <paper-icon-button icon="delete"/>
                                        <paper-tooltip offset="-2" position="top">Remove plugin</paper-tooltip>
                                    </div>
                                </div>
                            </paper-item>
                        </paper-listbox>
                        <paper-button raised className="install-plugin">Install</paper-button>
                    </div>
                </div>
            </div>
        )
    }
}

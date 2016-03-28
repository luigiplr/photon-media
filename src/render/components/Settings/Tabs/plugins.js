export default class SettingsTabPlugins extends Component {

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired,
        workers: React.PropTypes.object.isRequired,
        plugins: React.PropTypes.object.isRequired
    };

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

    _formatPlugins() {
        const { plugins } = this.props.plugins
        let formatted = []
        _.forEach(plugins, plugin => formatted.push({
            path: plugin.path,
            homepage: plugin.package.pluginData.homepage,
            title: plugin.package.pluginData.title,
            version: plugin.package.version
        }))
        return formatted
    }

    render() {
        const { settingsStore } = this.props
        return (
            <div className="right-panel">
                <div className="setting plugins-list">
                    <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._getStyles()}}/>
                    <h2>Installed Plugins</h2>
                    <div className="setting-inner">
                        <paper-listbox>
                            {
                                this._formatPlugins().map(({title, homepage, version, path}, idx) => (
                                        <paper-item key={idx}>
                                            <div className="plugin-name">{title}</div>
                                            <div className="plugin-btns">
                                                <div className="btn">
                                                    <paper-icon-button onClick={() => shell.openExternal(homepage)} icon="open-in-new"/>
                                                    <paper-tooltip offset="-2" position="top">View plugin homepage</paper-tooltip>
                                                </div>
                                                <div className="btn">
                                                    <paper-icon-button icon="delete"/>
                                                    <paper-tooltip offset="-2" position="top">Remove plugin</paper-tooltip>
                                                </div>
                                            </div>
                                        </paper-item>
                                    ))
                            }
                        </paper-listbox>
                        <paper-button raised className="install-plugin">Install</paper-button>
                    </div>
                </div>
            </div>
        )
    }
}

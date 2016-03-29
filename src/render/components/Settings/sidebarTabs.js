export default class SettingsSidebar extends Component {

    static propTypes = {
        changeTab: React.PropTypes.func.isRequired,
        tab: React.PropTypes.string.isRequired
    };

    tabs = [
        { icon: 'image:tune', title: 'General' },
        { icon: 'device:widgets', title: 'Plugins' },
        { icon: 'notification:network-check', title: 'Network' },
        { icon: 'info-outline', title: 'About' },
    ];

    _tabStyles() {
        return `
            paper-listbox {
                --paper-listbox-background-color: transparent;
                --paper-listbox-color: #fff;
            };
            paper-item {
                --paper-item-selected-weight: 500;
                --paper-item-focused-before: {
                    opacity: 0;
                }
            };
        `
    }

    _settingsTab({ title, icon }, key) {
        return (
            <paper-item onClick={() => this.props.changeTab(title.toLowerCase())} key={key} className="setting-tab">
                <iron-icon className="icon" icon={icon}/>
                {title}
                <paper-ripple/>
            </paper-item>
        )
    }

    render() {
        return (
            <div className="left-panel">
                <style is="custom-style" scoped dangerouslySetInnerHTML={{ __html: this._tabStyles()}}/>
                <paper-listbox className="settings-tab-container" selected="1">
                   {this.tabs.map(::this._settingsTab)}
                </paper-listbox>
            </div>
        )
    }
}

class WarningDialogPluginRemove extends Component {

    static propTypes = {
        plugin: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        this.mounted = true
        _.defer(() => this.refs.backdrop.appendChild(document.getElementsByTagName('iron-overlay-backdrop')[0]))
    }

    componentWillUnmount() {
        this.mounted = false
    }

    _getDialogUpStyle() {
        return `
            paper-dialog.warning {
                position: fixed;
                width: 50vw;
                min-width: 500px;
                overflow: auto;
                z-index: 100;
            }
            `
    }

    render() {
        return (
            <div className="dialog-back">
                <div ref="backdrop"/>
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDialogUpStyle()}}/>
                <paper-dialog modal className="warning" opened={true} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                    <h2>Confirm removal of {this.props.plugin.title}</h2>
                    <div>
                        <paper-button dialog-dismiss className="dialog-button">Cancel</paper-button>
                        <paper-button className="dialog-button" dialog-dismiss>Remove</paper-button>
                    </div>
                </paper-dialog>
            </div>
        )
    }
}

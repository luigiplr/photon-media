export default class Settings extends Component {

    _close() {
        _.defer(() => this.props.updatePage('search'))
    }

    render() {
        return (
            <div className="detail settings">
                <paper-icon-button onClick={::this._close} className="back" icon="arrow-back"/>
                <div className="container">
                    <h1>Settings</h1>
                    <div className="panel-container">
                        <div className="left-panel"></div>
                        <div className="right-panel"></div>
                    </div>
                </div>
            </div>
        )
    }
}
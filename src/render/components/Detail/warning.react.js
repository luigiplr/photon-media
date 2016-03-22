import React, { Component } from 'react'
import { shell } from 'electron'
import { defer } from 'lodash'


export default class PiratedWarning extends Component {

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired
    };

    state = {
        open: false
    };

    componentDidMount() {
        this.mounted = true

        settingsStore.getItem('dont-display-pirate-warning')
            .then(dont => {
                if (!dont) {
                    this.setState({ open: true })
                    defer(() => this.refs.backdrop.appendChild(document.getElementsByTagName('iron-overlay-backdrop')[0]))
                }
            })
            .catch(() => {
                this.setState({ open: true })
                defer(() => this.refs.backdrop.appendChild(document.getElementsByTagName('iron-overlay-backdrop')[0]))
            })
    }

    _getDialogUpStyle() {
        return `
                paper-dialog.warning {
                    position: fixed;
                    width: 50vw;
                    min-width: 500px;
                    overflow: auto;
                    z-index: 999;
                }
            `
    }

    _dontShowAgain() {
        const { checked } = this.refs['pirate-checkbox']
        settingsStore.setItem('last-search-backdrop', checked)
    }

    render() {
        return (
            <div className="dialog-back">
                <div ref="backdrop"/>
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDialogUpStyle()}}/>
                <paper-dialog modal className="warning" opened={this.state.open} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                    <h2>Possibly illegitimate media source detected</h2>
                    <paper-dialog-scrollable>
                        While Photon Media was designed with the idea to create a general purpose streaming/casting client, using it to stream illegitimate (pirated) materal is unendorsed and not encouraged. 
                        <br/><br/>
                        We display this warning in hopes you will support the creators of the media in question and use a legitimate source.
                    </paper-dialog-scrollable>
                    <paper-checkbox onClick={::this._dontShowAgain} ref="pirate-checkbox">Dont display again</paper-checkbox>
                    <div>
                        <paper-button onClick={() => shell.openExternal('https://github.com/luigiplr/photon-media/issues/new')} dialog-dismiss className="dialog-button">Report incorrect match</paper-button>
                        <paper-button className="dialog-button" dialog-dismiss>Dismiss</paper-button>
                    </div>
                </paper-dialog>
            </div>
        )
    }
}
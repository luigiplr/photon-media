import React, { Component } from 'react'
import { shell } from 'electron'
import _ from 'lodash'


export default class PiratedWarning extends Component {

    static propTypes = {
        sourceName: React.PropTypes.string.isRequired
    };

    state = {
        open: true

    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
    }

    _getDialogUpStyle() {
        return `
                paper-dialog {
                    position: fixed;
                    width: 30vw;
                    min-width: 500px;
                    overflow: auto;
                }
            `
    }

    render() {
        return (
            <div>
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDialogUpStyle()}}/>
                <paper-dialog with-backdrop opened={this.state.open} entry-animation="scale-up-animation" exit-animation="fade-out-animation">
                    <h2>Possibly illegitimate media source detected</h2>
                    <paper-dialog-scrollable>
                        While Photon Media was designed with the idea to create a general purpose streaming/casting client, using it to stream illegitimate (pirated) materal is unendorsed and not encouraged. 
                        <br/>
                        We display this warning in hopes you will support the creators of the media in question and use a legitimate source.
                        <br/>
                        <br/>
                        If this detection was made in error please report it using the button below.
                    </paper-dialog-scrollable>
                    <div class="buttons">
                        <paper-button dialog-dismiss>Report incorrect match</paper-button>
                        <paper-button dialog-confirm>Dismiss</paper-button>
                    </div>
                </paper-dialog>
            </div>
        )
    }
}
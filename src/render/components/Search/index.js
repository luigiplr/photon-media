import React, { Component } from 'react'
import { clipboard } from 'electron'
import { v4 as uuid } from 'node-uuid'
import Backdrop from './backdrop.react'

export default class Search extends Component {

    state = {
        color: void 0,
        type: 'url'
    };

    static propTypes = {
        settingsStore: React.PropTypes.object.isRequired,
        workers: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
    }

    _setPalette = swatches => {
        if (!swatches) return

        let color
        let textColor

        if (swatches['Vibrant']) {
            if (swatches['Vibrant'].population < 20) {
                color = swatches['Muted'].hex
                textColor = swatches['Muted'].titleTextColor
            } else {
                color = swatches['Vibrant'].hex
                textColor = swatches['Vibrant'].titleTextColor
            }
        } else if (swatches['Muted']) {
            color = swatches['Muted'].hex
            textColor = swatches['Muted'].titleTextColor
        }

        if (textColor === '#000' || textColor === '#000000') {
            textColor = '#111214';
        }
        if (this.mounted)
            this.setState({ color })
    };

    _handleKeyPress = event => {
        if (event.key !== 'Enter' || !this.refs.searchtext.value || this.refs.searchtext.value.trim().length === 0) return
        this.props.updatePage('detail', { url: this.refs.searchtext.value })
    };

    render() {
        return (
            <div className="search-container">

                <Backdrop {...this.props} setPalette={this._setPalette} />

                <div className="bottom-button-container">
                    <paper-icon-button className="bottom-btn" icon="settings" onClick={() => this.props.updatePage('settings')}/>
                </div>

                <div style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <paper-menu-button>
                            <paper-icon-button style={{color: this.state.color}} icon="more-vert" className="dropdown-trigger"/>
                            <paper-menu className="dropdown-content" selected="0">
                                <paper-item onClick={() => this.setState({type: 'url'})}>URL</paper-item>
                                <paper-item onClick={() => this.setState({type: 'file'})}>File</paper-item>
                            </paper-menu>
                        </paper-menu-button>
                        <input ref="searchtext" onContextMenu={() => this.refs.searchtext.value = clipboard.readText()} onKeyPress={this._handleKeyPress} className="searchtext" />
                        <paper-icon-button style={{color: this.state.color}} className="search-btn" icon={(this.state.type === 'url' ? 'link' : 'folder')}/>
                    </paper-material>
                </div>
            </div>
        )
    }
}
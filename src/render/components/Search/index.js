import React, { Component } from 'React'
import Backdrop from './backdrop.react'


export default class Search extends Component {

    state = {
        color: void 0,
        type: 'url'
    };

    componentWillMount() {

    }

    componentDidMount() {

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

        this.setState({ color })
    };

    render() {
        return (
            <div className="search-container">

                <Backdrop setPalette={this._setPalette} workers={this.props.workers} />

                <div className="bottom-button-container">
                    <paper-icon-button className="bottom-btn" icon="settings"/>
                </div>

                <div style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <paper-menu-button>
                            <paper-icon-button style={{color: this.state.color}} icon="more-vert" className="dropdown-trigger"/>
                            <paper-menu className="dropdown-content">
                                <paper-item onClick={() => this.setState({type: 'url'})}>URL</paper-item>
                                <paper-item onClick={() => this.setState({type: 'file'})}>File</paper-item>
                            </paper-menu>
                        </paper-menu-button>
                        <input className="searchtext" />
                        <paper-icon-button style={{color: this.state.color}} className="search-btn" icon={(this.state.type === 'url' ? 'link' : 'folder')}/>
                    </paper-material>
                </div>
            </div>
        )
    }
}
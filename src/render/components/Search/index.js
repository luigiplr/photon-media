import React, { Component } from 'React'
import Backdrop from './backdrop.react'


export default class Search extends Component {

    state = {
        color: void 0
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
                        <input className="searchtext" />
                        <paper-icon-button style={{color: this.state.color}} className="search-btn" icon="link"/>
                    </paper-material>
                </div>
            </div>
        )
    }
}
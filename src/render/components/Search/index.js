import React, { Component } from 'React'
import Backdrop from './backdrop.react'


export default class Search extends Component {

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="search-container">

                <Backdrop workers={this.props.workers} />

                <div className="bottom-button-container">
                    <paper-icon-button className="bottom-btn" icon="settings"/>
                </div>

                <div style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <input className="searchtext" />
                        <paper-icon-button className="search-btn" icon="link"/>
                    </paper-material>
                </div>
            </div>
        )
    }
}

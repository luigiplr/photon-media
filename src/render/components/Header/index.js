import React, { Component } from 'React'


export default class Header extends Component {
    render() {
        return (
            <header>
                <span className="title">Photon Media</span>
                <div className="os-controls">
                    <paper-icon-button className="minimize" icon="remove"/>
                    <paper-icon-button className="maximize" icon="check-box-outline-blank"/>
                    <paper-icon-button className="close" icon="close"/>
                </div>
            </header>
        )
    }
}

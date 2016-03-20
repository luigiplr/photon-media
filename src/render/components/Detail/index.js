import React, { Component } from 'react'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'


export default class Detail extends Component {

    state = {
        loading: true,
        detail: {}
    };

    _close = () => {
        _.defer(() => this.props.updatePage('search'))
    };

    render() {
        return (
            <div className="detail">                
                <paper-icon-button onClick={this._close} className="back" icon="arrow-back"/>

                <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>

                <div className="loading-spinner-wrapper">
                    <paper-spinner className="loading-spinner thin" active/>
                </div>
            </div>
        )
    }
}
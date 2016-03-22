import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import localforage from 'localforage'

import initWorkers from '../utils/initWorkers'
import Header from './Header'
import Search from './Search'
import Detail from './Detail'
import Settings from './Settings'


const workers = new initWorkers()

const settingsStore = localforage.createInstance({
    name: 'photon-media',
    version: 1.0
})


export default class Framework extends Component {

    state = {
        page: 'search',
        pageData: {}
    }

    _changePage = (page = 'home', pageData = {}) => this.setState({ page, pageData });

    getContents = () => {
        switch (this.state.page) {
            case 'home':
            case 'search':
                return <Search workers={workers} updatePage={this._changePage} settingsStore={settingsStore}/>
            case 'detail':
                return <Detail settingsStore={settingsStore} updatePage={this._changePage} {...this.state.pageData} workers={workers}/>
            case 'settings':
                return <Settings updatePage={this._changePage} />
            default:
                return null
        }
    };

    render() {
        return (
            <div className='app-framework'>
                <Header workers={workers} />
                <ReactCSSTransitionGroup transitionName="cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    <div className='transition-container' key={this.state.page}>
                        {this.getContents()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
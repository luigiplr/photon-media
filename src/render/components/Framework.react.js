import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import initWorkers from '../utils/initWorkers'
import Header from './Header'
import Search from './Search'
import Detail from './Detail'

const workers = new initWorkers()


export default class Framework extends Component {

    state = {
        page: 'search',
        pageData: {}
    }

    componentWillMount() {


    }

    componentDidMount() {

    }

    _changePage = (page, pageData = {}) => {
        console.log(page)
        this.setState({ page, pageData })
    };

    getContents = () => {
        switch (this.state.page) {
            case 'search':
                return <Search updatePage={this._changePage} workers={workers}/>
                break
            case 'detail':
                return <Detail updatePage={this._changePage} {...this.state.pageData} workers={workers}/>
                break
            case 'settings':
                break
            default:
                return null
        }
    };

    render() {
        return (
            <div className='app-framework'>
                <Header workers={workers} />
                <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    <div key={this.state.page}>
                        {this.getContents()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
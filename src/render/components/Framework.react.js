import React, { Component } from 'react'

import initWorkers from '../utils/initWorkers'
import Header from './Header'
import Search from './Search'

const workers = new initWorkers()


export default class Framework extends Component {
    componentWillMount() {


    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div className='app-framework'>
                <Header workers={workers} />
                <Search workers={workers} />
            </div>
        )
    }
}

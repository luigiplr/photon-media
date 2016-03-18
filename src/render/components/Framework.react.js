import React, { Component } from 'React'

import socketClient from '../utils/socketClient'
import Header from './Header'
import Search from './Search'




export default class Framework extends Component {
    componentWillMount() {


    }

    componentDidMount() {
        console.log(socketClient)
    }

    render() {
        return (
            <div className='app-framework'>
                <Header />
                <Search socketClient={socketClient} />
            </div>
        )
    }
}

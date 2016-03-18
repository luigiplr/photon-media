import React, { Component } from 'React'
import Header from './Header'
import Search from './Search'

export default class Framework extends Component {
    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className='app-framework'>
                <Header />
                <Search />
            </div>
        )
    }
}

import React, { Component } from 'React'


export default class Search extends Component {
    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="search-container">
                <div style={{backgroundImage: 'url(https://walter.trakt.us/images/movies/000/128/378/fanarts/original/401b051d49.jpg)'}} className="search-container-backdrop"/>
                <div className="top-button-container">
                    <paper-icon-button className="bottom-btn" icon="link"/>
                    <paper-icon-button className="bottom-btn" icon="settings"/>
                </div>
                <div id="wrapper" style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <paper-menu-button>
                            <paper-icon-button icon="more-vert" className="dropdown-trigger"/>
                            <paper-menu className="dropdown-content">
                                <paper-item>All</paper-item>
                                <paper-item>Movies</paper-item>
                                <paper-item>Series</paper-item>
                                <paper-item>Music</paper-item>
                            </paper-menu>
                        </paper-menu-button>
                        <input className="searchtext" />
                        <paper-icon-button className="search-btn" icon="search"/>
                    </paper-material>
                </div>
            </div>
        )
    }
}

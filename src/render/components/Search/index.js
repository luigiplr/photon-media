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
                <div className="bottom-button-container">
                    <paper-icon-button className="bottom-btn" icon="settings"/>
                </div>
                <div className="bottom-info-container">
                    <h1 className="title">Spectre</h1><span className="year">2015</span>
                    <p className="rating">PG-13</p>
                </div>
                <div id="wrapper" style={{textAlign: 'center'}}>
                    <paper-material className="search-box-contain" elevation="1">
                        <input className="searchtext" />
                        <paper-icon-button className="search-btn" icon="link"/>
                    </paper-material>
                </div>
            </div>
        )
    }
}

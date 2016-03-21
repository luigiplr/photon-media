import React, { Component } from 'react'
import { shell } from 'electron'
import _ from 'lodash'


export default class ShowDetail extends Component {

    state = {
        backgroundImage: '',
        posterImage: ''
    };

    static propTypes = {
        detail: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this._loadImages()
    }

    _loadImages = () => {
        const { fanart, poster } = this.props.detail.images

        let backgroundImage = new Image()
        backgroundImage.onload = () => {
            if (!this.mounted) return
            this.setState({ backgroundImage: fanart.full })
            _.defer(() => backgroundImage = null)
        }
        backgroundImage.src = fanart.full

        let posterImage = new Image()
        posterImage.onload = () => {
            if (!this.mounted) return
            this.setState({ posterImage: poster.full })
            _.defer(() => posterImage = null)
        }
        posterImage.src = poster.full
    };

    _getTabsStyle() {
        return `
            .seasons-wrapper {
                --paper-toolbar-background: transparent;
            }
            .season-tabs {
                --paper-tabs-selection-bar-color: white;
            }
            `
    }

    render() {
        console.log(this.props.detail)
        const { title, year, runtime, genres, overview, trailer } = this.props.detail
        return (
            <div className="show-detail">
                <div className="bg-backdrop" style={{backgroundImage: `url(${this.state.backgroundImage})`}}/>
                <div className="summary-wrapper">
                    <paper-icon-button className="back" icon="arrow-back"/>
                    <div className="title">
                        The Walking Dead
                    </div>
                    <paper-icon-button icon="bookmark" className="bookmark-toggle">
                    </paper-icon-button>
                    <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getTabsStyle()}}/>
                    <paper-toolbar className="seasons-wrapper">
                        <paper-tabs selected="0" className="season-tabs bottom" noink scrollable>
                            <paper-tab className="season">Show Info</paper-tab>
                            <paper-tab className="season">season 1</paper-tab>
                            <paper-tab className="season">season 2</paper-tab>
                            <paper-tab className="season">season 3</paper-tab>
                            <paper-tab className="season">season 4</paper-tab>
                            <paper-tab className="season">season 5</paper-tab>
                        </paper-tabs>
                    </paper-toolbar>
                </div>
                <div className="info-wrapper">
                    <img src="https://walter.trakt.us/images/shows/000/001/393/posters/thumb/dec5cd226c.jpg" className="poster" />
                    <div className="meta-container show-info episode-list-show">
                        <div className="meta-item">
                            <paper-icon-button noink icon="star" className="star"/>
                            <paper-icon-button noink icon="star" className="star"/>
                            <paper-icon-button noink icon="star-half" className="star"/>
                            <paper-icon-button noink icon="star-border" className="star"/>
                            <paper-icon-button noink icon="star-border" className="star"/>
                            <span className="meta-dot first"/>
                            <p>
                                geners
                            </p>
                            <span className="meta-dot"/>
                            <p>
                                2015 - 2016
                            </p>
                            <span className="meta-dot"/>
                            <p>45 min</p>
                        </div>
                        <div className="meta-synop">
                            synopsis
                        </div>
                        <paper-button id="trakt-link" className="meta-btn">
                            <i className="zmdi zmdi-open-in-new"></i> More Info
                        </paper-button>
                        <div className="meta-divider"></div>
                        <div className="people">
                            <div className="person-avatar">
                                <img src="" />
                            </div>
                            <p className="person">
                                person name
                            </p>
                            <p className="status">
                                as character
                            </p>
                        </div>
                    </div>
                    <div className="episode-container ">
                        <ul className="visible">
                            <li className="epsiode-tab active">
                                <p className="episode-id">S06E13</p>
                                <p className="episode-name">The same boat</p>
                                <paper-icon-button className="info-icon" icon="info"/>
                                <p className="episode-airdate">March 13, 2016 9:00 PM</p>
                            </li>
                        </ul>
                    </div>
                    <div className="controls-container">
                        <paper-button raised className="watchnow-btn">Play <span>S01E01</span></paper-button>
                    </div>
                </div>
            </div>
        )
    }
}
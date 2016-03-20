import React, { Component } from 'react'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'


export default class MovieDetail extends Component {

    state = {};

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
    }

    _getDropUpStyle() {
        return `
            paper-dropdown-menu.meta-dropdown {
                --paper-dropdown-menu: {
                    top: 2px;
                    width: 150px;
                }
                --paper-input-container-label: {
                    color: white;
                    font-weight: 500;
                    margin-left: 10px;
                }
                --paper-input-container-input: {}
                --paper-input-container-underline: {
                display: none;
                }
            }
            `
    }

    render() {
        return (
            <div className="movie-detail">
            <div className="bg-backdrop" style={{backgroundImage: `url(https://walter.trakt.us/images/movies/000/183/371/fanarts/original/2097014462.jpg)`}}/>
            <div className="summary-wrapper movie">
            <div className="title">
                The Martian
            </div>
            <paper-icon-button id="bookmark_button" icon="bookmark-border" className="bookmark-toggle"/> 
            <paper-tooltip for="bookmark_button" offset="0">Bookmark movie</paper-tooltip>

            <img src="https://walter.trakt.us/images/movies/000/183/371/posters/thumb/8767195506.jpg" className="poster" />
            <div className="meta">
                <div className="meta-item">
                    <paper-icon-button noink icon="star" className="star"/>
                    <paper-icon-button noink icon="star" className="star"/>
                    <paper-icon-button noink icon="star-half" className="star"/>
                    <paper-icon-button noink icon="star-border" className="star"/>
                    <paper-icon-button noink icon="star-border" className="star"/>
                    <span className="meta-dot first"/>
                    <p>Science Fiction, Adventure, Drama</p>
                    <span className="meta-dot"/>
                    <p>2015</p>
                    <span className="meta-dot"/>
                    <p>141 mins</p>
                </div>
                <div className="meta-synop">
                    During a manned mission to Mars, Astronaut Mark Watney is presumed dead after a fierce storm and left behind by his crew. But Watney has survived and finds himself stranded and alone on the hostile planet. With only meager supplies, he must draw upon his ingenuity, wit and spirit to subsist and find a way to signal to Earth that he is alive.
                </div>
                <paper-button className="meta-btn first">
                    theatre showtimes
                </paper-button>
                <paper-button className="meta-btn">
                    Watch Trailer
                </paper-button>

                <paper-button className="meta-btn right first">

                </paper-button>
                <div className="meta-divider"/>
                <div className="people">
                    <div className="person-avatar">
                        <div />
                    </div>
                    <p className="person">
                        Ridley Scott
                    </p>
                    <p className="status">
                        Director
                    </p>
                </div>
                <div className="people">
                    <div className="person-avatar">
                        <div />
                    </div>
                    <p className="person">
                        Matt Damon
                    </p>
                    <p className="status">
                        Actor
                    </p>
                </div>
            </div>
        </div>
        <div className="controls-container">
            <div className="meta-container-c">
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getDropUpStyle()}}/>
                <li className="subtitles-dropdown">
                    <paper-icon-button noink className="play-icon" icon="av:subtitles"/>
                    <paper-dropdown-menu className="meta-dropdown" vertical-align="bottom" horizontal-align="right" label="None">
                        <paper-listbox className="dropdown-content">
                            <paper-item>allosaurus</paper-item>
                            <paper-item>brontosaurus</paper-item>
                            <paper-item>carcharodontosaurus</paper-item>
                            <paper-item>diplodocus</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </li>
                <li className="device-dropdown">
                    <paper-icon-button noink className="play-icon" icon="hardware:cast-connected"/>

                    <paper-dropdown-menu className="meta-dropdown" vertical-align="bottom" horizontal-align="right" label="Pizza Cast">
                        <paper-listbox className="dropdown-content">
                            <paper-item>allosaurus</paper-item>
                            <paper-item>brontosaurus</paper-item>
                            <paper-item>carcharodontosaurus</paper-item>
                            <paper-item>diplodocus</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </li>
            </div>
            <paper-button raised className="watchnow-btn">
                <paper-icon-button noink className="play-icon" icon="av:play-arrow"/> Watch Now
            </paper-button>

        </div>
    </div>
        )
    }
}
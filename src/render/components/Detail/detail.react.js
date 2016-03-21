import React, { Component } from 'react'
import { shell } from 'electron'
import _ from 'lodash'
import moment from 'moment'


export default class DetailLoaded extends Component {

    state = {
        backgroundImage: '',
        posterImage: ''
    };

    static propTypes = {
        title: React.PropTypes.string.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentWillMount() {
        console.log('Movie Detail Mounting!', this.props)
    }

    componentDidMount() {
        this.mounted = true
        this._loadImages()
    }

    _loadImages = () => {
        const { fanart, poster } = this.props.images
        const { episode } = this.props

        let backgroundImageURL = /* (episode && episode.images && episode.images.screenshot && episode.images.screenshot.full) ? episode.images.screenshot.full :*/ fanart.full

        let backgroundImage = new Image()
        backgroundImage.onload = () => {
            if (!this.mounted) return
            this.setState({ backgroundImage: backgroundImageURL })
            _.defer(() => backgroundImage = null)
        }
        backgroundImage.src = backgroundImageURL

        let posterImage = new Image()
        posterImage.onload = () => {
            if (!this.mounted) return
            this.setState({ posterImage: poster.full })
            _.defer(() => posterImage = null)
        }
        posterImage.src = poster.full
    };

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

    _getHumanTime(minutes) {
        let time = moment.duration(minutes, 'minutes')
        return (time.hours() !== 0) ? `${time.hours()} hour${(time.hours() > 1 ? 's' : '')} ${time.minutes()} minutes` : `${time.minutes()} min`
    }

    _getOverview() {
        const { type } = this.props
        if (type === 'movie') return this.props.overview

        const { overview } = this.props.episode
        return overview ? overview : 'Episode synopsis unavailable'
    }

    _getReleaseDate() {
        const { type, year, episode } = this.props
        if (type === 'movie') return year

        return moment(this.props.episode.first_aired).format('MMMM Do, YYYY h:mm A')
    }

    _getTitle() {
        let { title, type, episode } = this.props
        if (type === 'show')
            title = `${title} S${('0' + episode.season).slice(-2)}E${('0' + episode.number).slice(-2)} - ${episode.title}`
        return title
    }

    _getRating() {
        const { rating, episode } = this.props
        const starsRating = ((episode && episode.rating) ? episode.rating : rating) / 2

        let starsArray = []

        let fullStars = Math.floor(starsRating)
        for (var i = 1; i <= Math.floor(starsRating); i++) {
            starsArray.push(<paper-icon-button key={i} noink icon="star" className="star"/>)
        }

        if (starsRating % 1 > 0)
            starsArray.push(<paper-icon-button key='half-star' noink icon="star-half" className="star"/>)

        for (var i = Math.ceil(starsRating); i < 5; i++) {
            starsArray.push(<paper-icon-button key={i} noink icon="star-border" className="star"/>)
        }

        return starsArray
    }

    render() {
        const { runtime, genres, overview, trailer, homepage } = this.props

        return (
            <div className="movie-detail">
                <div className="bg-backdrop" style={{backgroundImage: `url(${this.state.backgroundImage})`}}/>
                <div className="summary-wrapper movie">
                    <div className="title">{::this._getTitle()}</div>
                    <img ref="poster" src={this.state.posterImage} className="poster" />
                    <div className="meta">
                        <div className="meta-item">
                            {::this._getRating()}
                            <span className="meta-dot first"/>
                            <p>{genres.slice(0,3).join(', ')}</p>
                            <span className="meta-dot"/>
                            <p>{::this._getReleaseDate()}</p>
                            <span className="meta-dot"/>
                            <p>{this._getHumanTime(runtime)}</p>
                        </div>
                        <div className="meta-synop">{::this._getOverview()}</div>
                        <paper-button onClick={() => shell.openExternal(homepage)} className="meta-btn first">
                            homepage
                        </paper-button>
                        <paper-button onClick={() => shell.openExternal(trailer)} className="meta-btn">
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
                            <paper-dropdown-menu className="meta-dropdown" vertical-align="bottom" horizontal-align="right">
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
                            <paper-dropdown-menu className="meta-dropdown" vertical-align="bottom" horizontal-align="right">
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
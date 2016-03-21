import React, { Component } from 'react'
import { shell } from 'electron'
import _ from 'lodash'


export default class ShowDetail extends Component {

    state = {
        backgroundImage: '',
        posterImage: '',
        info: true,
        season: parseInt(this.props.detail.season),
        episode: this.props.detail.episode.number
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

    _getEpisodes = () => {
        const season = _.find(this.props.detail.seasons, ({ number }) => number === this.state.season)
        if (!season) return null
        const { episodes } = season
        return (
            <ul className={this.state.season !== -1 ? 'episode-list-show' : ''}>
                {
                    episodes.map(({first_aired, number, title}, idx) => {
                        if(!title || title.trim().length === 0 || title === 'TBA') return null
                        return (
                            <li key={idx} onClick={() => this.setState({episode: number})} className={`epsiode-tab ${((this.state.episode && this.state.episode === number) ? 'active': '')}`}>
                                <p className="episode-id">{`S${('0' + season.number).slice(-2)}E${('0' + number).slice(-2)}`}</p>
                                <p className="episode-name">{title}</p>
                                <paper-icon-button className="info-icon" icon="info"/>
                                <p className="episode-airdate">{first_aired}</p>
                            </li>
                        )
                    })
                }
            </ul>
        )
    };

    render() {
        const { title, year, status, runtime, genres, overview, trailer, seasons } = this.props.detail
        return (
            <div className="show-detail">
                <div className="bg-backdrop" style={{backgroundImage: `url(${this.state.backgroundImage})`}}/>
                <div className="summary-wrapper">
                    <div className="title">{title}</div>
                    <paper-icon-button icon="bookmark" className="bookmark-toggle">
                    </paper-icon-button>
                    <style is="custom-style" dangerouslySetInnerHTML={{ __html: this._getTabsStyle()}}/>
                    <paper-toolbar className="seasons-wrapper">
                        <paper-tabs selected="0" className="season-tabs bottom" noink scrollable>
                            <paper-tab onClick={() => this.setState({season: -1})} className="season">Show Info</paper-tab>
                            {
                                seasons.map(({number, images, episodes}, idx) => {
                                    let titletext = number === 0 ? 'special features' : 'season'
                                    if(number !== 0) titletext = titletext + ` ${number}`
                                    return <paper-tab key={idx+1} onClick={() => this.setState({season: number, episode: episodes[0].number})} className="season">{titletext}</paper-tab>
                                })
                            }
                        </paper-tabs>
                    </paper-toolbar>
                </div>
                <div className="info-wrapper">
                    <img src={this.state.posterImage} className="poster" />
                    <div className={`meta-container show-info ${(this.state.season === -1 ? 'episode-list-show' : '')}`}>
                        <div className="meta-item">
                            <paper-icon-button noink icon="star" className="star"/>
                            <paper-icon-button noink icon="star" className="star"/>
                            <paper-icon-button noink icon="star-half" className="star"/>
                            <paper-icon-button noink icon="star-border" className="star"/>
                            <paper-icon-button noink icon="star-border" className="star"/>
                            <span className="meta-dot first"/>
                            <p>{genres.slice(0,3).join(', ')}</p>
                            <span className="meta-dot"/>
                            <p>{year} - {(status === 'returning series') ? 'ongoing' : 'ended'}</p>
                            <span className="meta-dot"/>
                            <p>{runtime} min</p>
                        </div>
                        <div className="meta-synop">{overview}</div>
                        <paper-button id="trakt-link" className="meta-btn">
                             More Info
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
                    <div className="episode-container">
                        {this._getEpisodes()}
                    </div>
                    <div className="controls-container">
                        <paper-button raised className="watchnow-btn">Play <span>{`S${('0' + this.state.season).slice(-2)}E${('0' + this.state.episode).slice(-2)}`}</span></paper-button>
                    </div>
                </div>
            </div>
        )
    }
}
import React, { Component } from 'React'
import ReactCSSTransitionReplace from 'react-css-transition-replace'
import { shell } from 'electron'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'
import localforage from 'localforage'


export default class Backdrop extends Component {

    state = {
        trending: [],
        backdrop: {
            image: ''
        }
    };

    componentWillMount() {
        this.mounted = false
        clearTimeout(this.backdropTimeout)
    }

    componentDidMount() {
        localforage.getItem('last-search-backdrop')
            .then(lastItem => {
                let delay = 0
                if (lastItem) {
                    delay = 30000
                    this._loadBackdrop(lastItem).then(() => this.setState({ backdrop: lastItem }))
                }
                if (this.props.workers.initiated)
                    this._getTrending(delay)
                else
                    this.props.workers.once('workers:initiated', () => this._getTrending(delay))
            })
            .catch(console.error)
        this.mounted = true
    }

    _getTrending = (delay = 0) => {
        const { sockets } = this.props.workers.socket
        const requestID = uuid()
        sockets.emit('trakt:get:trending', { id: requestID, type: 'all' })
        this.props.workers.once(requestID, ({ movies, shows }) => {
            this.setState({ trending: movies.concat(shows) })
            this.backdropTimeout = setTimeout(this._getNewBackdrop, delay)
        })
    };

    _getNewBackdrop = () => {
        if (!this.mounted || this.state.trending.length === 0) return

        const { sockets } = this.props.workers.socket
        const requestID = uuid()

        const { trending } = this.state
        const trendingItem = trending[Math.floor(Math.random() * trending.length)]
        const itmeType = trendingItem.show ? 'show' : 'movie'

        sockets.emit(`trakt:get:${itmeType}`, { id: requestID, ...trendingItem[itmeType].ids })

        this.props.workers.once(requestID, ({ images, certification = 'Unrated', title, year, homepage }) => {
            const backdrop = {
                homepage,
                image: images.fanart.full,
                certification: certification.length > 0 ? certification : 'Unrated',
                title,
                year
            }
            this._loadBackdrop(backdrop).then(() => {
                if (!this.mounted) return
                this.setState({
                    trending: _.filter(trending, item => !_.isEqual(item, trendingItem)),
                    backdrop
                })
                localforage.setItem('last-search-backdrop', backdrop)
                this.backdropTimeout = setTimeout(this._getNewBackdrop, 30000)
            })
        })
    };

    _loadBackdrop = ({ image }) => {
        return new Promise(resolve => {
            let backdropImage = new Image()
            backdropImage.onload = () => {
                resolve()
                _.defer(() => backdropImage = null)
            }
            backdropImage.src = image
        })
    };

    _openBackDropURL = () => {
        if (!this.state.backdrop || !this.state.backdrop.homepage) return
        shell.openExternal(this.state.backdrop.homepage)
    };

    render() {
        return (
            <ReactCSSTransitionReplace className="transition-container" transitionName="cross-fade" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                <div className='transition-container' key={this.state.backdrop.image}>
                    <div style={{ backgroundImage: `url(${this.state.backdrop.image})` }} className="search-container-backdrop" />
                    <div className="bottom-info-container">
                        <h1 onClick={this._openBackDropURL} className="title">{this.state.backdrop.title}</h1>
                        <span className="year">{this.state.backdrop.year}</span>
                        <p className="rating">{this.state.backdrop.certification}</p> 
                    </div> 
                </div> 
            </ReactCSSTransitionReplace>
        )
    }
}
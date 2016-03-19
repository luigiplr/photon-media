import React, { Component } from 'React'
import ReactCSSTransitionReplace from 'react-css-transition-replace'
import { shell } from 'electron'
import { delay, defer } from 'lodash'
import { v4 as uuid } from 'node-uuid'


export default class Backdrop extends Component {

    state = {
        backdrop: {
            image: ''
        }
    };

    componentWillMount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        if (this.props.workers.initiated)
            this._getNewBackdrop()
        else
            this.props.workers.once('workers:initiated', this._getNewBackdrop)
    }

    _getNewBackdrop = () => {
        if (!this.mounted) return

        const { sockets } = this.props.workers.socket
        const requestID = uuid()
        sockets.emit('trakt:get:trending', { id: requestID, type: 'all' })

        this.props.workers.once(requestID, ({ movies, shows }) => {
            const trending = movies.concat(shows)
            const item = trending[Math.floor(Math.random() * trending.length)]

            const type = item.show ? 'show' : 'movie'

            sockets.emit(`trakt:get:${type}`, { id: requestID, imdb: item[type].ids.imdb })

            this.props.workers.once(requestID, ({ images, certification = 'Unrated', title, year, homepage }) => {
                let backdropImage = new Image()
                backdropImage.onload = () => {
                    if (!this.mounted) return
                    this.setState({
                        backdrop: {
                            homepage,
                            image: images.fanart.full,
                            certification: certification.length > 0 ? certification : 'Unrated',
                            title,
                            year
                        }
                    })
                    delay(this._getNewBackdrop, 10000)
                    defer(() => backdropImage = null)
                }
                backdropImage.src = images.fanart.full
            })
        })
    };

    _openBackDropURL = () => {
        if (!this.state.backdrop || !this.state.backdrop.homepage) return
        shell.openExternal(this.state.backdrop.homepage)
    };

    render() {
        return (
            <ReactCSSTransitionReplace className='transition-container' transitionName="cross-fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                <div className='transition-container' key={this.state.backdrop.image}>
                    <div style={{backgroundImage: `url(${this.state.backdrop.image})`}} className="search-container-backdrop"/>
                    <div className="bottom-info-container">
                        <h1 onClick={this._openBackDropURL} className="title">{this.state.backdrop.title}</h1><span className="year">{this.state.backdrop.year}</span>
                        <p className="rating">{this.state.backdrop.certification}</p>
                    </div>
                </div>
            </ReactCSSTransitionReplace>
        )
    }
}

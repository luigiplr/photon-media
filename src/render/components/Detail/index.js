import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'

import titleMatcher from '../../utils/titleMatcher'
import LoadedDetail from './detail.react'


export default class Detail extends Component {

    state = {
        loading: true,
        detail: {
            type: 'none'
        }
    };

    static propTypes = {
        url: React.PropTypes.string.isRequired,
        workers: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true

        this._initURLParse()
    }

    _initURLParse = () => {
        const { url } = this.props
        const { sockets } = this.props.workers.socket
        const requestID = uuid()

        sockets.emit('urlParser:get', { id: requestID, url })

        this.props.workers.once(requestID, ({ parsed }) => {
            const { name } = parsed

            const matcher = new titleMatcher(this.props.workers, name)
            matcher.once('success', detail => this.setState({ detail }))
            matcher.once('error', error => {
                // Do something here UI wise later
                console.error(error)
            })
        })
    }

    _close = () => {
        _.defer(() => this.props.updatePage('search'))
    };

    _getSubDetail = () => {
        switch (this.state.detail.type) {
            case 'show':
            case 'movie':
                return <LoadedDetail {...this.state.detail} />
                break
            default:
                return null
        }
    };

    render() {
        return (
            <div className="detail">                
                <paper-icon-button onClick={this._close} className="back" icon="arrow-back"/>

                <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>

                <div className="loading-spinner-wrapper">
                    <paper-spinner className="loading-spinner thin" active={this.state.loading}/>
                </div>
                <ReactCSSTransitionGroup className="transition-container" transitionName="cross-fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    <div className='transition-container' key={this.state.detail.type}>
                       {this._getSubDetail()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
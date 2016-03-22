import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'

import titleMatcher from '../../utils/titleMatcher'
import LoadedDetail from './detail.react'
import WarningDialog from './warning.react'


export default class Detail extends Component {

    state = {
        error: null,
        status: `Parsing: "${this.props.url}"`,
        loading: true,
        detail: {
            type: 'none'
        }
    };

    static propTypes = {
        url: React.PropTypes.string.isRequired,
        workers: React.PropTypes.object.isRequired,
        settingsStore: React.PropTypes.object.isRequired
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
            if (!this.mounted) return
            const { name } = parsed
            this.setState({ status: `Parsing: "${name}"` })
            const matcher = new titleMatcher(this.props.workers, name)

            matcher.on('status', status => {
                if (!this.mounted) return
                this.setState({ status })
            })
            matcher.once('success', detail => {
                if (!this.mounted) return
                this.setState({ detail })
            })
            matcher.once('error', error => {
                if (!this.mounted) return
                this.setState({ error, loading: false })
            })
        })
    }

    _close() {
        _.defer(() => this.props.updatePage('search'))
    }

    _getSubDetail() {
        switch (this.state.detail.type) {
            case 'show':
            case 'movie':
                return <LoadedDetail {...this.state.detail} />
                break
            default:
                return null
        }
    }

    _getLoadingContents() {
        const { error, status } = this.state

        return (
            <div className="loading-spinner-wrapper">
                <style is="custom-style" dangerouslySetInnerHTML={{ __html: 'paper-spinner.thin {--paper-spinner-stroke-width: 2px;}'}}/>
                <h1 className="status-text">{(status ? status : error)}</h1>
                <paper-spinner className="loading-spinner thin" active={this.state.loading}/>
            </div>
        )
    }

    render() {
        return (
            <div className="detail">                
                <paper-icon-button onClick={::this._close} className="back" icon="arrow-back"/>
                {::this._getLoadingContents()}
                {(this.state.detail.illegitimate ? <WarningDialog settingsStore={this.props.settingsStore} /> : null)}
                <ReactCSSTransitionGroup className="transition-container" transitionName="cross-fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    <div className='transition-container' key={this.state.detail.type}>
                       {::this._getSubDetail()}
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
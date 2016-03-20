import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import { v4 as uuid } from 'node-uuid'

import MovieDetail from './components/movie.react'

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
        _.delay(() => this.setState({ detail: { type: 'movie' }, loading: false }), 3000)
    }

    _close = () => {
        _.defer(() => this.props.updatePage('search'))
    };

    _getSubDetail = () => {
        switch (this.state.detail.type) {
            case 'movie':
                return <MovieDetail/>
                break
            case 'show':
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
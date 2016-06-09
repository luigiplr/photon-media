import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styles from 'styles/Backdrop'


export default class Backdrop extends Component {

  state = {
    trending: [],
    backdrop: { image: '' }
  };

  defaultDelay = 20000;
  initialDelay = 5000;

  static propTypes = {
    url: PropTypes.string,
    info: PropTypes.object,
    infoIsEnabled: PropTypes.bool.isRequired
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  _openBackDropURL = () => {
    if (!this.state.backdrop || !this.state.backdrop.homepage) return
    shell.openExternal(this.state.backdrop.homepage)
  };

  render() {
    const { info, url } = this.props
    return (
      <ReactCSSTransitionGroup className={styles['transition-container']} transitionName="cross-fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='transition-container' key={url}>
          <div style={{ backgroundImage: `url(${url})` }} className={styles.backdrop} />
          <div className={styles['bottom-info-container']}>
            <h1 onClick={this._openBackDropURL} className={styles.title}>{info.title}</h1>
            <span className={styles.year}>{info.year}</span>
            <p className={styles.rating}>{info.certification}</p>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}
import React, { Component, PropTypes } from 'react'
import { shell } from 'electron'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styles from 'styles/Backdrop'


export default class Backdrop extends Component {
  static propTypes = {
    url: PropTypes.string,
    info: PropTypes.object,
    infoIsEnabled: PropTypes.bool.isRequired,
    isEnabled: PropTypes.bool.isRequired
  }

  defaultDelay = 20000
  initialDelay = 5000

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  render() {
    const { info, url, infoIsEnabled, isEnabled } = this.props
    const backgroundStyle = url ? { backgroundImage: `url(${url})` } : {}
    return (
      isEnabled ?
      <ReactCSSTransitionGroup
        component='div'
        className={styles['transition-container']}
        transitionName={{
          enter: styles['cross-fade-enter'],
          enterActive: styles['cross-fade-enter-active'],
          leave: styles['cross-fade-leave'],
          leaveActive: styles['cross-fade-leave-active'],
          appear: styles['cross-fade-appear'],
          appearActive: styles['cross-fade-appear-active']
        }}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <div className='transition-container' key={url || 'none'}>
          <div style={backgroundStyle} className={styles.backdrop} />
          {
            infoIsEnabled ? (
              <div className={styles['bottom-info-container']}>
                <h1 onClick={() => info.homepage && shell.openExternal(info.homepage)} className={`${styles.title} ${info.homepage ? styles.link : ''}`}>{info.title}</h1>
                <span className={styles.year}>{info.year}</span>
                <p className={styles.rating}>{info.certification}</p>
              </div>
            ): null
          }
        </div>
      </ReactCSSTransitionGroup> : null
    )
  }
}

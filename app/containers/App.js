import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Window } from 'react-desktop/windows'
import Header from './Header'
import Backdrop from './Backdrop'
import styles from 'styles/App'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object.isRequired
  }

  static defaultProps = {
    color: '#212121',
    theme: 'dark'
  }

  render() {
    const { location, children } = this.props
    return (
      <div className={styles.app}>
        <Header />
        <Backdrop key={location.pathname} />
        <div className={styles.appContainer}>
          {React.cloneElement(children, { key: location.pathname })}
        </div>
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools') // eslint-disable-line global-require
                return <DevTools />
            }
          })()
        }

      </div>
    )
  }
}

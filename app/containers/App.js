import React, { Component, PropTypes } from 'react'
import { Window } from 'react-desktop/windows'
import Header from './Header'
import Backdrop from './Backdrop'
import styles from 'styles/App'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    color: '#212121',
    theme: 'dark'
  }

  render() {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.appContainer}>
          {this.props.children}
        </div>
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools') // eslint-disable-line global-require
                return <DevTools />
            }
          })()
        }
        <Backdrop/>
      </div>
    )
  }
}

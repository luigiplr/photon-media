import React, { Component, PropTypes } from 'react'
import { Window } from 'react-desktop/windows'
import Header from './Header'
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
        {this.props.children}
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

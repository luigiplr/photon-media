import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { remote } from 'electron'
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

  state = {
    focused: remote.getCurrentWindow().isFocused()
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.on('focus', () => this.setState({ focused: true }))
      browserWindow.on('blur', () => this.setState({ focused: false }))
    }
  }

  render() {
    const { location, children } = this.props
    return (
      <div className={`${styles.app} ${this.state.focused ? styles.focused: ''}`}>
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

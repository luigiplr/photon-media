import React, { Component, PropTypes } from 'react'
import { TitleBar } from 'react-desktop/windows'
import { remote } from 'electron'
import { defer } from 'lodash'
import { Link } from 'react-router'

export default class Header extends Component {
  static propTypes = {
    isMaximized: PropTypes.bool.isRequired,
    isClosed: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    maximize: PropTypes.func.isRequired,
    minimize: PropTypes.func.isRequired,
    restore: PropTypes.func.isRequired
  }

  static defaultProps = {
    color: 'transparent',
    theme: 'dark'
  }

  componentDidMount() {
    const browserWindow = remote.getCurrentWindow()

    browserWindow.on('maximize', () => defer(() => !this.props.isMaximized && this.props.maximize(true)))
    browserWindow.on('unmaximize', () => defer(() => this.props.isMaximized && this.props.restore(true)))
  }

  render() {
    return (
      <TitleBar
        title=' '
        controls
        isMaximized={this.props.isMaximized}
        theme={this.props.theme}
        background={this.props.color}
        onCloseClick={this.props.close}
        onMinimizeClick={this.props.minimize}
        onMaximizeClick={() => this.props.maximize()}
        onResizeClick={() => this.props.restore()}
      />
    )
  }
}

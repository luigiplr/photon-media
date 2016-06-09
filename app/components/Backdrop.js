import React, { Component, PropTypes } from 'react'
import styles from 'styles/Backdrop'


export default class Backdrop extends Component {
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

  render() {
    return (
      <div className={styles['search-container']}>

      </div>
    )
  }
}

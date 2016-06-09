import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from 'styles/Home'


export default class Home extends Component {
  static propTypes = {

  }

  state = {}

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  render() {
    return (
      <div className={styles['search-container']}>
        <div className={styles['bottom-button-container']}>
          <paper-icon-button className={styles['bottom-btn']} icon="settings"/>
        </div>

        <paper-material className={styles['search-box-contain']} elevation="1">
          <input ref="searchtext" className={styles.searchtext}/>
          <paper-icon-button className={styles['search-btn']} icon='chevron-right'/>
        </paper-material>
      </div>
    )
  }
}

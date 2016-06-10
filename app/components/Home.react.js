import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from 'styles/Home'

export default class Home extends Component {
  static propTypes = {
    backdrop: PropTypes.object.isRequired
  }

  state = {}

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
    this.props.backdrop.change({
      title: 'House of Cards',
      year: '2013',
      certification: 'TV-MA'
    }, 'https://walter.trakt.us/images/shows/000/001/416/fanarts/original/28b9159c81.jpg')
  }

  render() {
    return (
      <div className={styles['search-container']}>
        <Link to='/settings' className={styles['bottom-button-container']}>
          <paper-icon-button className={styles['bottom-btn']} icon="settings"/>
        </Link>

        <paper-material className={styles['search-box-contain']} elevation="1">
          <input ref="searchtext" className={styles.searchtext}/>
          <paper-icon-button className={styles['search-btn']} icon='chevron-right'/>
        </paper-material>
      </div>
    )
  }
}

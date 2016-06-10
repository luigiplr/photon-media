import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from 'styles/Settings'

export default class Settings extends Component {

  state = {
    tab: 'general'
  }

  _settingsTabStyles = `
    paper-checkbox {
        --paper-checkbox-label-color: #fff;
        --paper-checkbox-unchecked-color: var(--paper-grey-500);
    }
  `

  render() {
    return (
      <div className={styles.settings}>
        <Link to='/' className={styles['bottom-button-container']}>
          <paper-icon-button className={styles.back} icon="arrow-back"/>
        </Link>
        <div className="container">
          <h1>Settings</h1>
          <div className="panel-container">
          </div>
        </div>
      </div>
    )
  }
}

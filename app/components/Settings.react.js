import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from 'styles/Settings'

export default class Settings extends Component {

  static propTypes = {
    backdrop: PropTypes.object.isRequired
  }

  state = {
    tab: 'general'
  }

  _settingsTabStyles = `
    paper-checkbox {
        --paper-checkbox-label-color: #fff;
        --paper-checkbox-unchecked-color: var(--paper-grey-500);
    }
  `

  componentWillMount() {
    this.props.backdrop.disable()
  }

  componentWillUnmount() {
    this.props.backdrop.enable()
  }

  render() {
    return (
      <div className={styles.settings}>
        <Link to='/' className={styles.backContainer}>
          <paper-icon-button className={styles.back} icon="arrow-back"/>
        </Link>
        <div className={styles.container}>
          <h1>Settings</h1>
          <div className={styles['panel-container']}>
            {settingTabs()}
          </div>
        </div>
      </div>
    )
  }
}

const settingTabs = () => {
  const tabStyles = `
    .paper-item-0 {
      --paper-item-selected-weight: 500 !important;
      --paper-item-focused-before: {
        opacity: 0;
      }
    };
  `
  return (
    <div className={styles['left-panel']}>
      <style is="custom-style" dangerouslySetInnerHTML={{ __html: tabStyles}}/>
      <paper-listbox className={styles['settings-tab-container']} selected="0">

      </paper-listbox>
    </div>
  )
}
